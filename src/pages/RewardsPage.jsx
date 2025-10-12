// import React, { useState, useEffect } from 'react';
// import {
//   Container,
//   Typography,
//   Box,
//   CircularProgress,
//   Alert,
//   Button,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableRow,
//   Paper,
//   Grid,
//   Card,
//   CardContent,
//   TableHead,
// } from '@mui/material';
// import { useWallet } from '../context/WalletContext';
// import { useChainId, useSwitchChain, useBalance } from 'wagmi';
// import { formatUnits, decodeErrorResult } from 'viem';
// import { TESTNET_CHAIN_ID, dwcContractInteractions, USDC_ABI } from '../services/contractService';
// import RefreshIcon from '@mui/icons-material/Refresh';
// import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
// import TrendingUpIcon from '@mui/icons-material/TrendingUp';
// import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';

// const RewardsPage = () => {
//   const wallet = useWallet();
//   const chainId = useChainId();
//   const { switchChain } = useSwitchChain();
//   const { data: bnbBalance } = useBalance({
//     address: wallet.account,
//     chainId: TESTNET_CHAIN_ID,
//   });
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [notRegistered, setNotRegistered] = useState(false);
//   const [rewardsData, setRewardsData] = useState({
//     retentionBonus: 0,
//     releasedRetentionBonus: 0,
//     residualBonus: 0,
//     levelIncome: 0,
//     royaltyIncome: 0,
//     totalIncome: 0,
//     totalWithdraw: 0,
//     availableToWithdraw: 0,
//     bnbBalance: 0,
//   });

//   const fetchRewardsData = async () => {
//     if (!wallet.isConnected || !wallet.account) {
//       setError('Wallet not connected. Please connect your wallet.');
//       return;
//     }

//     if (chainId !== TESTNET_CHAIN_ID) {
//       try {
//         await switchChain({ chainId: TESTNET_CHAIN_ID });
//       } catch (error) {
//         setError('Please switch to BSC Testnet.');
//         return;
//       }
//     }

//     try {
//       setIsLoading(true);
//       setError('');
//       setNotRegistered(false);

//       const [userInfo, userCapping] = await Promise.all([
//         dwcContractInteractions.getUserInfo(wallet.account),
//         dwcContractInteractions.getUserCapping(wallet.account),
//       ]);

//       if (process.env.NODE_ENV === 'development') {
//         console.log('User Info for Rewards:', userInfo);
//       }

//       if (!userInfo?.id || userInfo.id === 0n) {
//         setError('User not registered. Please register to view rewards.');
//         setNotRegistered(true);
//         setIsLoading(false);
//         return;
//       }

//       setRewardsData({
//         retentionBonus: parseFloat(formatUnits(userInfo?.reward || 0n, 18)) || 0,
//         releasedRetentionBonus: parseFloat(formatUnits((userInfo?.totalreward || 0n) - (userInfo?.totalwithdraw || 0n), 18)) || 0,
//         residualBonus: parseFloat(formatUnits(userInfo?.maturityincome || 0n, 18)) || 0,
//         levelIncome: parseFloat(formatUnits(userInfo?.levelincome || 0n, 18)) || 0,
//         royaltyIncome: parseFloat(formatUnits(userInfo?.royaltyincome || 0n, 18)) || 0,
//         totalIncome: parseFloat(formatUnits(userInfo?.totalreward || 0n, 18)) || 0,
//         totalWithdraw: parseFloat(formatUnits(userInfo?.totalwithdraw || 0n, 18)) || 0,
//         availableToWithdraw: parseFloat(formatUnits(userCapping?.totalCapping || 0n, 18)) - parseFloat(formatUnits(userCapping?.useCapping || 0n, 18)) || 0,
//         bnbBalance: bnbBalance ? parseFloat(formatUnits(bnbBalance.value, 18)) : 0,
//       });
//     } catch (error) {
//       console.error('Error fetching rewards data:', error);
//       let errorMessage = 'Failed to fetch rewards data. Please try again.';
//       if (error.cause?.data) {
//         const decodedError = decodeErrorResult({
//           abi: USDC_ABI,
//           data: error.cause.data,
//         });
//         errorMessage = `Error: ${decodedError.errorName || 'Unknown error'} - ${decodedError.args?.join(', ') || ''}`;
//       }
//       setError(errorMessage);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleWithdraw = async () => {
//     if (!wallet.isConnected || !wallet.account) {
//       setError('Please connect your wallet to withdraw.');
//       return;
//     }

//     if (chainId !== TESTNET_CHAIN_ID) {
//       try {
//         await switchChain({ chainId: TESTNET_CHAIN_ID });
//       } catch (error) {
//         setError('Please switch to BSC Testnet.');
//         return;
//       }
//     }

//     try {
//       setIsLoading(true);
//       setError('');
//       setSuccess('');

