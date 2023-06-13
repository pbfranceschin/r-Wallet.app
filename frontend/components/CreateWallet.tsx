import { useWalletClient } from 'wagmi';
import { getFactoryData } from "../utils";
import { useState } from 'react';
import { createAccount } from '../callers/factory';

const [factoryAddress, factoryAbi] = getFactoryData();

const CreateWallet = (props:any) => {

    const { data:walletClient } = useWalletClient();
    const [isLoading, setIsLoading] = useState(false);

    const handleCreateWallet = () => {
        if(isLoading) return;
        if(!walletClient){
            const msg = "no wallet connection detected"
            console.log(msg)
            alert(msg);
            return
        }
        setIsLoading(true);
        createAccount(factoryAddress, factoryAbi, walletClient);
        setIsLoading(false);
    }

    return (
        <>
        <div className="p-4">
            <button 
            className='bg-amber-500 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded'
            onClick={handleCreateWallet}
            >
                {isLoading ? 'loading...' : 'Create Wallet'}
            </button>
        </div>
        </>
    )
}

export default CreateWallet;