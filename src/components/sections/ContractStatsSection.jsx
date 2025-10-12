import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useWallet } from '../../context/WalletContext';
import { useChainId, useSwitchChain } from 'wagmi';
import { formatUnits } from 'viem';
import { useBalance } from 'wagmi';
import { MAINNET_CHAIN_ID, dwcContractInteractions, USDC_ABI } from '../../services/contractService';

// Icons
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import BarChartIcon from '@mui/icons-material/BarChart';
import LinkIcon from '@mui/icons-material/Link';
import PersonIcon from '@mui/icons-material/Person';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PoolIcon from '@mui/icons-material/Pool';
import PeopleIcon  from "@mui/icons-material/People"
const ContractStatsSection = () => {
  const wallet = useWallet();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [statsData, setStatsData] = useState({
    bnbBalance: 0,
    usdcBalance: 0,
    dwcBalance: 0,
    totalInvestment: 0,
    stakeCount: 0,
    totalUsers: 0,
    userRank: 0,
    maxRoi: 0,
    contractPercent: 0,
    directIncome: 0,
    ownerAddress: '',
    coinRate: 0,
  });

  // Fetch BNB balance
  const { data: bnbBalance } = useBalance({
    address: wallet.account,
    chainId: MAINNET_CHAIN_ID,
  });

  const fetchStatsData = async () => {
    if (!wallet.isConnected || !wallet.account) {
      setError('Wallet not connected. Please connect your wallet.');
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

      const [
        usdcBalanceRaw,
        userRecord,
        contractPercent,
        directIncome,
        maxRoi,
        ownerAddress,
      ] = await Promise.all([
        dwcContractInteractions.getUSDCBalance(wallet.account),
        dwcContractInteractions.getUserRecord(wallet.account),
        dwcContractInteractions.getContractPercent(),
        dwcContractInteractions.getDirectIncome(),
        dwcContractInteractions.getMaxRoi(),
        dwcContractInteractions.getOwner(),
      ]);

      // Get total users count (approximate by checking uniqueUsers length)
      let totalUsers = 0;
      try {
        // This is a simple approximation - in a real implementation, you'd track this differently
        totalUsers = 0; // Placeholder - would need to implement proper counting
      } catch (e) {
        console.warn('Could not fetch total users:', e);
      }

      setStatsData({
        bnbBalance: bnbBalance ? parseFloat(formatUnits(bnbBalance.value, 18)) : 0,
        usdcBalance: parseFloat(formatUnits(usdcBalanceRaw, 18)), // This USDC contract uses 18 decimals
        dwcBalance: 0, // No DWC token in new contract
        totalInvestment: parseFloat(formatUnits(userRecord.totalInvestment, 18)),
        stakeCount: Number(userRecord.stakeCount),
        totalUsers: totalUsers,
        userRank: 0, // No rank system in new contract
        maxRoi: parseFloat(formatUnits(maxRoi, 18)),
        contractPercent: Number(contractPercent),
        directIncome: parseFloat(formatUnits(directIncome, 18)),
        ownerAddress: ownerAddress,
        coinRate: 0, // No coin rate in new contract
      });
    } catch (error) {
      console.error('Error fetching stats data:', error);
      setError('Failed to fetch contract stats. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (wallet.isConnected && wallet.account) {
      fetchStatsData();
    }
  }, [wallet.isConnected, wallet.account, chainId]);

  const formatCurrency = (amount = 0, decimals = 6) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatAddress = (address) => {
    if (!address) return 'N/A';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (!wallet.isConnected) {
    return (
      <Card sx={{ p: 3, boxShadow: 3 }}>
        <Alert severity="warning">Please connect your wallet to view contract stats.</Alert>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card sx={{ p: 3, boxShadow: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
        <CircularProgress />
      </Card>
    );
  }

  return (
    <Card sx={{ p: 3, boxShadow: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold', mb: 3 }}>
        Contract Stats & Balances
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ p: 2, boxShadow: 2, height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                <AccountBalanceWalletIcon sx={{ color: 'primary.main', mr: 1, fontSize: '1.5rem' }} />
                <Typography variant="h6" sx={{ fontSize: '0.9rem' }}>
                  BNB Balance
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main', fontSize: '1.25rem' }}>
                {formatCurrency(statsData.bnbBalance)}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                BNB
              </Typography>
            </CardContent>
          </Card>
        </Grid>

     


        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ p: 2, boxShadow: 2, height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                <PeopleIcon sx={{ color: 'warning.main', mr: 1, fontSize: '1.5rem' }} />
                <Typography variant="h6" sx={{ fontSize: '0.9rem' }}>
                  Total Users
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'warning.main', fontSize: '1.25rem' }}>
                {statsData.totalUsers}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                Registered Users
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Card>
  );
};

export default ContractStatsSection;