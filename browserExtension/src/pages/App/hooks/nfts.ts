import axios, { Axios } from 'axios'
import { ethers } from "ethers";
import { useEffect, useState, useRef } from "react";
// import { useRouter } from 'next/router'
import {
  useContractRead,
  useContract,
  useProvider,
} from "wagmi";

import {
  getContractData,
  getMktPlaceData,
  getEthersNftContract,
  ipfsToHTTP,
  getTokenMetadata,
} from '../../../utils'

const [contractAddress, contractABI] = getContractData();

// export const useTokenUri = (tokenId) => {
//   const [tokenUri, setTokenUri] = useState()
//   const [tokenUriError, setTokenUriError] = useState()
//   if (!tokenUri && !tokenUriError) {
//       const { data, isError, isLoading } = useContractRead({
//       address: contractAddress,
//       abi: contractABI,
//       functionName: 'tokenURI',
//       args: [tokenId],
//     })
//     console.log(data, isError, isLoading)
//     if (!isLoading && !isError) {
//       console.log("data",data)
//       setTokenUri(data);
//     }
//     else if (isError) {
//       console.log("isError")
//       console.log(isError)
//       setTokenUriError(isError)
//     }
//   }
//   return tokenUri
// }

export const useTokenUri = (tokenId: number) : any => {
  const [tokenUri, setTokenUri] = useState()
  const provider = useProvider()
  useEffect(() => {
    if (provider) {
      const nftContract = getEthersNftContract(provider)
      nftContract.tokenURI(tokenId).
      then ( (uri: any) =>{
        setTokenUri(uri)
      })
    }
  },[provider, tokenId])
  return tokenUri
}

export const useTokenCount = () : number => {
  const provider = useProvider()
  const [contractAddress, contractABI] = getContractData();
  const { data, isError, isLoading } = useContractRead({
    address: contractAddress as `0x${string}`,
    abi: contractABI as any,
    functionName: 'totalSupply',
    watch: true,
  })
  if (isError || isLoading)
    return 0;
  return ethers.BigNumber.from(data).toNumber();
}
    

export const useTokenMetaData = (tokenId: number) : any => {
  const [tokenMetadata, setTokenMetadata] = useState()
  const tokenUri = useTokenUri(tokenId)
  useEffect(() => {
    if (tokenUri) {
      axios.get(ipfsToHTTP(tokenUri)).
      then(request => {
        console.log(request.data)
        // transform data from string to object
        // const data = JSON.parse(request.data)
        const data = request.data;
        setTokenMetadata(data)
      })
    }
  },[tokenUri])
  return tokenMetadata
}

// export const useAllMetadata = () => {
//   const [allMetadata, setAllMetadata] = useState([])
//   const requests = useRef({})
//   const provider = useProvider()
//   const [contractAddress, contractABI] = getContractData();
//   const { data: tokenCount, isError, isLoading } = useContractRead({
//     address: contractAddress as `0x${string}`,
//     abi: contractABI as any,
//     functionName: 'numberOfTokens',
//     watch: true,
//   })

//   useEffect(() => {
//     if (!tokenCount) {
//       return
//     }
//     const count = tokenCount as number;
//     if (count > allMetadata.length) {
//       for (let i=allMetadata.length; i<count; i++) {
//         if (!requests.current[i]) {
//           requests.current[i] = getTokenMetadata(provider, i).then(
//             response => {
//               console.log(i, response)
//               // allMetadata.push()
//               setAllMetadata(arr => {
//                 const ret = [...arr, {tokenId: i.toString(), metadata: response.data}]
//                 ret.sort((e1, e2) => e2.tokenId - e1.tokenId)
//                 return ret
//               })
//             }
//           ) 
//         }
        
//       }
//     }
//   },[tokenCount])

//   return allMetadata
// }

export const useTokenImage = (tokenId: number) : string => {
  const metadata = useTokenMetaData(tokenId)
//   console.log(metadata)
//   if (metadata)
//     console.log("image ",typeof metadata)
//   console.log("---------------------")
  return metadata ? ipfsToHTTP(metadata.image as string) : "";
}

const isAccountToken = async (provider: any, accountAddress: string, tokenId: number) => {
  const nftContract = getEthersNftContract(provider)
  const owner = await nftContract.ownerOf(tokenId);
  return owner === accountAddress;
}

const buidAccountTokens = async (provider: any, accountAddress: string, setAccountTokens: any) => {
  const nftContract = getEthersNftContract(provider)
  const tokenCount = await nftContract.totalSupply();
  let promises = [];
  const init = 5
  for (let i = init; i < tokenCount; i++) {
    promises.push(isAccountToken(provider, accountAddress, i));
  }
  const tokensBools = await Promise.all(promises);
  const tokens = tokensBools.map((p, i) =>  p ? i+init : -1);
  const tokensFiltered = tokens.filter(t => t > 0);
  setAccountTokens(tokensFiltered);
}

export const useAccountTokens = (accountAdress: string) : number[] => {
  const [accountTokens, setAccountTokens] = useState<number[]>([])
  const provider = useProvider();
  const [contractAddress, contractABI] = getContractData();
  const { data: accountBalance, isError, isLoading } = useContractRead({
    address: contractAddress as `0x${string}`,
    abi: contractABI as any,
    functionName: 'balanceOf',
    args: [accountAdress],
    watch: true,
  });

  useEffect(() => {
    if (!provider) {
      return
    }
    buidAccountTokens(provider, accountAdress, setAccountTokens);
  },[accountBalance])
  return accountTokens
}

export const useMktPlaceAssets = () : any[] => {
  // const dummy1 = '0x099A294Bffb99Cb2350A6b6cA802712D9C96676A';
  const [assets, setAssets] = useState<any[]>([]);
  const [contractAddress, contractABI] = getMktPlaceData();
  const { data: _assets, isError, isLoading } = useContractRead({
    address: contractAddress as `0x${string}`,
    abi: contractABI as any,
    functionName: 'getAssets',
    args: [],
    watch: true,
  });
  useEffect(() => {
    if(!_assets) return
    setAssets(_assets);
  },[_assets]);
  return assets;
}

export const useLoans = (address: string) : any[] => {
  const [loans, setLoans] = useState<any[]>([]);
  const abi = [
    'function getLoansByContract(address contract_)'
  ];
  const { data: _loans, isError, isLoading } = useContractRead({
    address: address as `0x${string}`,
    abi: abi as any,
    functionName: 'getLoansByContract',
    args: [contractAddress],
    watch: true,
  });
  useEffect(() => {
    if(!_loans) return
    setLoans(_loans);
  },[_loans]);
  return loans;
}
// export function useTokenId () {
//   const router = useRouter()
//   const {tokenId} = router.query
//   return tokenId
// }