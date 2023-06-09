import * as contract from '../deployments/sepolia/RWalletFactory.json';
import { ethers } from 'ethers';
import { RWalletFactory } from '../typechain';
import dotenv from 'dotenv';

dotenv.config({ path: __dirname+'/../.env' });

const newWallet = '0x94F79a0733f7DBC066253BBaE4003E2f86d28A3d';
const apiKey = process.env.INFURA_API_KEY;

const main = async () => {
    if(!apiKey) throw new Error("missing env: API_KEY");
    const provider = new ethers.providers.InfuraProvider("sepolia", apiKey );
    const walletFactory = new ethers.Contract(
        contract.address,
        contract.abi,
        provider
    ) as RWalletFactory;
    
    // console.log(provider);
    const isWallet = await walletFactory.isWallet(newWallet);
    console.log(isWallet);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});