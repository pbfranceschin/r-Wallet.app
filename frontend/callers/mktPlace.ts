import { Chain, WalletClient, encodeFunctionData } from "viem";
import { publicClient } from "./client";

/**
 * calls `lendNFT` method in marketPlace contract
 * -`lendNFT(address contract_, uint256 tokenId, uint256 fee, uint256 duration)`
 * - args:
 *      - marketPlace contract address and abi
 *      - function args
 */
export async function lendNFT(
    mktPlaceAddress: any,
    mktPlaceAbi: any,
    signer: WalletClient,
    nftContractAddress: string,
    tokenId: number,
    fee: number,
    duration: number
): Promise<void>{

    let error = null;
    let tx: any;
    try {
        const accounts = await signer.getAddresses();
        console.log(`lending NFT: contract ${nftContractAddress}, tokenId ${tokenId}`);
        const { request } = await publicClient.simulateContract({
            address: mktPlaceAddress,
            abi: mktPlaceAbi,
            functionName: 'lendNFT',
            args:[
                nftContractAddress,
                tokenId,
                fee,
                duration
            ],
            account: accounts[0]
        });
        tx = await signer.writeContract(request);
    } catch (err) {
        console.log(err);
        error = err;
        // alert(error);        
    }
    if (error == null) {
        console.log("success");
        console.log(tx);
    }
}

export async function borrowNFT (
    chain: Chain,
    mktPlaceAddress: any,
    mktPlaceAbi: any,
    signer: WalletClient,
    lender: string,
    index: bigint,
    value: bigint
) {
    let error = null;
    let tx: any;
    const [account] = await signer.getAddresses();
    const data = encodeFunctionData({
        abi: mktPlaceAbi,
        functionName: 'borrowNFT',
        args: [
            lender,
            index
        ]
    });
    try {
        console.log(`borrowing NFT\n-lender: ${lender}\n-index: ${index}`);
        tx = await signer.sendTransaction({
            data: data,
            account,
            to: mktPlaceAddress,
            value: value,
            chain: chain
        });
    } catch (err) {
        error = err;
        console.log(err);        
    }
    if(error == null) {
        console.log('success');
        console.log(tx);
    }
}

/**
 * calls getAssets method; returns array of asset objects (see NFT in Wallet.sol)
 * - `getAssets(address lender)`
 * - args:
 *      - mktPlace contract address and abi
 *      - function argument
 */
export async function getAssets (
    mktPlaceAddress: any,
    mktPlaceAbi: any,
    account: string
):Promise<any[]> {
    let error = null;
    let assets: any[] = [];
    try {
        console.log(`fetching assets from ${account}`);
        assets = await publicClient.readContract({
            address: mktPlaceAddress,
            abi: mktPlaceAbi,
            functionName: 'getAssets',
            args: [account]
        });
        console.log(assets);
    } catch (err) {
        console.log(err);
        error = err;
    }
    if(error == null) console.log('success');
    return assets;
}

