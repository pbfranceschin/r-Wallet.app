import { WalletClient } from "viem";
import { publicClient } from "./client";

export async function getOwner(
    contractAddress: any,
    contractAbi: any,
    tokenId: BigInt
) {
    const owner = await publicClient.readContract({
        address: contractAddress,
        abi: contractAbi,
        functionName: 'ownerOf',
        args: [tokenId]
    });
    return owner;
}

export async function balanceOf(
    contractAddress: any,
    contractAbi: any,
    account: string
): Promise<unknown[]> {
    const balance = await publicClient.readContract({
        address: contractAddress,
        abi: contractAbi,
        functionName: 'balanceOf',
        args: [account]
    });
    return balance;
}

export async function mint(
    contractAddress: any,
    contractAbi: any,
    signer: WalletClient,
    to: string
) {
    
    const accounts = await signer.getAddresses();
    let error = null;
    let tx: any;
    try {
        console.log(`minting to address ${to}`);
        const { request } = await publicClient.simulateContract({
            address: contractAddress,
            abi: contractAbi,
            functionName: 'safeMint',
            args:[to],
            account: accounts[0]
        });
        tx = await signer.writeContract(request);
    } catch (err) {
        error = err;
        console.log(err)        
    }
    if(error == null) {
        console.log('sucess');
        console.log(tx);
    }
}

export async function approve (
    contractAddress: any,
    contractAbi: any,
    signer: WalletClient,
    to: string,
    tokenId: BigInt
) {
    const accounts = await signer.getAddresses();
    let error = null;
    let tx: any;
    try {
        console.log(`approving token ${tokenId} to address ${to}`);
        const { request } = await publicClient.simulateContract({
            address: contractAddress,
            abi: contractAbi,
            functionName: 'approve',
            args:[
                to,
                tokenId
            ],
            account: accounts[0]
        });
        tx = await signer.writeContract(request);
    } catch (err) {
        error = err;
        console.log(err)        
    }
    if(error == null) {
        console.log('success');
        console.log(tx);
    }
}