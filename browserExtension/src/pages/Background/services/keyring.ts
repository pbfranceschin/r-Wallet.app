import { keyringUnlocked, Vault, vaultUpdate } from '../redux-slices/keyrings';
import BaseService, { BaseServiceCreateProps } from './base';
import MainServiceManager from './main';
import { ServiceLifecycleEvents } from './types';
import * as encryptor from '@metamask/browser-passworder';
import { Provider } from '@ethersproject/providers';
import { BigNumber, ethers, providers } from 'ethers';
import { AccountApiType } from '../../Account/account-api/types';
import {
  AccountImplementations,
  ActiveAccountImplementation,
} from '../constants';
import { HttpRpcClient, PaymasterAPI } from '@account-abstraction/sdk';
import { MessageSigningRequest } from '../redux-slices/signing';
import { AccountData } from '../redux-slices/account';
import { AccountBalance } from '../types/account';
import { DomainName, URI } from '../types/common';
import { EVMNetwork } from '../types/network';
import { EthersTransactionRequest } from './types';
import { UserOperationStruct } from '@account-abstraction/contracts';
import * as entryPointData from './EntryPoint.json';
import * as contractData from '../../../../contracts/hardhat_contracts.json';
//import * as dotenv from 'dotenv';
// dotenv.config({ path: __dirname+'../../../../.env' });

import config from '../../../exconfig';


interface Events extends ServiceLifecycleEvents {
  createPassword: string;
}

type KeyringSerialisedState = {
  type: string;
  address: string;
  data: any;
};

export type KeyringServiceCreateProps = {
  initialState?: Vault;
  provider: string;
  bundler: string;
  entryPointAddress: string;
} & BaseServiceCreateProps;

export default class KeyringService extends BaseService<Events> {
  keyrings: {
    [address: string]: AccountApiType;
  };
  vault?: string;
  password?: string;
  encryptionKey?: string;
  encryptionSalt?: string;
  provider: Provider;
  bundler?: HttpRpcClient;
  paymasterAPI?: PaymasterAPI;

  constructor(
    readonly mainServiceManager: MainServiceManager,
    provider: string,
    bundler: string,
    readonly entryPointAddress: string,
    vault?: string
  ) {
    super();
    this.keyrings = {};
    this.provider = new ethers.providers.JsonRpcBatchProvider(provider);
    this.provider
      .getNetwork()
      .then((net) => net.chainId)
      .then(async (chainId) => {
        let bundlerRPC;
        try {
          bundlerRPC = new ethers.providers.JsonRpcProvider(bundler);
        } catch (e) {
          throw new Error(`Bundler network is not connected on url ${bundler}`);
        }

        if (bundlerRPC) {
          const supportedEntryPoint = await bundlerRPC.send(
            'eth_supportedEntryPoints',
            []
          );
          if (!supportedEntryPoint.includes(entryPointAddress)) {
            throw new Error(
              `Bundler network doesn't support entryPoint ${entryPointAddress}`
            );
          }
        }

        const code = await this.provider.getCode(entryPointAddress);
        if (code === '0x')
          throw new Error(`Entrypoint not deployed at ${entryPointAddress}`);

        this.bundler = new HttpRpcClient(bundler, entryPointAddress, chainId);
      });

    this.vault = vault;
  }

  async unlockVault(
    password?: string,
    encryptionKey?: string,
    encryptionSalt?: string
  ): Promise<{ [address: string]: AccountApiType }> {
    if (!this.vault) throw new Error('No vault to restore');

    let vault: any;

    if (password) {
      const result = await encryptor.decryptWithDetail(password, this.vault);
      vault = result.vault;
      this.password = password;
      this.encryptionKey = result.exportedKeyString;
      this.encryptionSalt = result.salt;
    } else {
      const parsedEncryptedVault = JSON.parse(this.vault);

      if (encryptionSalt !== parsedEncryptedVault.salt) {
        throw new Error('Encryption key and salt provided are expired');
      }

      const key = await encryptor.importKey(encryptionKey || '');
      vault = await encryptor.decryptWithKey(key, parsedEncryptedVault);

      this.encryptionKey = encryptionKey;
      this.encryptionSalt = encryptionSalt;
    }

    await Promise.all(vault.map(this._restoreKeyring));
    return this.keyrings;
  }

  /**
   * Restore Keyring Helper
   *
   * Attempts to initialize a new keyring from the provided serialized payload.
   * On success, returns the resulting keyring instance.
   *
   * @param {object} serialized - The serialized keyring.
   * @returns {Promise<Keyring|undefined>} The deserialized keyring or undefined if the keyring type is unsupported.
   */
  _restoreKeyring = async (
    serialized: KeyringSerialisedState
  ): Promise<AccountApiType | undefined> => {
    const { address, type, data } = serialized;

    const keyring = await this._newKeyring(address, type, data);

    this.keyrings[address] = keyring;

    return keyring;
  };