//       const txHash = await dwcContractInteractions.withdrawRewards(wallet.account);
//       setSuccess(`Successfully withdrawn rewards! Transaction: ${txHash}`);
//       setTimeout(fetchRewardsData, 3000);
//     } catch (error) {
//       console.error('Error withdrawing:', error);
//       setError(`Failed to withdraw: ${error.message || 'Unknown error'}`);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (wallet.isConnected && wallet.account) {
//       fetchRewardsData();
//     }
//   }, [wallet.isConnected, wallet.account, chainId]);

//   const formatCurrency = (amount = 0) => {
//     return new Intl.NumberFormat('en-US', {
//       style: 'currency',
//       currency: 'USD',
//       minimumFractionDigits: 2,
//       maximumFractionDigits: 2,
//     }).format(amount);
//   };

//   if (!wallet.isConnected) {
//     return (
//       <Container
//         maxWidth="xl"
//         sx={{ py: { xs: 2, sm: 3 }, background: 'linear-gradient(135deg, #f0f4ff 0%, #d9e4ff 100%)', minHeight: '100vh' }}
//       >
//         <Alert severity="warning">Please connect your wallet to view your rewards.</Alert>
//       </Container>
//     );
//   }

//   if (isLoading && !rewardsData.totalIncome) {
//     return (
//       <Container
//         maxWidth="xl"
//         sx={{
//           py: { xs: 2, sm: 3 },
//           display: 'flex',
//           justifyContent: 'center',
//           alignItems: 'center',
//           minHeight: '100vh',
//           background: 'linear-gradient(135deg, #f0f4ff 0%, #d9e4ff 100%)',
//         }}
//       >
//         <CircularProgress />
//       </Container>
//     );
//   }

//   return (
//     <Container
//       maxWidth="xl"
//       sx={{ py: { xs: 2, sm: 3 }, background: 'linear-gradient(135deg, #f0f4ff 0%, #d9e4ff 100%)', minHeight: '100vh' }}
//     >
//       {error && (
//         <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')} closeText="Close">
//           {error}
//         </Alert>
//       )}
//       {success && (
//         <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')} closeText="Close">
//           {success}
//         </Alert>
//       )}
//       {notRegistered && (
//         <Alert
//           severity="info"
//           sx={{ mb: 2 }}
//           action={
//             <Button
//               color="inherit"
//               size="small"
//               onClick={() => {/* Add registration logic or redirect */}}
//             >
//               Register Now
//             </Button>
//           }
//         >
//           You need to register to view your rewards.
//         </Alert>
//       )}

//       <Box
//         sx={{
//           mb: { xs: 2, sm: 4 },
//           display: 'flex',
//           flexDirection: { xs: 'column', sm: 'row' },
//           justifyContent: 'space-between',
//           alignItems: { xs: 'stretch', sm: 'center' },
//           gap: 2,
//         }}
//       >
//         <Box>
//           <Typography
//             variant="h4"
//             gutterBottom
//             sx={{ color: 'primary.main', fontWeight: 'bold', fontSize: { xs: '1.5rem', sm: '2rem' } }}
//           >
//             My Rewards
//           </Typography>
//           <Typography variant="body1" color="text.secondary" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
//             View all your rewards and earnings in USDC
//           </Typography>
//         </Box>
//         <Button
//           variant="outlined"
//           startIcon={<RefreshIcon />}
//           onClick={fetchRewardsData}
//           disabled={isLoading}
//           sx={{ width: { xs: '100%', sm: 'auto' }, fontSize: { xs: '0.875rem', sm: '1rem' } }}
//         >
//           Refresh
//         </Button>
//       </Box>

//       <Grid container spacing={3}>
//         <Grid item xs={12}>
//           <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 2, color: 'primary.main' }}>
//             Income Details
//           </Typography>
//           <Grid container spacing={2}>
//             {[
//               {
//                 icon: <MonetizationOnIcon />,
//                 title: 'Retention Bonus',
//                 value: formatCurrency(rewardsData.retentionBonus),
//                 subtitle: 'Current reward balance (USDC)',
//                 color: 'primary.main',
//               },
//               {
//                 icon: <TrendingUpIcon />,
//                 title: 'Released Retention Bonus',
//                 value: formatCurrency(rewardsData.releasedRetentionBonus),
//                 subtitle: 'Total rewards minus withdrawals (USDC)',
//                 color: 'success.main',
//               },
//               {
//                 icon: <MonetizationOnIcon />,
//                 title: 'Residual Bonus',
//                 value: formatCurrency(rewardsData.residualBonus),
//                 subtitle: 'Maturity income (USDC)',
//                 color: 'warning.main',
//               },
//               {
//                 icon: <TrendingUpIcon />,
//                 title: 'Level Income',
//                 value: formatCurrency(rewardsData.levelIncome),
//                 subtitle: 'Income from team levels (USDC)',
//                 color: 'info.main',
//               },
//               {
//                 icon: <MonetizationOnIcon />,
//                 title: 'Royalty Income',
//                 value: formatCurrency(rewardsData.royaltyIncome),
//                 subtitle: 'Royalty earnings (USDC)',
//                 color: 'secondary.main',
//               },
//             ].map((card, index) => (
//               <Grid item xs={12} sm={6} md={4} key={`reward-${index}`}>
//                 <Card sx={{ p: { xs: 1.5, sm: 2 }, boxShadow: 3, height: '100%' }}>
//                   <CardContent>
//                     <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
//                       {React.cloneElement(card.icon, { sx: { color: card.color, mr: 1, fontSize: { xs: '1.5rem', sm: '2rem' } } })}
//                       <Typography variant="h6" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
//                         {card.title}
//                       </Typography>
//                     </Box>
//                     <Typography variant="h4" sx={{ fontWeight: 'bold', color: card.color, fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
//                       {card.value}
//                     </Typography>
//                     <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
//                       {card.subtitle}
//                     </Typography>
//                   </CardContent>
//                 </Card>
//               </Grid>
//             ))}
//           </Grid>
//         </Grid>

