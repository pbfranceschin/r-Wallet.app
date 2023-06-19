import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers } from "hardhat";
import { RWalletFactory__factory, NFT__factory, MarketPlace__factory } from "../typechain";
import { expect } from "chai";

const provider = ethers.provider;

export const deployFactory = async (signer: SignerWithAddress, entryPoint: string) => {
    console.log('\nDeploying factory contract...');
    const factoryFactory = new RWalletFactory__factory(signer);
    const factory = await factoryFactory.deploy(entryPoint);
    await factory.deployTransaction.wait();
    console.log(`\nWalletFactory deployed to address ${factory.address}\n`);
    return factory;    
}

export const nftDeployAndMint = async (signer: SignerWithAddress, mintTo: string) => {
    const nftFactory = new NFT__factory(signer);
    const nft = await nftFactory.deploy();
    await nft.deployTransaction.wait();
    console.log(`nft deployed at ${nft.address}\n`);
    const mintTx = await nft.connect(signer).safeMint(mintTo);
    const mintReceipt = await mintTx.wait();
    const mintEvent = mintReceipt.events?.find(
        (event: any) => event.event === 'Transfer'
    );
    const tokenId = mintEvent?.args?.tokenId;
    const nft1owner = await nft.ownerOf(tokenId);
    expect(nft1owner).to.eq(mintTo);
    console.log(`\nnft ${tokenId} minted to ${mintTo}\n`);
    return [nft, tokenId];
}

export const deployMktPlace = async (
    signer: SignerWithAddress,
    factoryAddress: string,
    feeBase: number,
    feeMultiplier: number
) => {
    console.log('deploying MarketPlace...')
    const mktPlaceFactory = new MarketPlace__factory(signer);
    const mktPlace = await mktPlaceFactory.deploy(
        factoryAddress,
        feeBase,
        feeMultiplier
    );
    await mktPlace.deployTransaction.wait();
    console.log(`MarketPlace deployed at ${mktPlace.address}`);
    return mktPlace;
}