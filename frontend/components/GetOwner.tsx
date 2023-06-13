import React, { useState } from "react";
import { usePublicClient } from "wagmi";
import { getContract, getWalletClient } from "wagmi/actions";
import { getNftData } from "../utils";
import { getOwner } from "../callers/nft";


const [nftContractAddress, nftContractAbi] = getNftData();

const GetOwner = (props:any) => {

    const [owner, setOwner] = useState(""); 
    const [isLoading, setIsLoading] = useState(false);
    
    const handleGetOwner = () => {
        if(isLoading) return;
        setIsLoading(true);
        getOwner(
            nftContractAddress,
            nftContractAbi,
            props.tokenId
        ).then((r: any) => setOwner(r));
        setIsLoading(false);   
    }

    return (
        <>
        <div className="p-4">
            <button
            className="bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleGetOwner}
            >
                {isLoading ? "loading..." : "Get Owner"}
            </button>
        </div>
        <div className="p-2">{owner}</div>
        </>
    )
}

export default GetOwner;