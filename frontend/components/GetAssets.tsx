import { useState } from "react";
import { useWalletClient, usePublicClient } from 'wagmi';
import { getContract, getWalletClient } from "wagmi/actions";
import { getMktPlaceData } from "../utils";
import { getAssets } from "../callers/mktPlace";

const [mktPlaceAddress, mktPlaceAbi] = getMktPlaceData();    

/**props
 * - setAssets
 */
const GetAssets = (props: any) => {
    
    let account: any;
    const { data:walletClient } = useWalletClient();
    walletClient?.getAddresses().then((r: any) => account = r[0]);
    
    const [isLoading , setIsLoading] = useState(false);
    const handleGetAssets = () => {
        if(isLoading) return;
        setIsLoading(true);
        getAssets(
            mktPlaceAddress,
            mktPlaceAbi,
            account
        ).then((r: any[]) => {
            props.setAssets(r);
        });
        setIsLoading(false);
    }

    return (
        <>
        <div className="p-4">
        <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleGetAssets}
        >
            {isLoading ? "loading..." : "Get Assets"}
        </button>
        </div>
        </>
    )
}

export default GetAssets;