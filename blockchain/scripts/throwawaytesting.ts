import { BigNumber, ethers } from "ethers";
import * as nft from '../artifacts/contracts/samples/NFT.sol/NFT.json';
import * as dotenv from 'dotenv';
import * as mktPlace from '../deployments/aurora_testnet/BaseMarketPlace.json';
import { token } from "../typechain/@openzeppelin/contracts";
import { transcode } from "buffer";

dotenv.config();

const pkey = process.env.PRIVATE_KEY;
const nftAddress = '0xc0F0aF132d3088cCF7379c32206A54f850f1Eba6';
const walletAddress = '0xf36D84389b2c6846189fBe64dEfBd201f512205A';
const dummy1 = '0x099A294Bffb99Cb2350A6b6cA802712D9C96676A';
const aurora_silo_url = 'https://hackathon.aurora.dev';
const aurora_testnet_url = 'https://testnet.aurora.dev';
const uri = "https://ipfs.filebase.io/ipfs/QmZtGwzymqv9SzNvVBuxV2SnxX9SzsP2DBZWiA2Kq7rAgb";

const main = async () => {
    if(!pkey) throw new Error('missing env');
    // const provider = ethers.getDefaultProvider('sepolia');
    const provider = new ethers.providers.JsonRpcProvider(aurora_testnet_url);
    const signer =  new ethers.Wallet(pkey, provider);
    const addr = await signer.getAddress();
    const nftContract = new ethers.Contract(nftAddress, nft.abi, signer);
    const contract = new ethers.Contract(mktPlace.address, mktPlace.abi, signer);

    // console.log('pubkey', addr);
    // const iface = new ethers.utils.Interface([
    //     'function ownerOf(uint256 tokenId) public view virtual override returns (address)'
    // ]);
    // const to = '0x623Fd2C30ccBE58110268972E1c9fe3825d39e15';
    const tokenId = 11
    // console.log('tokenId', tokenId);

    // console.log('\nminting...')
    // const mint = await nftContract.safeMint(addr, uri);
    // const mint_receipt = await mint.wait();
    // console.log(mint_receipt);
    // const tx = await nftContract.transferFrom(dummy1, to, 2);
    
    // console.log(`\ntransfering token ${tokenId}...`);
    // const transfer = await nftContract.transferFrom(dummy1, walletAddress, tokenId);
    // const trReceipt = await transfer.wait()
    // console.log(trReceipt);

    console.log(`\napproving token ${tokenId}...`)
    const approve = await nftContract.approve(mktPlace.address, tokenId);
    const appReceipt = await approve.wait();
    console.log(appReceipt);

    // console.log('\nlending...');
    // const price = ethers.utils.parseEther('0.00018');
    // const tx = await contract.lendNFT(nftAddress, tokenId, price, 72*60);
    // const receipt = await tx.wait();
    // console.log(receipt);
    
    // console.log(await nftContract.getApproved(tokenId));
    // console.log('mktPlace assets', await contract.getAssets()); 
    
    // console.log(`\nowner check token ${tokenId}`);
    // const nftOwner = await nftContract.ownerOf(tokenId);
    // console.log(nftOwner == walletAddress);
    // console.log((await nftContract.totalSupply()).toString());

    // console.log(await provider.getFeeData());

    // console.log(ethers.utils.id("WalletCreated(address,address)") == '0x5b03bfed1c14a02bdeceb5fa582eb1a5765fc0bc64ca0e6af4c20afc9487f081');
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});