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
//   Button,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableRow,
//   Paper,
//   Chip,
//   TableHead,
// } from '@mui/material';
// import { useWallet } from '../context/WalletContext';
// import { useChainId, useSwitchChain } from 'wagmi';
// import { formatUnits, decodeErrorResult } from 'viem';
// import { TESTNET_CHAIN_ID, dwcContractInteractions, USDC_ABI } from '../services/contractService';
// import PeopleIcon from '@mui/icons-material/People';
// import TrendingUpIcon from '@mui/icons-material/TrendingUp';
// import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
// import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
// import RefreshIcon from '@mui/icons-material/Refresh';
// import GroupIcon from '@mui/icons-material/Group';
// import BusinessIcon from '@mui/icons-material/Business';

// const MyTeam = () => {
//   const wallet = useWallet();
//   const chainId = useChainId();
//   const { switchChain } = useSwitchChain();
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [notRegistered, setNotRegistered] = useState(false);
//   const [teamData, setTeamData] = useState({
//     directReferrals: 0,
//     directBusiness: 0,
//     majorTeam: 0,
//     minorTeam: 0,
//     userRank: 0,
//     levelIncome: 0,
//     royaltyIncome: 0,
//     totalTeam: 0,
//     levels: [],
//   });

//   const fetchTeamData = async () => {
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
//         setError('User not registered. Please register to view your team.');
//         setNotRegistered(true);
//         setIsLoading(false);
//         return;
//       }

//       const [teamCount, userRank] = await Promise.all([
//         dwcContractInteractions.getTeamCount(wallet.account),
//         dwcContractInteractions.getUserRank(wallet.account),
//       ]);

//       if (process.env.NODE_ENV === 'development') {
//         console.log('Team Count:', teamCount);
//         console.log('User Rank:', userRank);
//       }

//       const levels = [];
//       const currentUserRank = Number(userRank.rank) || 0;
//       const maxLevel = 10; // Configurable max level

//       for (let level = 1; level <= Math.min(maxLevel, currentUserRank + 1); level++) {
//         try {
//           const [rankData, activeCount, levelEarning] = await Promise.all([
//             dwcContractInteractions.getRank(BigInt(level)),
//             dwcContractInteractions.getActiveCount(wallet.account, BigInt(level)),
//             dwcContractInteractions.getLevelEarning?.(wallet.account, BigInt(level)) || Promise.resolve(0n),
//           ]);

//           if (process.env.NODE_ENV === 'development') {
//             console.log(`Level ${level} Rank Data:`, rankData);
//             console.log(`Level ${level} Active Count:`, activeCount);
//           }

//           levels.push({
//             level,
//             rankData,
//             activeCount: Number(activeCount),
//             earning: levelEarning || 0n,
//             status: currentUserRank >= level,
//           });
//         } catch (error) {
//           console.error(`Error fetching data for level ${level}:`, error);
//           levels.push({
//             level,
//             rankData: { id: BigInt(level), activedirect: 0n, activeteam: 0n },
//             activeCount: 0,
//             earning: 0n,
//             status: false,
//           });
//         }
//       }

//       if (process.env.NODE_ENV === 'development') {
//         console.log('Levels Data:', levels);
//       }

//       setTeamData({
//         directReferrals: Number(userInfo.partnersCount) || 0,
//         directBusiness: parseFloat(formatUnits(userInfo.directBusiness || 0n, 18)) || 0,
//         majorTeam: Number(teamCount.maxTeam) || 0,
//         minorTeam: Number(teamCount.otherTeam) || 0,
//         userRank: currentUserRank,
//         levelIncome: parseFloat(formatUnits(userInfo.levelincome || 0n, 18)) || 0,
//         royaltyIncome: parseFloat(formatUnits(userInfo.royaltyincome || 0n, 18)) || 0,
//         totalTeam: Number(userInfo.teamCount) || 0,
//         levels,
//       });
//     } catch (error) {
//       console.error('Error fetching team data:', error);
//       let errorMessage = 'Failed to fetch team data. Please try again.';
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

//   const handleClaimReward = async (level) => {
//     if (!wallet.isConnected || !wallet.account) {
//       setError('Please connect your wallet to claim rewards.');
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

//       const txHash = await dwcContractInteractions.claimLevelReward(wallet.account, BigInt(level));
//       setSuccess(`Successfully claimed level ${level} reward! Transaction: ${txHash}`);
//       setTimeout(fetchTeamData, 3000);
//     } catch (error) {
//       console.error('Error claiming reward:', error);
//       setError(`Failed to claim reward: ${error.message || 'Unknown error'}`);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (wallet.isConnected && wallet.account) {
//       fetchTeamData();
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
//         <Alert severity="warning">Please connect your wallet to view your team.</Alert>
//       </Container>
//     );
//   }

//   if (isLoading && !teamData.directReferrals) {
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
//           You need to register to view your team.
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
//             My Team
//           </Typography>
//         </Box>
//         <Button
//           variant="outlined"
//           startIcon={<RefreshIcon />}
//           onClick={fetchTeamData}
//           disabled={isLoading}
//           sx={{ width: { xs: '100%', sm: 'auto' }, fontSize: { xs: '0.875rem', sm: '1rem' } }}
//         >
//           Refresh
//         </Button>
//       </Box>

