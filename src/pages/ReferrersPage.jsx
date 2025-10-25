import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Chip,
  Card,
  CardContent,
  Collapse,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import { useWallet } from '../context/WalletContext';
import { useChainId, useSwitchChain } from 'wagmi';
import { MAINNET_CHAIN_ID, dwcContractInteractions } from '../services/contractService';
import { formatUnits } from 'viem';
import RefreshIcon from '@mui/icons-material/Refresh';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PeopleIcon from '@mui/icons-material/People';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { Button } from '@mui/material';
import ConnectScreen from '../components/ConnectScreen';
import RegisterScreen from '../components/RegisterScreen';
import Footer from '../components/Footer';
import { apiService } from '../services/apiService';

const ReferrersPage = () => {
  const wallet = useWallet();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [referrersData, setReferrersData] = useState([]);
  const [levelIncomeData, setLevelIncomeData] = useState([]);
  const [levelCountData, setLevelCountData] = useState([]);
  const [levelWiseData, setLevelWiseData] = useState([]);
  const [userStats, setUserStats] = useState(null);
  const [notRegistered, setNotRegistered] = useState(false);
  const [expandedLevel, setExpandedLevel] = useState(null);

  const fetchReferrers = async () => {
    if (!wallet.isConnected || !wallet.account) {
      setError('Please connect your wallet.');
      return;
    }

    if (chainId !== MAINNET_CHAIN_ID) {
      try {
        await switchChain({ chainId: MAINNET_CHAIN_ID });
      } catch (error) {
        setError('Please switch to BSC Mainnet.');
        return;
      }
    }

    try {
      setIsLoading(true);
      setError('');

      // Check if user is registered
      const userRecord = await dwcContractInteractions.getUserRecord(wallet.account);
      if (!userRecord.isRegistered) {
        setNotRegistered(true);
        return;
      }
      setNotRegistered(false);

      // Fetch data from both contract and API
      const [contractData, apiData] = await Promise.allSettled([
        // Contract data
        (async () => {
          // Fetch referrers
          const { referrers, count } = await dwcContractInteractions.getUserReferrers(wallet.account);

          // Fetch level income percentages/rates for levels 1-10
          const levelIncomePromises = [];
          for (let i = 1; i <= 10; i++) {
            levelIncomePromises.push(
              dwcContractInteractions.getLevelIncome(BigInt(i))
                .then((incomeRate) => {
                  return {
                    level: i,
                    incomeRate: parseFloat(formatUnits(incomeRate, 18)),
                    incomeRateRaw: incomeRate,
                  };
                })
                .catch((error) => {
                  console.warn(`Error fetching level ${i} income rate:`, error);
                  return { level: i, incomeRate: 0, incomeRateRaw: 0n };
                })
            );
          }
          const levelIncomes = await Promise.all(levelIncomePromises);

          // Fetch level count for levels 1-10
          const levelCountPromises = [];
          for (let i = 1; i <= 10; i++) {
            levelCountPromises.push(
              dwcContractInteractions.getLevelCount(wallet.account, BigInt(i))
                .then((count) => {
                  return {
                    level: i,
                    count: count.toString(),
                    countRaw: count,
                  };
                })
                .catch((error) => {
                  console.warn(`Error fetching level ${i} count:`, error);
                  return { level: i, count: '0', countRaw: 0n };
                })
            );
          }
          const levelCounts = await Promise.all(levelCountPromises);

          // Fetch details for each referrer
          const referrersDetails = await Promise.all(
            referrers.map(async (referrer) => {
              try {
                const record = await dwcContractInteractions.getUserRecord(referrer);
                return {
                  address: referrer,
                  ...record,
                };
              } catch (err) {
                console.error(`Error fetching record for ${referrer}:`, err);
                return {
                  address: referrer,
                  totalInvestment: 0n,
                  directBusiness: 0n,
                  referrer: '0x0000000000000000000000000000000000000000',
                  referrerBonus: 0n,
                  levelIncome: 0n,
                  totalWithdrawn: 0n,
                  isRegistered: false,
                  stakeCount: 0n,
                };
              }
            })
          );

          return {
            referrers: referrersDetails,
            levelIncomes,
            levelCounts
          };
        })(),

        // API data
        (async () => {
          try {
            const [userStats, levelWiseData] = await Promise.all([
              apiService.getUserReferralStats(wallet.account),
              apiService.getLevelWiseReferrals(wallet.account)
            ]);
            return { userStats, levelWiseData };
          } catch (error) {
            console.warn('API data not available:', error);
            return { userStats: null, levelWiseData: [] };
          }
        })()
      ]);

      // Set contract data
      if (contractData.status === 'fulfilled') {
        setReferrersData(contractData.value.referrers);
        setLevelIncomeData(contractData.value.levelIncomes);
        setLevelCountData(contractData.value.levelCounts);
      }

      // Set API data
      if (apiData.status === 'fulfilled') {
        setUserStats(apiData.value.userStats);
        setLevelWiseData(apiData.value.levelWiseData || []);
      } else {
        // If API fails, ensure levelWiseData is empty array
        setLevelWiseData([]);
      }

    } catch (error) {
      console.error('Error fetching referrers:', error);
      setError(`Failed to fetch referrers: ${error.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (wallet.isConnected && wallet.account && chainId === MAINNET_CHAIN_ID) {
      fetchReferrers();
    }
  }, [wallet.isConnected, wallet.account, chainId]);

  if (!wallet.isConnected) {
    return (
      <ConnectScreen
        onRegisterClick={() => console.log('Connect wallet first')}
        onBackToHome={() => window.location.href = '/'}
      />
    );
  }

  if (notRegistered) {
    return (
      <RegisterScreen
        wallet={wallet}
        referralCode=""
        setReferralCode={() => { }}
        handleRegister={() => { }}
        isLoading={false}
        onBackToHome={() => window.location.href = '/'}
        errorMessage=""
      />
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 2, background: 'linear-gradient(135deg, #051f1e 0%, #0a3c2e 100%)', minHeight: '100vh', color: '#ffffff' }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2, backgroundColor: '#4d1a1a', color: '#ff6b6b', border: '1px solid #ff6b6b' }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" gutterBottom sx={{ color: '#b89250', fontWeight: 'bold' }}>
            My Referrals
          </Typography>
          <Typography variant="body1" sx={{ color: '#ffffff' }}>
            View all your referrals with level-wise data, addresses, and investment amounts.
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={fetchReferrers}
          disabled={isLoading}
          sx={{ color: '#b89250', borderColor: '#b89250', '&:hover': { backgroundColor: '#b89250', color: '#051f1e' } }}
        >
          Refresh
        </Button>
      </Box>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <CircularProgress sx={{ color: '#b89250' }} />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {/* 1. Summary Cards */}
          {userStats && (
            <Grid item xs={12}>
              <Typography variant="h5" gutterBottom sx={{ color: '#b89250', fontWeight: 'bold', mt: 2, mb: 3, textAlign: 'center' }}>
                📊 Summary Overview
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{
                    backgroundColor: 'rgba(184, 146, 80, 0.1)',
                    border: '1px solid rgba(184, 146, 80, 0.3)',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      border: '1px solid #b89250',
                    }
                  }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" sx={{ color: '#b89250', fontWeight: 'bold' }}>
                          Total Referrals
                        </Typography>
                        <PeopleIcon sx={{ color: '#b89250', fontSize: 20 }} />
                      </Box>
                      <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                        {userStats.totalReferrals}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{
                    backgroundColor: 'rgba(184, 146, 80, 0.1)',
                    border: '1px solid rgba(184, 146, 80, 0.3)',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      border: '1px solid #b89250',
                    }
                  }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" sx={{ color: '#b89250', fontWeight: 'bold' }}>
                          Total Investment
                        </Typography>
                        <MonetizationOnIcon sx={{ color: '#b89250', fontSize: 20 }} />
                      </Box>
                      <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                        {userStats.totalInvestment.toFixed(2)} USDC
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{
                    backgroundColor: 'rgba(184, 146, 80, 0.1)',
                    border: '1px solid rgba(184, 146, 80, 0.3)',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      border: '1px solid #b89250',
                    }
                  }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" sx={{ color: '#b89250', fontWeight: 'bold' }}>
                          Total Earnings
                        </Typography>
                        <TrendingUpIcon sx={{ color: '#b89250', fontSize: 20 }} />
                      </Box>
                      <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                        {userStats.totalEarnings.toFixed(2)} USDC
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{
                    backgroundColor: 'rgba(184, 146, 80, 0.1)',
                    border: '1px solid rgba(184, 146, 80, 0.3)',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      border: '1px solid #b89250',
                    }
                  }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" sx={{ color: '#b89250', fontWeight: 'bold' }}>
                          Registration Date
                        </Typography>
                        <PeopleIcon sx={{ color: '#b89250', fontSize: 20 }} />
                      </Box>
                      <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                        {userStats.registrationDate ? new Date(userStats.registrationDate).toLocaleDateString() : 'Not Available'}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
          )}

          {/* 2. Contract Level Count Summary */}
          <Grid item xs={12}>
            <Typography variant="h5" gutterBottom sx={{ color: '#b89250', fontWeight: 'bold', mt: 4, mb: 3, textAlign: 'center' }}>
              🔗 Contract Level Count Summary
            </Typography>
            <Grid container spacing={2}>
              {levelCountData.map((levelData) => (
                <Grid item xs={6} sm={4} md={3} lg={2} key={levelData.level}>
                  <Card sx={{
                    backgroundColor: 'rgba(184, 146, 80, 0.1)',
                    border: '1px solid rgba(184, 146, 80, 0.3)',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      border: '1px solid #b89250',
                    }
                  }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" sx={{ color: '#b89250', fontWeight: 'bold' }}>
                          Level {levelData.level}
                        </Typography>
                        <PeopleIcon sx={{ color: '#b89250', fontSize: 20 }} />
                      </Box>
                      <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                        {levelData.count}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#ffffff', opacity: 0.7 }}>
                        Users
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* 3. Level-wise Referral Data */}
          <Grid item xs={12}>
            <Typography variant="h5" gutterBottom sx={{ color: '#b89250', fontWeight: 'bold', mt: 4, mb: 3, textAlign: 'center' }}>
              📈 Level-wise Referral Details (1-10)
            </Typography>
            {levelWiseData && Array.isArray(levelWiseData) && levelWiseData.length > 0 ? (
              levelWiseData.map((levelData) => (
                <Accordion
                  key={levelData.level}
                  sx={{
                    backgroundColor: 'rgba(184, 146, 80, 0.05)',
                    border: '1px solid rgba(184, 146, 80, 0.3)',
                    mb: 1,
                    '&:before': { display: 'none' }
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon sx={{ color: '#b89250' }} />}
                    sx={{
                      backgroundColor: 'rgba(184, 146, 80, 0.1)',
                      '&:hover': { backgroundColor: 'rgba(184, 146, 80, 0.2)' }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                      <Box sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff',
                        fontWeight: 'bold',
                        backgroundColor: levelData.level <= 3 ? '#4caf50' : levelData.level <= 6 ? '#ff9800' : '#f44336',
                        mr: 2
                      }}>
                        {levelData.level}
                      </Box>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" sx={{ color: '#b89250', fontWeight: 'bold' }}>
                          Level {levelData.level}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#ffffff' }}>
                          {levelData.count} referrals • {levelData.totalInvestment.toFixed(2)} USDC invested • {levelData.totalEarnings.toFixed(2)} USDC earned
                        </Typography>
                      </Box>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails sx={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
                    <Typography variant="h6" sx={{ color: '#b89250', mb: 2 }}>
                      Level {levelData.level} Referral Addresses ({levelData.addresses.length})
                    </Typography>
                    {levelData.addresses.length > 0 ? (
                      <Grid container spacing={2}>
                        {levelData.addresses.map((address, index) => (
                          <Grid item xs={12} sm={6} md={4} key={index}>
                            <Card sx={{
                              backgroundColor: 'rgba(255, 255, 255, 0.05)',
                              border: '1px solid rgba(184, 146, 80, 0.3)',
                              transition: 'transform 0.2s',
                              '&:hover': {
                                transform: 'scale(1.02)',
                                border: '1px solid #b89250',
                              }
                            }}>
                              <CardContent>
                                <Typography variant="caption" sx={{ color: '#b89250', fontWeight: 'bold' }}>
                                  Address #{index + 1}
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#ffffff', fontFamily: 'monospace', wordBreak: 'break-all', mt: 1 }}>
                                  {address}
                                </Typography>
                                <Typography variant="caption" sx={{ color: '#ffffff', opacity: 0.7, mt: 1, display: 'block' }}>
                                  Investment: {levelData.totalInvestment.toFixed(2)} USDC
                                </Typography>
                              </CardContent>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                    ) : (
                      <Typography variant="body1" sx={{ color: '#ffffff', textAlign: 'center', py: 2 }}>
                        No addresses available for this level
                      </Typography>
                    )}
                  </AccordionDetails>
                </Accordion>
              ))
            ) : (
              <Card sx={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(184, 146, 80, 0.3)' }}>
                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="h6" sx={{ color: '#ffffff', mb: 2 }}>
                    No Referral Data Available
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#ffffff', opacity: 0.7, mb: 2 }}>
                    Level-wise referral data will appear here once you have referrals.
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#b89250', opacity: 0.8 }}>
                    Note: API server may not be running. Contract data is still available above.
                  </Typography>
                </CardContent>
              </Card>
            )}
          </Grid>
        </Grid>
      )}
      <Footer />
    </Container>
  );
};

export default ReferrersPage;
