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

export const Lend = ({
    address,
    id,
    price,
    maxDuration 
}: {
    address : string,
    id: number,
    price: BigNumber,
    maxDuration: BigNumber
}) => {
    const navigate = useNavigate();
    const [error, setError] = React.useState<string>('');
    const activeAccount = useBackgroundSelector(getActiveAccount);
    const [loader, setLoader] = React.useState<boolean>(false);
    const [mktPlaceAddress] = getMktPlaceData();
    // const [nftAddress] = getContractData();
    const abi = [
        'function lendNFT(address contract_, uint256 tokenId, uint256 price, uint256 maxDuration)'
    ];
    const iface = new ethers.utils.Interface(abi); 
    const calldata = iface.encodeFunctionData("lendNFT", [
        address,
        id,
        price,
        maxDuration
    ]);
    const lend = useCallback(async () => {
        if (!ethers.utils.isAddress(activeAccount? activeAccount : '')) {
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
                to: mktPlaceAddress,
                data: calldata,
                value: ethers.utils.parseEther('0'),
                gas: "0x186A0"
              },
            ],
          });
          console.log(txHash);
          alert(`token successfully released! tx ${txHash}`)
          navigate('/');
        }
        setLoader(false);
      }, [activeAccount, navigate]);
    
    return (
        <>
        <button onClick={lend}> lend</button>
        </>
    )
}

