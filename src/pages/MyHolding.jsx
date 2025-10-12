// import React, { useState, useEffect } from 'react';
// import {
//   Container,
//   Grid,
//   Typography,
//   Box,
//   Card,
//   CardContent,
//   CircularProgress,
//   Alert,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableRow,
//   Paper,
//   Button,
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

// const MyHolding = () => {
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
//   const [holdingData, setHoldingData] = useState({
//     myHolding: 0,
//     totalCapping: 0,
//     useCapping: 0,
//     usdcBalance: 0,
//     bnbBalance: 0,
//     coinRate: 0,
//   });
//   const [orders, setOrders] = useState([]);

//   const fetchHoldingData = async () => {
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

//       const userInfo = await dwcContractInteractions.getUserInfo(wallet.account);
//       if (process.env.NODE_ENV === 'development') {
//         console.log('User Info:', userInfo);
//       }
//       if (!userInfo?.id || userInfo.id === 0n) {
//         setError('User not registered. Please register to view holdings.');
//         setNotRegistered(true);
//         setIsLoading(false);
//         return;
//       }

//       const [usdcBalanceRaw, userCapping, coinRateRaw, orderLength] = await Promise.all([
//         dwcContractInteractions.getUSDCBalance(wallet.account),
//         dwcContractInteractions.getUserCapping(wallet.account),
//         dwcContractInteractions.getCoinRate(),
//         dwcContractInteractions.getOrderLength(wallet.account),
//       ]);

//       if (process.env.NODE_ENV === 'development') {
//         console.log('Raw USDC Balance:', usdcBalanceRaw);
//         console.log('Coin Rate:', coinRateRaw);
//         console.log('Order Length:', orderLength);
//       }

//       const ordersData = [];
//       let totalActiveUsdc = 0;
//       for (let i = 0n; i < orderLength; i++) {
//         const order = await dwcContractInteractions.getOrderInfo(wallet.account, i);
//         if (process.env.NODE_ENV === 'development') {
//           console.log(`Order ${i}:`, order);
//         }
//         if (order.isactive) {
//           totalActiveUsdc += parseFloat(formatUnits(order.amount, 18));
//         }
//         ordersData.push(order);
//       }

//       setOrders(ordersData);

//       const coinRate = parseFloat(formatUnits(coinRateRaw, 18)) || 1;
//       const myHolding = totalActiveUsdc / coinRate;

//       if (process.env.NODE_ENV === 'development') {
//         console.log('Total Active USDC:', totalActiveUsdc);
//         console.log('Calculated My Holding (DWC):', myHolding);
//       }

//       setHoldingData({
//         myHolding: myHolding || 0,
//         totalCapping: parseFloat(formatUnits(userCapping?.totalCapping || 0n, 18)) || 0,
//         useCapping: parseFloat(formatUnits(userCapping?.useCapping || 0n, 18)) || 0,
//         usdcBalance: parseFloat(formatUnits(usdcBalanceRaw, 18)) || 0,
//         bnbBalance: bnbBalance ? parseFloat(formatUnits(bnbBalance.value, 18)) : 0,
//         coinRate: coinRate,
//       });
//     } catch (error) {
//       console.error('Error fetching holding data:', error);
//       let errorMessage = 'Failed to fetch holding data. Please try again.';
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

//   const handleWithdraw = async (index) => {
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

//       const txHash = await dwcContractInteractions.rewardWithdraw(0, wallet.account);
//       setSuccess(`Successfully withdrawn reward! Transaction: ${txHash}`);
//       setTimeout(fetchHoldingData, 3000);
//     } catch (error) {
//       console.error('Error withdrawing:', error);
//       setError(`Failed to withdraw: ${error.message || 'Unknown error'}`);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (wallet.isConnected && wallet.account) {
//       fetchHoldingData();
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

//   const formatDate = (timestamp = 0) => {
//     return timestamp ? new Date(Number(timestamp) * 1000).toLocaleString() : 'N/A';
//   };

//   const investmentData = orders.map((order, index) => ({
//     id: index,
//     plan: order.isdai ? 'USDC' : 'DWC', // Updated to USDC
//     amount: parseFloat(formatUnits(order.amount, 18)) || 0,
//     status: order.isactive ? 'Active' : 'Completed',
//     date: order.deposit_time ? formatDate(order.deposit_time) : 'N/A',
//   }));

//   if (process.env.NODE_ENV === 'development') {
//     console.log('Investment Data:', investmentData);
//   }

//   if (!wallet.isConnected) {
//     return (
//       <Container
//         maxWidth="xl"
//         sx={{ py: { xs: 2, sm: 3 }, background: 'linear-gradient(135deg, #f0f4ff 0%, #d9e4ff 100%)', minHeight: '100vh' }}
//       >
//         <Alert severity="warning">Please connect your wallet to view your holdings.</Alert>
//       </Container>
//     );
//   }