//       <Grid container spacing={2}>
//         <Grid item xs={12}>
//           <Card sx={{ p: { xs: 2, sm: 3 }, boxShadow: 3 }}>
//             <Typography
//               variant="h5"
//               gutterBottom
//               sx={{ color: 'primary.main', fontWeight: 'bold', mb: { xs: 2, sm: 3 }, fontSize: { xs: '1.25rem', sm: '1.5rem' } }}
//             >
//               Overview
//             </Typography>
//             <Grid container spacing={2}>
//               {[
//                 {
//                   icon: <PeopleIcon />,
//                   title: 'Direct Referrals',
//                   value: teamData.directReferrals.toString(),
//                   subtitle: 'People directly referred by you',
//                   color: 'primary.main',
//                 },
//                 {
//                   icon: <BusinessIcon />,
//                   title: 'Direct Business',
//                   value: formatCurrency(teamData.directBusiness),
//                   subtitle: 'Business volume from direct referrals',
//                   color: 'secondary.main',
//                 },
//                 {
//                   icon: <GroupIcon />,
//                   title: 'Major Performance',
//                   value: teamData.majorTeam.toString(),
//                   subtitle: 'Members in your major team',
//                   color: 'success.main',
//                 },
//                 {
//                   icon: <PeopleIcon />,
//                   title: 'Minor Performance',
//                   value: teamData.minorTeam.toString(),
//                   subtitle: 'Members in your minor team',
//                   color: 'warning.main',
//                 },
//                 {
//                   icon: <EmojiEventsIcon />,
//                   title: 'User Rank',
//                   value: teamData.userRank.toString(),
//                   subtitle: 'Your current rank in the system',
//                   color: 'info.main',
//                 },
//                 {
//                   icon: <TrendingUpIcon />,
//                   title: 'Level Income',
//                   value: formatCurrency(teamData.levelIncome),
//                   subtitle: 'Income from team levels',
//                   color: 'primary.main',
//                 },
//                 {
//                   icon: <AccountBalanceWalletIcon />,
//                   title: 'Royalty Income',
//                   value: formatCurrency(teamData.royaltyIncome),
//                   subtitle: 'Royalty earnings from team',
//                   color: 'secondary.main',
//                 },
//                 {
//                   icon: <GroupIcon />,
//                   title: 'My Team',
//                   value: teamData.totalTeam.toString(),
//                   subtitle: 'Total members in your network',
//                   color: 'success.main',
//                 },
//               ].map((card, index) => (
//                 <Grid item xs={12} sm={6} md={4} key={`team-${index}`}>
//                   <Card sx={{ p: { xs: 1.5, sm: 2 }, boxShadow: 2, height: '100%' }}>
//                     <CardContent>
//                       <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
//                         {React.cloneElement(card.icon, { sx: { color: card.color, mr: 1, fontSize: { xs: '1.5rem', sm: '2rem' } } })}
//                         <Typography variant="h6" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
//                           {card.title}
//                         </Typography>
//                       </Box>
//                       <Typography variant="h4" sx={{ fontWeight: 'bold', color: card.color, fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
//                         {card.value}
//                       </Typography>
//                       <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
//                         {card.subtitle}
//                       </Typography>
//                     </CardContent>
//                   </Card>
//                 </Grid>
//               ))}
//             </Grid>
//           </Card>
//         </Grid>

//         <Grid item xs={12}>
//           <Card sx={{ p: { xs: 2, sm: 3 }, boxShadow: 3 }}>
//             <Typography
//               variant="h5"
//               gutterBottom
//               sx={{ color: 'primary.main', fontWeight: 'bold', mb: { xs: 2, sm: 3 }, fontSize: { xs: '1.25rem', sm: '1.5rem' } }}
//             >
//               Performance
//             </Typography>
//             <TableContainer component={Paper} sx={{ boxShadow: 2, overflowX: 'auto' }}>
//               <Table sx={{ minWidth: { xs: 'auto', sm: 650 } }} aria-label="levels table">
//                 <TableHead>
//                   <TableRow sx={{ backgroundColor: 'primary.main' }}>
//                     <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem' }}>Level</TableCell>
//                     <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem' }} align="center">Earnings</TableCell>
//                     <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem' }} align="center">Status</TableCell>
//                     <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem' }} align="center">Action</TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {teamData.levels && teamData.levels.length > 0 ? (
//                     teamData.levels.map((levelData) => (
//                       <TableRow
//                         key={levelData.level}
//                         sx={{ '&:nth-of-type(odd)': { backgroundColor: 'action.hover' } }}
//                       >
//                         <TableCell component="th" scope="row">
//                           <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
//                             Level {levelData.level}
//                           </Typography>
//                         </TableCell>
//                         <TableCell align="center">
//                           {formatCurrency(parseFloat(formatUnits(levelData.earning || 0n, 18)))}
//                         </TableCell>
//                         <TableCell align="center">
//                           <Chip
//                             label={levelData.status ? 'Achieved' : 'Pending'}
//                             color={levelData.status ? 'success' : 'warning'}
//                             variant="filled"
//                             sx={{ fontWeight: 'bold' }}
//                           />
//                         </TableCell>
//                         <TableCell align="center">
//                           {levelData.status && (
//                             <Button
//                               variant="contained"
//                               size="small"
//                               onClick={() => handleClaimReward(levelData.level)}
//                               disabled={isLoading}
//                             >
//                               Claim Reward
//                             </Button>
//                           )}
//                         </TableCell>
//                       </TableRow>
//                     ))
//                   ) : (
//                     <TableRow>
//                       <TableCell colSpan={4} align="center">
//                         No level data available.
//                       </TableCell>
//                     </TableRow>
//                   )}
//                 </TableBody>
//               </Table>
//             </TableContainer>
//           </Card>
//         </Grid>
//       </Grid>
//     </Container>
//   );
// };

const MyTeam = () => {
  return (<div>
    MyTeam
  </div>)
}
export default MyTeam;