import { ethers } from "hardhat";
import { expect } from "chai";
import { 
    RWalletFactory,
    RWalletFactory__factory,
    NFT__factory,
    NFT,
    MarketPlace__factory,
    MarketPlace,
    RWallet
} from "../typechain";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber } from "ethers";
import { deployFactory, nftDeployAndMint } from "./rWallet-testutils";

describe("Testing MarketPlace", function () {
    let factoryFactory: RWalletFactory__factory;
    let factory: RWalletFactory;
    let nftFactory: NFT__factory;
    let nft: NFT;
    let mktPlaceFactory: MarketPlace__factory;
    let mktPlace: MarketPlace;
    let wallet: RWallet;
    let owner: SignerWithAddress;
    let dummy: SignerWithAddress;
    let lender: SignerWithAddress;
    let walletAddress: any;
    let entryPoint: SignerWithAddress;
    let tokenId: BigNumber;
    const provider = ethers.provider;
    
    before(async () => {
        [owner, entryPoint, dummy, lender] = await ethers.getSigners();
        factory = await deployFactory(owner, entryPoint.address);
        [nft, tokenId] = await nftDeployAndMint(dummy, lender.address);
    });
});