  /**
   * Instantiate, initialize and return a new keyring
   *
   * The keyring instantiated is of the given `type`.
   *
   * @param {string} type - The type of keyring to add.
   * @param {object} data - The data to restore a previously serialized keyring.
   * @returns {Promise<Keyring>} The new keyring.
   */
  async _newKeyring(
    address: string,
    type: string,
    data: any
  ): Promise<AccountApiType> {
    const account = new AccountImplementations[type]({
      provider: this.provider,
      entryPointAddress: this.entryPointAddress,
      paymasterAPI: this.paymasterAPI,
      deserializeState: data,
    });

    return account;
  }

  /**
   * Clear Keyrings
   *
   * Deallocates all currently managed keyrings and accounts.
   * Used before initializing a new vault.
   */

  /* eslint-disable require-await */
  clearKeyrings = async (): Promise<void> => {
    // clear keyrings from memory
    this.keyrings = {};
  };

  registerEventListeners = () => {};

  removeEventListeners = () => {};

  updateStore = () => {};

  createPassword = async (password: string) => {
    this.password = password;
    await this.persistAllKeyrings();
    this.keyringUnlocked();
  };

  keyringUnlocked = () => {
    this.mainServiceManager.store.dispatch(keyringUnlocked());
  };

  persistAllKeyrings = async () => {
    if (!this.password && !this.encryptionKey) {
      throw new Error(
        'Cannot persist vault without password and encryption key'
      );
    }

    const serializedKeyrings: KeyringSerialisedState[] = await Promise.all(
      Object.values(this.keyrings).map(async (keyring) => {
        const [address, data] = await Promise.all([
          await keyring.getAccountAddress(),
          keyring.serialize(),
        ]);
        return { type: ActiveAccountImplementation, address, data };
      })
    );

    let vault: string;

    if (this.password) {
      const { vault: newVault, exportedKeyString } =
        await encryptor.encryptWithDetail(this.password, serializedKeyrings);
      vault = newVault;
      this.encryptionKey = exportedKeyString;
      this.encryptionSalt = JSON.parse(newVault).salt;
    } else {
      const key = await encryptor.importKey(this.encryptionKey || '');
      const vaultJSON = await encryptor.encryptWithKey(key, serializedKeyrings);
      vaultJSON.salt = this.encryptionSalt;
      vault = JSON.stringify(vaultJSON);
    }

    this.mainServiceManager.store.dispatch(
      vaultUpdate({
        vault,
        encryptionKey: this.encryptionKey,
        encryptionSalt: this.encryptionSalt,
      })
    );
  };

  sendUnlockKeyringChromeMessage = () => {};

  createKeyringForImplementation = async (implementation: string) => {};

  addAccount = async (
    implementation: string,
    context?: any
  ): Promise<string> => {
    const account = new AccountImplementations[implementation]({
      provider: this.provider,
      entryPointAddress: this.entryPointAddress,
      context,
      paymasterAPI: this.paymasterAPI,
    });
    const address = await account.getAccountAddress();
    if (address === ethers.constants.AddressZero)
      throw new Error(
        `EntryPoint getAccountAddress returned error and returned address ${ethers.constants.AddressZero}, check factory contract is properly deployed.`
      );
    this.keyrings[address] = account;
    await this.persistAllKeyrings();
    return account.getAccountAddress();
  };

  getAccountData = async (
    address: string,
    activeNetwork: EVMNetwork
  ): Promise<{
    accountDeployed: boolean;
    minimumRequiredFunds: string;
    balances?: {
      [assetSymbol: string]: AccountBalance;
    };
    ens?: {
      name?: DomainName;
      avatarURL?: URI;
    };
  }> => {
    const response: {
      accountDeployed: boolean;
      minimumRequiredFunds: string;
      balances?: {
        [assetSymbol: string]: AccountBalance;
      };
      ens?: {
        name?: DomainName;
        avatarURL?: URI;
      };
    } = {
      accountDeployed: false,
      minimumRequiredFunds: '0',
      balances: undefined,
      ens: undefined,
    };
    const code = await this.provider.getCode(address);
    if (code !== '0x') response.accountDeployed = true;

    const keyring = this.keyrings[address];

    response.minimumRequiredFunds = ethers.utils.formatEther(
      BigNumber.from(
        await keyring.estimateCreationGas(await keyring.getInitCode())
      )
    );

    const balance = await this.provider.getBalance(address);

    response.balances = {
      [activeNetwork.baseAsset.symbol]: {
        address: '0x',
        assetAmount: {
          asset: {
            symbol: activeNetwork.baseAsset.symbol,
            name: activeNetwork.baseAsset.name,
          },
          amount: ethers.utils.formatEther(balance),
        },
        network: activeNetwork,
        retrievedAt: Date.now(),
        dataSource: 'custom',
      },
    };

    return response;
  };

