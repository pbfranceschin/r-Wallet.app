import { encodeFunctionData } from "viem";
import { NETWORK_ID  } from "./config";
import contracts from "./contracts/hardhat_contracts.json";
import * as wallet from "./contracts/Wallet.json";

const allContracts = contracts as any;

export const getMktPlaceData = () => {
    const address = allContracts[NETWORK_ID][0].contracts.MarketPlace.address;
    const abi = allContracts[NETWORK_ID][0].contracts.MarketPlace.abi;

    return [address, abi];
}

export const getFactoryData = () => {
    const address = allContracts[NETWORK_ID][0].contracts.RenterWalletFactory.address;
    const abi =  allContracts[NETWORK_ID][0].contracts.RenterWalletFactory.abi;
    
    return [address, abi];
}

export const getNftData = () => {
    const address = allContracts[NETWORK_ID][0].contracts.NFT.address;
    const abi =  allContracts[NETWORK_ID][0].contracts.NFT.abi;
    
    return [address, abi];
}

export const getWalletAbi = () => {
    return wallet.abi;
}