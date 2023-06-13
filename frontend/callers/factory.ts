import { WalletClient } from "viem";
import { publicClient } from "./client";

export async function createAccount(
    factoryAddress: any,
    factoryAbi: any,
    signer: WalletClient
) {
    const accounts = await signer.getAddresses();
    let error = null;
    let tx: any;
    try {
        console.log(`creating new wallet...\nowner ==> ${accounts[0]}`);
        const { request } = await publicClient.simulateContract({
            address: factoryAddress,
            abi: factoryAbi,
            functionName: 'createAccount',
            args:[],
            account: accounts[0]
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