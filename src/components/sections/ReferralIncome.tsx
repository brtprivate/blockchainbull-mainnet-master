import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  LinearProgress,
  Alert,
  Avatar,
  Stack,
  Divider,
  Button,
} from '@mui/material';
import {
  MonetizationOn,
  TrendingUp,
  People,
  AccountTree,
  Star,
  EmojiEvents,
  Diamond,
  AccountBalanceWallet,
  Refresh,
  Timeline,
} from '@mui/icons-material';
import { useMLM } from '../../context/MLMContext';
import { useWallet } from '../../context/WalletContext';
import { useInvestment } from '../../context/InvestmentContext';

interface ReferralCommission {
  level: number;
  address: string;
  amount: string;
  date: string;
  type: 'direct' | 'indirect';
  packageType: string;
}

const ReferralIncome: React.FC = () => {
  const wallet = useWallet();
  const mlm = useMLM();
  
  const { userInvestmentData } = useInvestment();

  const [referralCommissions, setReferralCommissions] = useState<ReferralCommission[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [incomeStats, setIncomeStats] = useState({
    totalReferralIncome: '0',
    thisMonthIncome: '0',
    directCommissions: '0',
    indirectCommissions: '0',
    averageCommission: '0',
  });

  // Commission rates for different levels
  const commissionRates = [10, 5, 3, 2, 1]; // Level 1: 10%, Level 2: 5%, etc.

  // Format BigInt to readable string
  const formatAmount = (amount: bigint, decimals: number = 18): string => {
    const divisor = BigInt(10 ** decimals);
    const quotient = amount / divisor;
    const remainder = amount % divisor;
    
    if (remainder === 0n) {
      return quotient.toString();
    }
    
    const remainderStr = remainder.toString().padStart(decimals, '0');
    const trimmedRemainder = remainderStr.replace(/0+$/, '');
    
    if (trimmedRemainder === '') {
      return quotient.toString();
    }
    
    return `${quotient}.${trimmedRemainder}`;
  };

  // Load referral income data
  const loadReferralData = async () => {
    if (!wallet.isConnected || !wallet.isCorrectNetwork) return;

    try {
      setIsLoading(true);
      
      // Get direct referrals
      const referrals = await mlm.getDirectReferrals();
      const referralArray = Array.from(referrals);

      // For now, show empty commission data
      // TODO: Implement real commission tracking from blockchain events
      setReferralCommissions([]);

      // Initialize stats with zeros
      setIncomeStats({
        totalReferralIncome: '0',
        thisMonthIncome: '0',
        directCommissions: '0',
        indirectCommissions: '0',
        averageCommission: '0',
      });

    } catch (error) {
      console.error('Error loading referral data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadReferralData();
  }, [wallet.isConnected, wallet.isCorrectNetwork]);

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getLevelColor = (level: number) => {
    const colors = ['#FF9800', '#FFC107', '#4CAF50', '#2196F3', '#9C27B0'];
    return colors[level - 1] || '#757575';
  };

  const getPackageIcon = (packageType: string) => {
    switch (packageType) {
      case 'Starter': return <Star sx={{ color: '#FFA726' }} />;
      case 'Silver': return <AccountBalanceWallet sx={{ color: '#C0C0C0' }} />;
      case 'Gold': return <EmojiEvents sx={{ color: '#FFD700' }} />;
      case 'Diamond': return <Diamond sx={{ color: '#E1BEE7' }} />;
      default: return <Star />;
    }
  };

  if (!wallet.isConnected || !wallet.isCorrectNetwork) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#FF9800' }}>
          Referral Income
        </Typography>
        <Alert severity="warning">
          Please connect your wallet and switch to BSC Testnet to view referral income.
        </Alert>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Box>
        <Typography variant="h5" gutterBottom>Loading Referral Income Data...</Typography>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#ffffff', mb: 1 }}>
            🤝 Referral Income
          </Typography>
          <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
            Earn commissions from your team's investments across 5 levels
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={loadReferralData}
          sx={{
            borderColor: '#4caf50',
            color: '#4caf50',
            '&:hover': {
              borderColor: '#45a049',
              bgcolor: 'rgba(76, 175, 80, 0.1)'
            }
          }}
        >
          Refresh Data
        </Button>
      </Box>

      {/* Income Stats Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{
            background: '#1e1e1e',
            border: '1px solid #333',
            borderRadius: 3,
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
              borderColor: '#4caf50'
            }
          }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <MonetizationOn sx={{ mr: 1, color: '#4caf50' }} />
                <Typography variant="h6" sx={{ color: '#ffffff' }}>Total Referral Income</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#ffffff' }}>
                {userInvestmentData ? formatAmount(userInvestmentData.totalLevelIncome) : incomeStats.totalReferralIncome}
              </Typography>
              <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                USDT
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <Timeline sx={{ mr: 1 }} />
                <Typography variant="h6">This Month</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {incomeStats.thisMonthIncome}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                USDT
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <People sx={{ mr: 1 }} />
                <Typography variant="h6">Direct Commissions</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {incomeStats.directCommissions}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                USDT
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <AccountTree sx={{ mr: 1 }} />
                <Typography variant="h6">Indirect Commissions</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {incomeStats.indirectCommissions}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                USDT
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Commission Structure */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Commission Structure
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Stack spacing={2}>
                {commissionRates.map((rate, index) => (
                  <Box key={index} display="flex" justifyContent="space-between" alignItems="center">
                    <Box display="flex" alignItems="center">
                      <Avatar sx={{ bgcolor: getLevelColor(index + 1), mr: 2, width: 32, height: 32 }}>
                        {index + 1}
                      </Avatar>
                      <Typography variant="body1">Level {index + 1}</Typography>
                    </Box>
                    <Chip 
                      label={`${rate}%`}
                      sx={{ 
                        bgcolor: getLevelColor(index + 1),
                        color: 'white',
                        fontWeight: 'bold'
                      }}
                    />
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Income Breakdown
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Stack spacing={2}>
                <Box>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2">Direct Referrals (Level 1)</Typography>
                    <Typography variant="body2">{((parseFloat(incomeStats.directCommissions) / parseFloat(incomeStats.totalReferralIncome)) * 100 || 0).toFixed(1)}%</Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={(parseFloat(incomeStats.directCommissions) / parseFloat(incomeStats.totalReferralIncome)) * 100 || 0}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: '#FF9800',
                      }
                    }}
                  />
                </Box>

                <Box>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2">Indirect Referrals (Level 2-5)</Typography>
                    <Typography variant="body2">{((parseFloat(incomeStats.indirectCommissions) / parseFloat(incomeStats.totalReferralIncome)) * 100 || 0).toFixed(1)}%</Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={(parseFloat(incomeStats.indirectCommissions) / parseFloat(incomeStats.totalReferralIncome)) * 100 || 0}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: '#4CAF50',
                      }
                    }}
                  />
                </Box>

                <Box sx={{ mt: 2, p: 2, bgcolor: 'rgba(255, 152, 0, 0.1)', borderRadius: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Average Commission per Transaction:
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#FF9800' }}>
                    {incomeStats.averageCommission} USDT
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Commissions Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
            Recent Commissions
          </Typography>
          <Divider sx={{ mb: 2 }} />

          {referralCommissions.length > 0 ? (
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'rgba(255, 152, 0, 0.1)' }}>
                    <TableCell><strong>Level</strong></TableCell>
                    <TableCell><strong>From</strong></TableCell>
                    <TableCell><strong>Package</strong></TableCell>
                    <TableCell><strong>Commission</strong></TableCell>
                    <TableCell><strong>Type</strong></TableCell>
                    <TableCell><strong>Date</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {referralCommissions.slice(0, 10).map((commission, index) => (
                    <TableRow key={index} hover>
                      <TableCell>
                        <Avatar sx={{ bgcolor: getLevelColor(commission.level), width: 32, height: 32 }}>
                          {commission.level}
                        </Avatar>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                          {formatAddress(commission.address)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          {getPackageIcon(commission.packageType)}
                          <Typography variant="body2" sx={{ ml: 1 }}>
                            {commission.packageType}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                          {commission.amount} USDT
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={commission.type}
                          color={commission.type === 'direct' ? 'primary' : 'secondary'}
                          size="small"
                          sx={{ textTransform: 'capitalize' }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {commission.date}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Alert severity="info">
              <Typography variant="body2">
                No referral commissions yet. Start building your team to earn commissions!
              </Typography>
            </Alert>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default ReferralIncome;
