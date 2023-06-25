import React, { useCallback } from 'react';
import Header from '../header';
import { BigNumber, ethers } from 'ethers';
import { useBackgroundSelector } from '../../hooks';
import { getActiveAccount } from '../../../Background/redux-slices/selectors/accountSelectors';
import { useNavigate } from 'react-router-dom';
import { getEthersNftContract } from '../../../../utils';
import { useProvider } from 'wagmi';
import { useMktPlaceAssets } from '../../hooks/nfts';
import { getMktPlaceData, getContractData } from '../../../../utils';


export const Borrow = ({
    lender, index, duration, value
} : {
    lender: string,
    index: number,
    duration: number,
    value: number
}) => {
    const navigate = useNavigate();
    const [error, setError] = React.useState<string>('');
    const activeAccount = useBackgroundSelector(getActiveAccount);
    const [loader, setLoader] = React.useState<boolean>(false);
    const [mktPlaceAddress] = getMktPlaceData();
    const mktAddress = mktPlaceAddress as string;
    // console.log('mktplaceAddress', mktPlaceAddress);
    const value_ = ethers.BigNumber.from(value);
    // const [nftAddress] = getContractData();
    const abi = [
        'function borrowNFT(address lender, uint256 index, uint256 duration)'
    ];
    const iface = new ethers.utils.Interface(abi); 
    const calldata = iface.encodeFunctionData("borrowNFT", [
        lender,
        index,
        duration
    ]);
    const borrow = useCallback(async () => {
        if (!ethers.utils.isAddress(mktAddress)) {
          setError('Invalid to address');
          console.log(error)
          return;
        }
        setLoader(true);
        setError('');
    
        if (window.ethereum) {
          await window.ethereum.request({
            method: 'eth_requestAccounts',
          });
          const txHash = await window.ethereum.request({
            method: 'eth_sendTransaction',
            params: [
              {
                from: activeAccount,
                to: mktAddress,
                data: calldata,
                // gas: "0x186A0",
                value: value_
              },
            ],
          });
          console.log(txHash);
          alert(`token successfully borrowed! tx ${txHash}`)
          navigate('/');
        }
        setLoader(false);
      }, [activeAccount, navigate]);
    
    return (
        <>
        <button onClick={borrow}> borrow</button>
        </>
    )

}