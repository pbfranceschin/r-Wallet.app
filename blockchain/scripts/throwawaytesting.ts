import { ethers } from "ethers";
import * as nft from '../artifacts/contracts/samples/NFT.sol/NFT.json';
const nftAddress = '0x0A952031d753270f275C243EE92dbA431feE14a1';
const walletAddress = '0x6711645aB591f86B31CC97667f393A78d01f5Ca0';
const dummy1 = '0x099A294Bffb99Cb2350A6b6cA802712D9C96676A';

const main = async () => {
    const provider = ethers.getDefaultProvider('sepolia');
    const nftContract = new ethers.Contract(nftAddress, nft.abi, provider);
    const nftOwner = await nftContract.ownerOf(0);
    console.log(nftOwner == dummy1);
}

main();