import { BigNumber, ethers } from "ethers";
import * as nft from '../artifacts/contracts/samples/NFT.sol/NFT.json';
import * as dotenv from 'dotenv';

dotenv.config();

const pkey = process.env.PRIVATE_KEY;
const nftAddress = '0x223b44812f1dF181e68B6475039eEC44f708Da7f';
const walletAddress = '0x6711645aB591f86B31CC97667f393A78d01f5Ca0';
const dummy1 = '0x099A294Bffb99Cb2350A6b6cA802712D9C96676A';
const aurora_silo_url = 'https://hackathon.aurora.dev';
const aurora_testnet_url = 'https://testnet.aurora.dev';

const main = async () => {
    if(!pkey) throw new Error('missing env');
    const provider = ethers.getDefaultProvider('sepolia');
    // const provider = new ethers.providers.JsonRpcProvider(aurora_testnet_url);
    // const signer =  new ethers.Wallet(pkey, provider);
    // const addr = await signer.getAddress();
    // console.log('pubkey', addr);
    // const nftContract = new ethers.Contract(nftAddress, nft.abi, signer);
    // const mint = await nftContract.safeMint(addr);
    // const receipt = await mint.wait();
    // console.log(receipt);
    // const nftOwner = await nftContract.ownerOf(BigNumber.from(0));
    // console.log(nftOwner == dummy1);

    // console.log(await provider.getFeeData());

    console.log(ethers.utils.id("WalletCreated(address,address)") == '0x5b03bfed1c14a02bdeceb5fa582eb1a5765fc0bc64ca0e6af4c20afc9487f081');
}

main();