import React, { useState, useRef } from "react";
import { useWalletClient } from "wagmi";
import { getNftData } from "../utils";
import { mint } from "../callers/nft";

const [nftContractAddress, nftContractAbi] = getNftData();

const Mint = (props:any) => {

    let signerAddress: any;
    const { data:walletClient } = useWalletClient();
    walletClient?.getAddresses().then((r:any) => signerAddress = r[0]);
    const [isLoading, setIsLoading] = useState(false);
    
    const handleMint = () => {
        if(isLoading) return;
        if(!walletClient){
            const msg = "no wallet connection detected"
            console.log(msg)
            alert(msg);
            return
        }
        setIsLoading(true);
        if(!props.firstMint.current){
            props.setTokenId(props.tokenId + BigInt(1));
        }
        // console.log(`minting tokenId ${props.tokenId}`)
        mint(
            nftContractAddress,
            nftContractAbi,
            walletClient,
            signerAddress           
        );
        setIsLoading(false);
        props.firstMint.current = false;
    }

    return (
        <>
        <div className="p-4">
        <button
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleMint}
        >
            {isLoading ? "sending..." : "Mint!"}
        </button>
        </div>
        </>
    )
}

export default Mint;