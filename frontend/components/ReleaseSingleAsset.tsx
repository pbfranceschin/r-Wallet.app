import React, { useState } from "react";
import { getWalletAbi } from "../utils";
import { useWalletClient } from "wagmi";
import { releaseSingleAsset } from "../callers/wallet";

const ReleaseSingleAsset = () => {

    const { data:walletClient } = useWalletClient();
    let walletAddress: string;
    walletClient?.getAddresses().then((r) => { 
        walletAddress = r[0];
        console.log(r);
    });
    const [isLoading, setIsLoading] = useState(false);
    const [index, setIndex] = useState<bigint>();

    const handleRelease = () => {
        if(!walletClient) {
            
        }
        if(isLoading) return;
        setIsLoading(true);
        const abi = getWalletAbi();
        releaseSingleAsset(
            walletAddress,
            abi,
            walletClient,
            index
        );


    }
}

export default ReleaseSingleAsset;