//         <Grid item xs={12}>
//           <Card sx={{ p: { xs: 3, sm: 4 }, boxShadow: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
//             <CardContent>
//               <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3, fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
//                 Rewards Summary
//               </Typography>
//               <Grid container spacing={3}>
//                 <Grid item xs={12} md={6}>
//                   <Box sx={{ mb: 2 }}>
//                     <Typography variant="h6" sx={{ mb: 1, fontSize: { xs: '0.9rem', sm: '1rem' } }}>
//                       Net Earnings
//                     </Typography>
//                     <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'success.light', fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
//                       {formatCurrency(rewardsData.totalIncome - rewardsData.totalWithdraw)}
//                     </Typography>
//                     <Typography variant="body2" sx={{ opacity: 0.8, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
//                       Total Income minus Total Withdrawn (USDC)
//                     </Typography>
//                   </Box>
//                   <Button
//                     variant="contained"
//                     onClick={handleWithdraw}
//                     disabled={isLoading || rewardsData.availableToWithdraw <= 0}
//                     sx={{ mt: 2, fontSize: { xs: '0.875rem', sm: '1rem' } }}
//                   >
//                     Withdraw Rewards
//                   </Button>
//                 </Grid>
//                 <Grid item xs={12} md={6}>
//                   <Box sx={{ mb: 2 }}>
//                     <Typography variant="h6" sx={{ mb: 1, fontSize: { xs: '0.9rem', sm: '1rem' } }}>
//                       Current Status
//                     </Typography>
//                     <Typography variant="body1" sx={{ mb: 1, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
//                       • Retention Bonus: {formatCurrency(rewardsData.retentionBonus)}
//                     </Typography>
//                     <Typography variant="body1" sx={{ mb: 1, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
//                       • Available to Withdraw: {formatCurrency(rewardsData.availableToWithdraw)}
//                     </Typography>
//                     <Typography variant="body1" sx={{ mb: 1, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
//                       • Total Rewards: {formatCurrency(rewardsData.totalIncome)}
//                     </Typography>
//                     <Typography variant="body1" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
//                       • BNB Balance: {formatCurrency(rewardsData.bnbBalance)}
//                     </Typography>
//                   </Box>
//                 </Grid>
//               </Grid>
//             </CardContent>
//           </Card>
//         </Grid>

//         <Grid item xs={12}>
//           <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 2, color: 'primary.main' }}>
//             Income Breakdown
//           </Typography>
//           <TableContainer component={Paper} sx={{ boxShadow: 3, overflowX: 'auto' }}>
//             <Table sx={{ minWidth: { xs: 'auto', sm: 650 } }} aria-label="income table">
//               <TableHead>
//                 <TableRow sx={{ backgroundColor: 'primary.main' }}>
//                   <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem' }}>Income Type</TableCell>
//                   <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem' }} align="right">Amount (USDC)</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {[
//                   { type: 'Retention Bonus', amount: rewardsData.retentionBonus },
//                   { type: 'Released Retention Bonus', amount: rewardsData.releasedRetentionBonus },
//                   { type: 'Residual Bonus', amount: rewardsData.residualBonus },
//                   { type: 'Level Income', amount: rewardsData.levelIncome },
//                   { type: 'Royalty Income', amount: rewardsData.royaltyIncome },
//                   { type: 'Total Income', amount: rewardsData.totalIncome },
//                   { type: 'Total Withdrawn', amount: rewardsData.totalWithdraw },
//                   { type: 'Available to Withdraw', amount: rewardsData.availableToWithdraw },
//                 ].map((row, index) => (
//                   <TableRow key={index} sx={{ '&:nth-of-type(odd)': { backgroundColor: 'action.hover' } }}>
//                     <TableCell>{row.type}</TableCell>
//                     <TableCell align="right">{formatCurrency(row.amount)}</TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         </Grid>
//       </Grid>
//     </Container>
//   );
// };

const RewardsPage =()=>{
  return (<div>
    RewardsPage
  </div>)
}

export default RewardsPage;