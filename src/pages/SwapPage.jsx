// import React, { useState, useEffect } from 'react';
// import {
//   Container,
//   Typography,
//   Card,
//   CardContent,
//   TextField,
//   Button,
//   Box,
//   Alert,
//   CircularProgress,
//   Grid,
//   Paper,
// } from '@mui/material';
// import { useWallet } from '../context/WalletContext';
// import { dwcContractInteractions } from '../services/contractService';
// import { formatUnits, parseUnits } from 'viem';
// import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
// import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

// const SwapPage = () => {
//   const wallet = useWallet();
//   const [dwcAmount, setDwcAmount] = useState('');
//   const [daiAmount, setDaiAmount] = useState('');
//   const [dwcBalance, setDwcBalance] = useState(0);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [isApproving, setIsApproving] = useState(false);
//   const [isSwapping, setIsSwapping] = useState(false);

//   useEffect(() => {
//     if (wallet.isConnected && wallet.account) {
//       fetchBalance();
//     }
//   }, [wallet.isConnected, wallet.account]);

//   const fetchBalance = async () => {
//     try {
//       const balance = await dwcContractInteractions.getDWCBalance(wallet.account);
//       setDwcBalance(parseFloat(formatUnits(balance, 18)));
//     } catch (err) {
//       console.error('Error fetching balance:', err);
//       setError('Failed to fetch balance');
//     }
//   };

//   const handleAmountChange = async (value) => {
//     setDwcAmount(value);
//     if (value && !isNaN(value)) {
//       try {
//         const tokenAmount = parseUnits(value, 18);
//         const daiOutput = await dwcContractInteractions.tokensToDai(tokenAmount);
//         setDaiAmount(formatUnits(daiOutput, 18));
//       } catch (err) {
//         console.error('Error calculating DAI amount:', err);
//         setDaiAmount('');
//       }
//     } else {
//       setDaiAmount('');
//     }
//   };

//   const handleApprove = async () => {
//     if (!dwcAmount || isNaN(dwcAmount)) return;
//     setIsApproving(true);
//     setError('');
//     try {
//       const amount = parseUnits(dwcAmount, 18);
//       await dwcContractInteractions.approveDWC(amount, wallet.account);
//       setError('Approval successful');
//     } catch (err) {
//       console.error('Approval failed:', err);
//       setError('Approval failed: ' + err.message);
//     } finally {
//       setIsApproving(false);
//     }
//   };

//   const handleSwap = async () => {
//     if (!dwcAmount || isNaN(dwcAmount)) return;
//     setIsSwapping(true);
//     setError('');
//     try {
//       const amount = parseUnits(dwcAmount, 18);
//       await dwcContractInteractions.tokenSwap(amount, wallet.account);
//       setError('Swap successful');
//       setDwcAmount('');
//       setDaiAmount('');
//       fetchBalance();
//     } catch (err) {
//       console.error('Swap failed:', err);
//       setError('Swap failed: ' + err.message);
//     } finally {
//       setIsSwapping(false);
//     }
//   };

//   if (!wallet.isConnected) {
//     return (
//       <Container maxWidth="md" sx={{ mt: 4 }}>
//         <Alert severity="warning">Please connect your wallet to access the swap page.</Alert>
//       </Container>
//     );
//   }

//   return (
//     <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
//       <Typography variant="h4" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold' }}>
//         Swap DWC to DAI
//       </Typography>

//       <Grid container spacing={3}>
//         <Grid item xs={12} md={6}>
//           <Card sx={{ p: 3, boxShadow: 3 }}>
//             <CardContent>
//               <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
//                 <AccountBalanceWalletIcon sx={{ color: 'primary.main', mr: 1 }} />
//                 <Typography variant="h6">Your DWC Balance</Typography>
//               </Box>
//               <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
//                 {dwcBalance.toFixed(4)} DWC
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>

//         <Grid item xs={12} md={6}>
//           <Card sx={{ p: 3, boxShadow: 3 }}>
//             <CardContent>
//               <Typography variant="h6" gutterBottom>Swap Calculator</Typography>
//               <TextField
//                 fullWidth
//                 label="DWC Amount"
//                 type="number"
//                 value={dwcAmount}
//                 onChange={(e) => handleAmountChange(e.target.value)}
//                 sx={{ mb: 2 }}
//               />
//               <Typography variant="body1">
//                 Expected DAI Output: {daiAmount ? parseFloat(daiAmount).toFixed(4) : '0.0000'} DAI
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>

//         <Grid item xs={12}>
//           <Paper sx={{ p: 3, boxShadow: 3 }}>
//             <Typography variant="h6" gutterBottom>Swap Actions</Typography>
//             {error && (
//               <Alert severity={error.includes('successful') ? 'success' : 'error'} sx={{ mb: 2 }}>
//                 {error}
//               </Alert>
//             )}
//             <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
//               <Button
//                 variant="outlined"
//                 onClick={handleApprove}
//                 disabled={isApproving || !dwcAmount}
//                 startIcon={isApproving ? <CircularProgress size={20} /> : null}
//               >
//                 {isApproving ? 'Approving...' : 'Approve DWC'}
//               </Button>
//               <Button
//                 variant="contained"
//                 onClick={handleSwap}
//                 disabled={isSwapping || !dwcAmount || parseFloat(dwcAmount) > dwcBalance}
//                 startIcon={isSwapping ? <CircularProgress size={20} /> : <SwapHorizIcon />}
//               >
//                 {isSwapping ? 'Swapping...' : 'Swap DWC to DAI'}
//               </Button>
//             </Box>
//             {parseFloat(dwcAmount) > dwcBalance && (
//               <Alert severity="warning" sx={{ mt: 2 }}>
//                 Insufficient DWC balance
//               </Alert>
//             )}
//           </Paper>
//         </Grid>
//       </Grid>
//     </Container>
//   );
// };

const SwapPage =()=>{


  return (<div>
    SwapPage
  </div>)
}

export default SwapPage;