//   if (isLoading && !holdingData.myHolding) {
//     return (
//       <Container
//         maxWidth="xl"
//         sx={{
//           py: { xs: 2, sm: 3 },
//           display: 'flex',
//           justifyContent: 'center',
//           alignItems: 'center',
//           minHeight: '400px',
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
//       sx={{ py: { xs: 2, sm: 4 }, minHeight: '100vh', background: 'linear-gradient(135deg, #f0f4ff 0%, #d9e4ff 100%)' }}
//     >
//       {error && (
//         <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
//           {error}
//         </Alert>
//       )}
//       {success && (
//         <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
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
//           You need to register to view your holdings.
//         </Alert>
//       )}

//       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
//         <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
//           Dashboard Overview
//         </Typography>
//         <Button
//           variant="outlined"
//           startIcon={<RefreshIcon />}
//           onClick={fetchHoldingData}
//           disabled={isLoading}
//         >
//           Refresh
//         </Button>
//       </Box>

//       <Grid container spacing={3} justifyContent="center">
//         {[
//           {
//             icon: <AccountBalanceWalletIcon />,
//             title: 'My Holding',
//             value: formatCurrency(holdingData.myHolding),
//             subtitle: 'Total DWC Holdings',
//             color: 'primary.main',
//           },
//           {
//             icon: <TrendingUpIcon />,
//             title: 'Total Capping',
//             value: formatCurrency(holdingData.totalCapping),
//             subtitle: 'Maximum Payout Limit',
//             color: 'success.main',
//           },
//           {
//             icon: <MonetizationOnIcon />,
//             title: 'Used Capping',
//             value: formatCurrency(holdingData.useCapping),
//             subtitle: 'Capping Used',
//             color: 'warning.main',
//           },
//           {
//             icon: <AccountBalanceWalletIcon />,
//             title: 'USDC Balance',
//             value: formatCurrency(holdingData.usdcBalance),
//             subtitle: 'Available USDC',
//             color: 'info.main',
//           },
//           {
//             icon: <AccountBalanceWalletIcon />,
//             title: 'BNB Balance',
//             value: formatCurrency(holdingData.bnbBalance),
//             subtitle: 'Available BNB',
//             color: 'secondary.main',
//           },
//         ].map((card, index) => (
//           <Grid item xs={12} sm={6} md={3} key={index}>
//             <Card
//               sx={{
//                 p: 2,
//                 borderRadius: 3,
//                 boxShadow: 4,
//                 height: '100%',
//                 transition: 'all 0.3s ease',
//                 '&:hover': { transform: 'translateY(-6px)', boxShadow: 6 },
//               }}
//             >
//               <CardContent>
//                 <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
//                   {React.cloneElement(card.icon, {
//                     sx: { color: card.color, mr: 1.5, fontSize: '2.2rem' },
//                   })}
//                   <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: { xs: '0.9rem', sm: '1rem' } }}>
//                     {card.title}
//                   </Typography>
//                 </Box>
//                 <Typography variant="h4" sx={{ fontWeight: 'bold', color: card.color, fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
//                   {card.value}
//                 </Typography>
//                 <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
//                   {card.subtitle}
//                 </Typography>
//               </CardContent>
//             </Card>
//           </Grid>
//         ))}
//       </Grid>

//       <Box sx={{ mt: 6 }}>
//         <Typography variant="h5" align="center" sx={{ fontWeight: 'bold', mb: 3 }}>
//           My Investments
//         </Typography>
//         <TableContainer
//           component={Paper}
//           sx={{
//             maxWidth: { xs: '100%', sm: '90%', md: '80%' },
//             margin: 'auto',
//             borderRadius: 3,
//             boxShadow: 4,
//           }}
//         >
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell align="center" sx={{ fontWeight: 'bold' }}>#</TableCell>
//                 <TableCell align="center" sx={{ fontWeight: 'bold' }}>Plan</TableCell>
//                 <TableCell align="center" sx={{ fontWeight: 'bold' }}>Amount</TableCell>
//                 <TableCell align="center" sx={{ fontWeight: 'bold' }}>Status</TableCell>
//                 <TableCell align="center" sx={{ fontWeight: 'bold' }}>Date</TableCell>
//                 <TableCell align="center" sx={{ fontWeight: 'bold' }}>Action</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {investmentData.map((row, index) => (
//                 <TableRow key={row.id} sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
//                   <TableCell align="center">{index + 1}</TableCell>
//                   <TableCell align="center">{row.plan}</TableCell>
//                   <TableCell align="center">{formatCurrency(row.amount)}</TableCell>
//                   <TableCell
//                     align="center"
//                     sx={{
//                       color: row.status === 'Active' ? 'success.main' : 'primary.main',
//                       fontWeight: 'bold',
//                     }}
//                   >
//                     {row.status}
//                   </TableCell>
//                   <TableCell align="center">{row.date}</TableCell>
//                   <TableCell align="center">
//                     {row.status === 'Active' && (
//                       <Button
//                         variant="contained"
//                         size="small"
//                         onClick={() => handleWithdraw(0)}
//                         disabled={isLoading}
//                       >
//                         Withdraw
//                       </Button>
//                     )}
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </Box>
//     </Container>
//   );
// };

const MyHolding=()=>{
  return(<>
  holding
  </>)
}
export default MyHolding;