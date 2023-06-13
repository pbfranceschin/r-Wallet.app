import { useWalletClient } from 'wagmi';
import { getMktPlaceData } from '../utils';
import { useState } from 'react';
import { lendNFT } from '../callers/mktPlace';
import { approve } from '../callers/nft';

const [mktPlaceAddress, mktPlaceAbi] = getMktPlaceData();

/**
 * props
 * - nftContractAddress
 * - tokenId
 * - fee (useState value)
 * - duration ( "   " )
 * - setFee (useState setter)
 * - setDuration ( "   " )
 */
const LendButton = (props: any) => {

    const { data:walletClient } = useWalletClient();
    const [isLoading, setIsLoading] = useState(false);
    
    const handleLend = () => {
        if(isLoading) return;
        if(!walletClient){
            const msg = "no wallet connection detected"
            console.log(msg)
            alert(msg);
            return
        }
        setIsLoading(true);
        approve(
            props.nftContractAddress,
            props.nftContractAbi,
            walletClient,
            mktPlaceAddress,
            props.tokenId
        ).then(() => {
            console.log(`listing token ${props.tokenId}`);
            lendNFT(
                mktPlaceAddress,
                mktPlaceAbi,
                walletClient,
                props.nftContractAddress,
                props.tokenId,
                props.fee,
                props.duration
            );
        })
        // props.setFee('');
        // props.setDuration('');
        setIsLoading(false);
    }

    return (
        <>
        <div className='p-4'>
            <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleLend}
            >
                {isLoading ? "Sending..." : "Lend"}
            </button>
        </div>
        </>
    )
}

export default LendButton;
