import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { getNftData } from '../utils';
import Mint from '../components/Mint';
import LendButton from '../components/LendButton';
import GetAssets from '../components/GetAssets';
import { useState, useRef } from 'react';
import { usePublicClient, useWalletClient } from 'wagmi';
import GetOwner from '../components/GetOwner';
import { Address } from 'wagmi';
import CreateWallet from '../components/CreateWallet';

const [nftContractAddress, nftContractAbi] = getNftData();
const fee = 100;
const duration = 150;

const Home: NextPage = () => {

  const [tokenId, setTokenId] = useState<BigInt>(BigInt(0));
  // console.log('tokenId', tokenId);
  // const tokenId = useRef<BigInt>(BigInt(0));
  const firstMint = useRef(true);
  const [walletAccount, setWalletAccount] = useState<Address>();
  const [bal, setBal] = useState('');
  const [assets, setAssets] = useState<any[]>();
  const publicClient = usePublicClient();
  const { data:walletClient } = useWalletClient();
  walletClient?.getAddresses().then((r:any) => setWalletAccount( r[0] ));
  const getBal = () => {
    if(!walletAccount) return;
    publicClient.getBalance({address: walletAccount}).then((r:any) => {
      setBal(String(r));
      console.log(bal);
    });
  }


  return (
    <div className={styles.container}>
      <Head>
        <title>r-wallet</title>
        <meta
          content="by autralopi.tech"
          name="description"
        />
        {/* <link href="/favicon.ico" rel="icon" /> */}
      </Head>

      <main className={styles.main}>
        <ConnectButton />
      <div className='flex justify-center border px-7 py-4 m-6'>
        <p className='p-4'> nft </p>
        <Mint
        tokenId={tokenId}
        setTokenId={setTokenId}
        firstMint={firstMint}
        />
        <GetOwner
        tokenId={tokenId}
        />
      </div>
      <div className='flex justify-center border p-4 m-6'>
        <p className='p-4'> mktPlace </p>
        <LendButton
        nftContractAddress={nftContractAddress}
        nftContractAbi={nftContractAbi}
        tokenId={tokenId}
        fee={fee}
        duration={duration}      
        />
        <GetAssets
        setAssets={setAssets}
        />
        <div className='p-2'>{assets? String(assets[1].id) : ""}</div>
      </div>
      <div className='flex justify-center border p-4 m-6'>
        <p className='p-4'> factory </p>
        <CreateWallet/>
      </div>
      {/* <button className='bg-blue-300 p-2 rounded' onClick={getBal}>GetBalance</button>
      <div className='text-blue-500 p-2'>{bal}</div> */}
      </main>

      <footer className={styles.footer}>
        by australopi.tech
      </footer>
    </div>
  );
};

export default Home;
