// eslint-disable-next-line import/no-anonymous-default-export
import * as dotenv from 'dotenv';
dotenv.config({ path: __dirname+'../.env' });
import contracts from "../contracts/hardhat_contracts.json";
const networkID = 11155111 // sepolia
const factory_address = contracts[networkID][0].contracts.RWalletFactory.address;
const entryPointAddress = '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789' // sepolia

export default {
  enablePasswordEncryption: false,
  showTransactionConfirmationScreen: true,
  factory_address: factory_address,
  stateVersion: '0.1',
  network: {
    chainID: String(networkID),
    family: 'EVM',
    name: 'Sepolia',
    provider: `https://sepolia.infura.io/v3/2202743dabe54d42aeaeb61dbb4e12f0`,
    entryPointAddress: entryPointAddress,
    bundler: 'https://sepolia.voltaire.candidewallet.com/rpc',
    baseAsset: {
      symbol: 'ETH',
      name: 'ETH',
      decimals: 18,
      image:
        'https://ethereum.org/static/6b935ac0e6194247347855dc3d328e83/6ed5f/eth-diamond-black.webp',
    },
  },
};