  personalSign = async (
    address: string,
    context: any,
    request?: MessageSigningRequest
  ): Promise<string> => {
    const keyring = this.keyrings[address];

    if (!keyring) throw new Error('No keyring for the address found');

    return keyring.signMessage(context, request);
  };

  callAccountApi = async (
    address: string,
    functionName: string,
    args?: any[]
  ) => {
    const keyring = this.keyrings[address];

    return args ? keyring[functionName](...args) : keyring[functionName]();
  };

  signUserOpWithContext = async (
    address: string,
    userOp: UserOperationStruct,
    context?: any
  ): Promise<UserOperationStruct> => {
    const keyring = this.keyrings[address];

    return keyring.signUserOpWithContext(userOp, context);
  };

  // sendUserOp = async (
  //   address: string,
  //   userOp: UserOperationStruct
  // ): Promise<string | null> => {
  //   if (this.bundler) {
  //     const userOpHash = await this.bundler.sendUserOpToBundler(userOp);
  //     const keyring = this.keyrings[address];
  //     return await keyring.getUserOpReceipt(userOpHash);
  //   }
  //   return null;
  // };


// Assume PRIVATE_KEY, ENTRY_POINT_ADDRESS, and PROVIDER are defined somewhere else

  sendUserOp = async (
    address: string,
    userOp: UserOperationStruct
  ): Promise<string | null> => {
    // const providerURL = process.env.INFURA_URL;
    // const pkey = process.env.PRIVATE_KEY;
    // const entryPoint = process.env.ENTRY_POINT;
    // const providerURL = 'https://sepolia.infura.io/v3/c44125ff3ee1413eb99bf8a4b5b18e61';
    const providerURL = config.network.provider;
    // const pkey = 'f02d097a4059c83f459856e8455f63ad8fc1b260ba35871ac03d60e94304712c';
    // const _entryPoint = config.network.entryPointAddress;
    // console.log('teste11111')
    if(!providerURL ) throw new Error("keyring sendUserOp: mising provider");
    const provider = new ethers.providers.JsonRpcProvider(providerURL);
    console.log('arg: address',address);
    const simpleAccount = this.keyrings[address] as any;
    const pkey = simpleAccount.owner.privateKey;
    const index = simpleAccount.index;
    const owner = new ethers.Wallet(pkey, provider);
    console.log(owner);
    // throw new Error('break');
    // const _entryPointInterface = new ethers.utils.Interface([
    //   'function handleOps(UserOperation[] calldata ops, address payable beneficiary) external payable',
    // ]);
    // const values: ReadonlyArray<any> = [[userOp], wallet.address];
    // const data = _entryPointInterface.encodeFunctionData('handleOps', values);
    const code = await provider.getCode(address);
    if(code === '0x'){
      console.log('initCodeCall');
      const iface = new ethers.utils.Interface([
        'function createAccount(address owner,uint256 salt) public returns (RWallet ret)'
      ]);
      const iface2 = new ethers.utils.Interface([
        'function isWallet(address account) public view returns(bool)'
      ]); 
      const factoryAddress = config.factory_address;
      const contract = new ethers.Contract(factoryAddress, iface, owner);
      // const ret = await contract.isWallet(address);
      // console.log(ret);
      const create = await contract.createAccount(owner.address, index);
      const receipt = await create.wait();
      console.log(receipt);
      return receipt.transactionHash; 
      // return null
    } 
    else {
      const walletInterface = new ethers.utils.Interface([
        'function execute(address dest, uint256 value, bytes calldata func) external'
      ]);
      console.log(address);
      const contract = new ethers.Contract(address, walletInterface, owner);
      const data = walletInterface.decodeFunctionData('execute', (await userOp.callData));
      console.log(`value: ${data.value} dest: ${data.dest}, func ${data.func}`);
      const tx = await contract.execute(data.dest, data.value, data.func);
      console.log(tx);
      const receipt = await tx.wait();
      console.log(receipt);
      return receipt.transactionHash;
    }
    return null;
    
    // const transaction: providers.TransactionRequest = {
    //   to: entryPoint,
    //   data: data,
    //   value: ethers.utils.parseEther('0'), // Set the value as needed
    // };
  
    // Estimate the gas limit
    // transaction.gasLimit = await wallet.estimateGas(transaction);
  
    // Sign the transaction with the wallet
    // const signedTransaction = await wallet.signTransaction(transaction);
  
    // Send the transaction
    // const txResponse = await provider.sendTransaction(signedTransaction);
  
    // Wait for the transaction to be mined
    // const txReceipt = await txResponse.wait();
  
    // Return the transaction hash
    // return txReceipt.transactionHash;
  };
  

