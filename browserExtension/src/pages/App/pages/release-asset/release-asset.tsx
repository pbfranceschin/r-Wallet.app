import {
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Container,
    FormControl,
    FormGroup,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    Stack,
    Typography,
  } from '@mui/material';
  import React, { useCallback } from 'react';
  import Header from '../../components/header';
  import { BigNumber, ethers } from 'ethers';
  import { useBackgroundSelector } from '../../hooks';
  import { getActiveAccount } from '../../../Background/redux-slices/selectors/accountSelectors';
  import { useNavigate } from 'react-router-dom';
  
const NFTaddress = '0x0A952031d753270f275C243EE92dbA431feE14a1';
const dummy1 = '0x099A294Bffb99Cb2350A6b6cA802712D9C96676A';
const tokenId = ethers.BigNumber.from('0');

const ReleaseAsset = () => {
    const navigate = useNavigate();
    const toAddress = NFTaddress;
    // const [toAddress, setToAddress] = React.useState<string>('');
    // const [value, setValue] = React.useState<string>('');
    const [error, setError] = React.useState<string>('');
    const activeAccount = useBackgroundSelector(getActiveAccount);
    const [loader, setLoader] = React.useState<boolean>(false);
    const abi = [
        'function transferFrom(address from,address to,uint256 tokenId)'
    ];
    const iface = new ethers.utils.Interface(abi); 
    const calldata = iface.encodeFunctionData("transferFrom", [
        activeAccount,
        dummy1,
        tokenId
    ]);
    const release = useCallback(async () => {
        if (!ethers.utils.isAddress(toAddress)) {
          setError('Invalid to address');
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
                to: toAddress,
                data: calldata,
                value: ethers.utils.parseEther('0'),
              },
            ],
          });
          console.log(txHash);
          alert(`token successfully released! tx ${txHash}`)
          navigate('/');
        }
        setLoader(false);
      }, [activeAccount, navigate, toAddress]);
    

    return (
        <Container sx={{ width: '62vw', height: '100vh' }}>
            <Header />
            <Card sx={{ ml: 4, mr: 4, mt: 2, mb: 2 }}>
                <CardContent>
                    <Box
                    component="div"
                    display="flex"
                    flexDirection="row"
                    justifyContent="center"
                    alignItems="center"
                    sx={{
                    borderBottom: '1px solid rgba(0, 0, 0, 0.20)',
                    position: 'relative',
                    }}
                    >
                        <Typography variant="h6">Release Assets</Typography>
                    </Box>
                    <Box
                    component="div"
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    sx={{ mt: 4 }}        
                    >
                        <Typography variant="body1" color="error">
                            {error}
                        </Typography>
                        <Button
                        disabled={loader}
                        onClick={release}
                        sx={{ mt: 4 }}
                        size="large"
                        variant="contained"
                        >
                            Release
                            {loader && (
                            <CircularProgress
                                size={24}
                                sx={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                marginTop: '-12px',
                                marginLeft: '-12px',
                                }}
                            />
                        )}
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </Container>
    )

}

export default ReleaseAsset;