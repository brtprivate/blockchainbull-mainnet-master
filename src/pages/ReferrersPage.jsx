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
} from '@mui/material';
import { useWallet } from '../context/WalletContext';
import { useChainId, useSwitchChain } from 'wagmi';
import { MAINNET_CHAIN_ID, dwcContractInteractions } from '../services/contractService';
import { formatUnits } from 'viem';
import RefreshIcon from '@mui/icons-material/Refresh';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PeopleIcon from '@mui/icons-material/People';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import { Button } from '@mui/material';
import ConnectScreen from '../components/ConnectScreen';
import RegisterScreen from '../components/RegisterScreen';
import Footer from '../components/Footer';

const ReferrersPage = () => {
  const wallet = useWallet();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [referrersData, setReferrersData] = useState([]);
  const [levelIncomeData, setLevelIncomeData] = useState([]);
  const [levelCountData, setLevelCountData] = useState([]);
  const [notRegistered, setNotRegistered] = useState(false);

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

      // Fetch referrers
      const { referrers, count } = await dwcContractInteractions.getUserReferrers(wallet.account);
      
      console.log('Total Referrers Count:', count.toString());
      console.log('Referrers List:', referrers);

      // Fetch level income percentages/rates for levels 1-15 (contract configuration)
      const levelIncomePromises = [];
      for (let i = 1; i <= 15; i++) {
        levelIncomePromises.push(
          dwcContractInteractions.getLevelIncome(BigInt(i))
            .then((incomeRate) => {
              console.log(`Level ${i} Income Rate:`, incomeRate.toString());
              return {
                level: i,
                incomeRate: parseFloat(formatUnits(incomeRate, 18)), // This is percentage/rate from contract
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
      setLevelIncomeData(levelIncomes);

      // Fetch level count for levels 1-15
      const levelCountPromises = [];
      for (let i = 1; i <= 15; i++) {
        levelCountPromises.push(
          dwcContractInteractions.getLevelCount(wallet.account, BigInt(i))
            .then((count) => {
              console.log(`Level ${i} Count:`, count.toString());
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
      setLevelCountData(levelCounts);

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

      setReferrersData(referrersDetails);
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
        setReferralCode={() => {}}
        handleRegister={() => {}}
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
            My Referrers
          </Typography>
          <Typography variant="body1" sx={{ color: '#ffffff' }}>
            View all users who referred you and their complete details.
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
        <Grid container spacing={2}>
          {/* Level Count Summary Cards */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ color: '#b89250', fontWeight: 'bold', mt: 2, mb: 1 }}>
              Level Count Summary
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

          {/* Referrers Table */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ color: '#b89250', fontWeight: 'bold', mt: 2, mb: 1 }}>
              My Referrers Details
            </Typography>
            <TableContainer component={Paper} sx={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(184, 146, 80, 0.3)' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: '#b89250', fontWeight: 'bold' }}>Address</TableCell>
                    <TableCell sx={{ color: '#b89250', fontWeight: 'bold' }}>Total Investment (USDC)</TableCell>
                    <TableCell sx={{ color: '#b89250', fontWeight: 'bold' }}>Direct Business (USDC)</TableCell>
                    <TableCell sx={{ color: '#b89250', fontWeight: 'bold' }}>Referrer Bonus (USDC)</TableCell>
                    <TableCell sx={{ color: '#b89250', fontWeight: 'bold' }}>Level Income (USDC)</TableCell>
                    <TableCell sx={{ color: '#b89250', fontWeight: 'bold' }}>Total Withdrawn (USDC)</TableCell>
                    <TableCell sx={{ color: '#b89250', fontWeight: 'bold' }}>Status</TableCell>
                    <TableCell sx={{ color: '#b89250', fontWeight: 'bold' }}>Stake Count</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {referrersData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} sx={{ textAlign: 'center', color: '#ffffff' }}>
                        No referrers found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    referrersData.map((referrer, index) => (
                      <TableRow key={index}>
                        <TableCell sx={{ color: '#ffffff' }}>
                          {referrer.address.substring(0, 6)}...{referrer.address.substring(referrer.address.length - 4)}
                        </TableCell>
                        <TableCell sx={{ color: '#ffffff' }}>{formatUnits(referrer.totalInvestment, 18)}</TableCell>
                        <TableCell sx={{ color: '#ffffff' }}>{formatUnits(referrer.directBusiness, 18)}</TableCell>
                        <TableCell sx={{ color: '#ffffff' }}>{formatUnits(referrer.referrerBonus, 18)}</TableCell>
                        <TableCell sx={{ color: '#ffffff' }}>{formatUnits(referrer.levelIncome, 18)}</TableCell>
                        <TableCell sx={{ color: '#ffffff' }}>{formatUnits(referrer.totalWithdrawn, 18)}</TableCell>
                        <TableCell>
                          <Chip
                            label={referrer.isRegistered ? 'Registered' : 'Not Registered'}
                            color={referrer.isRegistered ? 'success' : 'error'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell sx={{ color: '#ffffff' }}>{referrer.stakeCount.toString()}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      )}
      <Footer />
    </Container>
  );
};

export default ReferrersPage;
