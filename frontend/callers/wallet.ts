import { WalletClient, encodeFunctionData } from "viem";
import { publicClient } from "./client";

export async function getLoans(
    walletAddress: any,
    walletAbi: any,
) {
    const loans = publicClient.readContract({
        address: walletAddress,
        abi: walletAbi,
        functionName: 'getLoans',
        args: []
    });
    return  loans;
}

export async function execute(
    walletAddress: any,
    walletAbi: any,
    signer: WalletClient,
    targetAddress: any,
    value: bigint,
    calldata: any
) {
    let error = null;
    let tx;
    try {
        console.log(
            `executing call to ${targetAddress}`
        );
        const { request } = await publicClient.simulateContract({
            address: walletAddress,
            abi: walletAbi,
            functionName: 'execute',
            args: [
                targetAddress,
                value,
                calldata
            ]
        });
        tx = await signer.writeContract(request);
    } catch (err) {
        error = err;
        console.log(err);        
    }
    if(error == null) {
        console.log('success');
        console.log(tx);
    }
}

export async function executeBatch(
    walletAddress: any,
    walletAbi: any,
    signer: WalletClient,
    targetAddresses: any[],
    values: bigint[],
    calldatas: any[]
) {
    let error = null;
    let tx;
    try {
        console.log(
            `executing batch call to ${targetAddresses}`
        );
        const { request } = await publicClient.simulateContract({
            address: walletAddress,
            abi: walletAbi,
            functionName: 'executeBatch',
            args: [
                targetAddresses,
                values,
                calldatas
            ]
        });
        tx = await signer.writeContract(request);
    } catch (err) {
        error = err;
        console.log(err);        
    }
    if(error == null) {
        console.log('success');
        console.log(tx);
    }
}

export async function releaseSingleAsset(
    walletAddress: any,
    walletAbi: any | readonly unknown[],
    signer: WalletClient,
    index: bigint    
) {
    let error = null;
    let tx: any;
    try {
        const { request } = await publicClient.simulateContract({
            address: walletAddress,
            abi: walletAbi,
            functionName: 'releaseSingleAsset',
            args: [index]
        });
        tx = await signer.writeContract(request);
    } catch (err) {
        error = err;
        console.log(err);        
    }
    if(error == null){
        console.log('success');
        console.log(tx);
    }
}

export async function releaseMultipleAssets(
    walletAddress: any,
    walletAbi: any | readonly unknown[],
    signer: WalletClient,
    indexes: bigint[]
) {
    let error = null;
    let tx: any;
    try {
        const { request } = await publicClient.simulateContract({
            address: walletAddress,
            abi: walletAbi,
            functionName: 'releaseMultipleAssets',
            args: [indexes]
        });
        tx = await signer.writeContract(request);
    } catch (err) {
        error = err;
        console.log(err);        
    }
    if(error == null){
        console.log('success');
        console.log(tx);
    }
}

export async function pullAsset(
    walletAddress: any,
    walletAbi: any | readonly unknown[],
    signer: WalletClient,
    index: bigint    
) {
    let error = null;
    let tx: any;
    try {
        const { request } = await publicClient.simulateContract({
            address: walletAddress,
            abi: walletAbi,
            functionName: 'pullAsset',
            args: [index]
        });
        tx = await signer.writeContract(request);
    } catch (err) {
        error = err;
        console.log(err);        
    }
    if(error == null){
        console.log('success');
        console.log(tx);
    }
}