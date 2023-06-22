import { ethers } from "ethers";
import { Provider } from '@ethersproject/providers';
import axios, { AxiosInstance } from 'axios';
import NFT from "./NFT.json";
import { ContractInterface, Contract } from '@ethersproject/contracts';

interface NFT {
  address: string;
  abi: ContractInterface;
}

const contractAddress: string = NFT.address;
const contractABI: ContractInterface = NFT.abi;

export const getContractData = (): [string, ContractInterface] => {
  return [contractAddress, contractABI];
};

// receives an ethers provider and returns a contract instance
export const getEthersNftContract = (provider: Provider) => {
  const contract = new ethers.Contract(
    contractAddress,
    contractABI,
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