  createUnsignedUserOp = async (
    address: string,
    transaction: EthersTransactionRequest
  ): Promise<UserOperationStruct> => {
    const keyring = this.keyrings[address];
    console.log('create unsig 1')
    const userOp = await keyring.createUnsignedUserOp({
      target: transaction.to,
      data: transaction.data
        ? ethers.utils.hexConcat([transaction.data])
        : '0x',
      value: transaction.value
        ? ethers.BigNumber.from(transaction.value)
        : undefined,
      gasLimit: transaction.gasLimit,
      maxFeePerGas: transaction.maxFeePerGas,
      maxPriorityFeePerGas: transaction.maxPriorityFeePerGas,
    });
    console.log('create unsig 2')

    userOp.sender = await userOp.sender;
    userOp.nonce = ethers.BigNumber.from(await userOp.nonce).toHexString();
    userOp.initCode = await userOp.initCode;
    userOp.callData = await userOp.callData;
    userOp.callGasLimit = ethers.BigNumber.from(
      await userOp.callGasLimit
    ).toHexString();
    console.log('create unsig 3')
    userOp.verificationGasLimit = ethers.BigNumber.from(
      await userOp.verificationGasLimit
    ).toHexString();
    console.log('create unsig 4')
    // userOp.preVerificationGas = await userOp.preVerificationGas;
    userOp.preVerificationGas = ethers.BigNumber.from('1');
    console.log('create unsig 4.5')
    userOp.maxFeePerGas = ethers.BigNumber.from(
      // await userOp.maxFeePerGas
      '1'
    ).toHexString();
    console.log('create unsig 5')
    userOp.maxPriorityFeePerGas = ethers.BigNumber.from(
      // await userOp.maxPriorityFeePerGas
      '1'
    ).toHexString();
    console.log('create unsig 6')
    userOp.paymasterAndData = await userOp.paymasterAndData;
    userOp.signature = await userOp.signature;

    console.log('trosso 1')
    const gasParameters = await this.bundler?.estimateUserOpGas(
      await keyring.signUserOp(userOp)
    );
    console.log('trosso 2')
    const estimatedGasLimit = ethers.BigNumber.from(
      // gasParameters?.callGasLimit
      '100000'
    );
    console.log('trosso 3')
    const estimateVerificationGasLimit = ethers.BigNumber.from(
      // gasParameters?.verificationGas
      '100000'
    );
    console.log('trosso 4')
    const estimatePreVerificationGas = ethers.BigNumber.from(
      // gasParameters?.preVerificationGas
      '100000'
    );
    console.log('ultimo trosso')
    userOp.callGasLimit = estimatedGasLimit.gt(
      ethers.BigNumber.from(userOp.callGasLimit)
    )
      ? estimatedGasLimit.toHexString()
      : userOp.callGasLimit;

    userOp.verificationGasLimit = estimateVerificationGasLimit.gt(
      ethers.BigNumber.from(userOp.verificationGasLimit)
    )
      ? estimateVerificationGasLimit.toHexString()
      : userOp.verificationGasLimit;

    userOp.preVerificationGas = estimatePreVerificationGas.gt(
      ethers.BigNumber.from(userOp.preVerificationGas)
    )
      ? estimatePreVerificationGas.toHexString()
      : userOp.preVerificationGas;

    return userOp;
  };

  validateKeyringViewInputValue = async () => {};

  static async create({
    mainServiceManager,
    initialState,
    provider,
    bundler,
    entryPointAddress,
  }: KeyringServiceCreateProps): Promise<KeyringService> {
    if (!mainServiceManager)
      throw new Error('mainServiceManager is needed for Keyring Servie');

    const keyringService = new KeyringService(
      mainServiceManager,
      provider,
      bundler,
      entryPointAddress,
      initialState?.vault
    );

    if (initialState?.encryptionKey && initialState?.encryptionSalt) {
      await keyringService.unlockVault(
        undefined,
        initialState?.encryptionKey,
        initialState?.encryptionSalt
      );
    }

    return keyringService;
  }

  _startService = async (): Promise<void> => {
    this.registerEventListeners();
  };

  _stopService = async (): Promise<void> => {
    this.removeEventListeners();
  };
}
