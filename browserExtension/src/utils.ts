import { ethers } from "ethers";
import { Provider } from '@ethersproject/providers';
import axios, { AxiosInstance } from 'axios';
import NFT from "./NFT.json";
import MarketPlace from "./MarketPlace.json";
import BaseMarketPlace from "./BaseMarketPlace.json";
import { ContractInterface, Contract } from '@ethersproject/contracts';
import { erc721ABI } from "wagmi";

interface NFT {
  address: string;
  abi: ContractInterface;
}

const contractAddress: string = NFT.address;
const contractABI: ContractInterface = NFT.abi;
const mktPlaceAddress: string = BaseMarketPlace.address;
const mktPlaceAbi: ContractInterface = BaseMarketPlace.abi; 

export const getMktPlaceData = () => {
  return [mktPlaceAddress, mktPlaceAbi];
}

export const getContractData = (): [string, ContractInterface] => {
  return [contractAddress, contractABI];
};

// receives an ethers provider and returns a contract instance
export const getEthersNftContract = (address: string, provider: Provider) => {
  const contract = new ethers.Contract(
    address,
    erc721ABI,
    provider
  );
  return contract
}

export const ipfsToHTTP = (ipfsName: string) => {
  if (ipfsName.includes("ipfs://"))
    return ipfsName.replace("ipfs://", "https://ipfs.io/ipfs/")
  return ipfsName
}

export const getTokenMetadata = async (provider: Provider, tokenId: number) => {
  const nftContract = getEthersNftContract(provider)
  const tokenUri = await nftContract.tokenURI(tokenId)
  return axios.get(ipfsToHTTP(tokenUri))
}

export const stringShortener = (str: string, limit: number) => {
  if (str && str.length > limit) {
    const sliceSize = 15
    return `${str.slice(0, sliceSize)}...${str.slice(
      str.length - sliceSize,
      str.length
    )}`;
  }
  return str;
};

export const stringTrim = (str: string, limit: number) => {
  if (str && str.length > limit) {
    return `${str.slice(0, limit)}...`;
  }
  return str;
};