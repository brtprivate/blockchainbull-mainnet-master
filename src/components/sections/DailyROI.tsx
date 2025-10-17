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
  Button,
  Divider,
  Avatar,
} from '@mui/material';
import {
  TrendingUp,
  MonetizationOn,
  AccessTime,
  CalendarToday,
  Diamond,
  Star,
  EmojiEvents,
  AccountBalanceWallet,
  Refresh,
} from '@mui/icons-material';
import { useInvestment } from '../../context/InvestmentContext';

interface DailyROIData {
  date: string;
  investment: string;
  packageName: string;
  packageId: number;
  dailyReturn: string;
  totalEarned: string;
  status: 'active' | 'completed';
}

const DailyROI: React.FC = () => {
  const {
    userContributions,
    totalPendingRewards,
    packages,
    refreshUserData,
    isLoading,
  } = useInvestment();

  const [roiData, setRoiData] = useState<DailyROIData[]>([]);

  // Package names
  const packageNames = ['Starter', 'Silver', 'Gold', 'Diamond'];

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

  // Get package icon
  const getPackageIcon = (packageId: number) => {
    switch (packageId) {
      case 0: return <Star sx={{ color: '#ff9800', fontSize: 20 }} />;
      case 1: return <AccountBalanceWallet sx={{ color: '#9e9e9e', fontSize: 20 }} />;
      case 2: return <EmojiEvents sx={{ color: '#ffc107', fontSize: 20 }} />;
      case 3: return <Diamond sx={{ color: '#9c27b0', fontSize: 20 }} />;
      default: return <Star sx={{ fontSize: 20 }} />;
    }
  };

  // Get package color
  const getPackageColor = (packageId: number) => {
    switch (packageId) {
      case 0: return '#ff9800';
      case 1: return '#9e9e9e';
      case 2: return '#ffc107';
      case 3: return '#9c27b0';
      default: return '#ff9800';
    }
  };

  // Calculate daily ROI data
  useEffect(() => {
    if (userContributions.length > 0 && packages.length > 0) {
      const data: DailyROIData[] = userContributions.map((contribution) => {
        const packageId = Number(contribution.planIndex);
        const packageInfo = packages[packageId];
        const dailyRate = packageInfo ? Number(formatAmount(packageInfo.rewardMultiplier)) : 0;
        
        // Calculate daily return (rate per minute * 1440 minutes per day)
        const dailyReturn = (Number(formatAmount(contribution.amount)) * dailyRate * 1440) / 10000;
        
        // Calculate ROI percentage
        const totalEarned = Number(formatAmount(contribution.rewardClaimed));
        const investmentAmount = Number(formatAmount(contribution.amount));
        const roiPercentage = investmentAmount > 0 ? (totalEarned / investmentAmount) * 100 : 0;
        
        return {
          date: new Date(Number(contribution.lastClaimTime) * 1000).toLocaleDateString(),
          investment: formatAmount(contribution.amount),
          packageName: packageNames[packageId],
          packageId,
          dailyReturn: dailyReturn.toFixed(4),
          totalEarned: formatAmount(contribution.rewardClaimed),
          status: roiPercentage >= 200 ? 'completed' : 'active'
        };
      });
      
      setRoiData(data);
    }
  }, [userContributions, packages]);

  // Calculate totals
  const totalDailyReturn = roiData.reduce((sum, item) => sum + parseFloat(item.dailyReturn), 0);
  const totalEarned = roiData.reduce((sum, item) => sum + parseFloat(item.totalEarned), 0);
  const activeInvestments = roiData.filter(item => item.status === 'active').length;

  if (isLoading) {
    return (
      <Box>
        <Typography variant="h5" gutterBottom>Loading ROI Data...</Typography>
        <LinearProgress />
      </Box>
    );
  }

  if (roiData.length === 0) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#FF9800' }}>
          Daily ROI
        </Typography>
        
        <Alert severity="info" sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>No ROI data available</Typography>
          <Typography variant="body2">
            Make your first investment to start tracking your daily returns on investment.
          </Typography>
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#ffffff' }}>
          📈 Daily ROI Tracker
        </Typography>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={refreshUserData}
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

      {/* ROI Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{
            background: '#1e1e1e',
            color: 'white',
            border: '1px solid #333',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
              borderColor: '#4caf50'
            }
          }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <TrendingUp sx={{ mr: 1, color: '#4caf50' }} />
                <Typography variant="h6" color="#ffffff">Daily Returns</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#ffffff' }}>
                {totalDailyReturn.toFixed(4)}
              </Typography>
              <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                USDT per day
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{
            background: '#1e1e1e',
            color: 'white',
            border: '1px solid #333',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
              borderColor: '#2196f3'
            }
          }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <MonetizationOn sx={{ mr: 1, color: '#2196f3' }} />
                <Typography variant="h6" color="#ffffff">Total Earned</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#ffffff' }}>
                {totalEarned.toFixed(4)}
              </Typography>
              <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                USDT
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{
            background: '#1e1e1e',
            color: 'white',
            border: '1px solid #333',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
              borderColor: '#ff9800'
            }
          }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <AccessTime sx={{ mr: 1, color: '#ff9800' }} />
                <Typography variant="h6" color="#ffffff">Pending</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#ffffff' }}>
                {formatAmount(totalPendingRewards)}
              </Typography>
              <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                USDT
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{
            background: '#1e1e1e',
            color: 'white',
            border: '1px solid #333',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
              borderColor: '#9c27b0'
            }
          }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <CalendarToday sx={{ mr: 1, color: '#9c27b0' }} />
                <Typography variant="h6" color="#ffffff">Active Plans</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#ffffff' }}>
                {activeInvestments}
              </Typography>
              <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                Investments
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* ROI Details Table */}
      <Card sx={{ background: '#1e1e1e', border: '1px solid #333' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#ffffff' }}>
            📊 Investment ROI Details
          </Typography>
          <Divider sx={{ mb: 2, borderColor: '#333' }} />

          <TableContainer component={Paper} elevation={0} sx={{ bgcolor: '#1e1e1e' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#333' }}>
                  <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Package</TableCell>
                  <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Investment</TableCell>
                  <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Daily Return</TableCell>
                  <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Total Earned</TableCell>
                  <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>ROI %</TableCell>
                  <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {roiData.map((row, index) => {
                  const roiPercentage = ((parseFloat(row.totalEarned) / parseFloat(row.investment)) * 100);
                  
                  return (
                    <TableRow key={index} hover sx={{
                      '&:hover': { bgcolor: '#2d2d2d' },
                      bgcolor: '#1e1e1e'
                    }}>
                      <TableCell sx={{ borderColor: '#333' }}>
                        <Box display="flex" alignItems="center">
                          <Avatar sx={{ bgcolor: getPackageColor(row.packageId), mr: 2, width: 32, height: 32 }}>
                            {getPackageIcon(row.packageId)}
                          </Avatar>
                          <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#ffffff' }}>
                            {row.packageName}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ borderColor: '#333' }}>
                        <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#ffffff' }}>
                          {row.investment} USDT
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ borderColor: '#333' }}>
                        <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
                          {row.dailyReturn} USDT
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ borderColor: '#333' }}>
                        <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#ffffff' }}>
                          {row.totalEarned} USDT
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ borderColor: '#333' }}>
                        <Box display="flex" alignItems="center">
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 'bold',
                              color: roiPercentage >= 200 ? '#4caf50' : '#2196f3'
                            }}
                          >
                            {roiPercentage.toFixed(2)}%
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={Math.min(roiPercentage / 2, 100)}
                            sx={{
                              ml: 2,
                              width: 60,
                              height: 6,
                              borderRadius: 3,
                              bgcolor: '#333',
                              '& .MuiLinearProgress-bar': {
                                backgroundColor: getPackageColor(row.packageId),
                              }
                            }}
                          />
                        </Box>
                      </TableCell>
                      <TableCell sx={{ borderColor: '#333' }}>
                        <Chip
                          label={row.status === 'active' ? 'Active' : 'Completed'}
                          sx={{
                            bgcolor: row.status === 'active' ? '#1e3a1e' : '#333',
                            color: row.status === 'active' ? '#4caf50' : '#b0b0b0',
                            border: `1px solid ${row.status === 'active' ? '#4caf50' : '#555'}`
                          }}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* ROI Information */}
      <Alert severity="info" sx={{ mt: 3 }}>
        <Typography variant="body2">
          <strong>ROI Information:</strong> Daily returns are calculated based on your package's reward multiplier. 
          Each investment can earn up to 200% ROI before completion. Returns are distributed every minute and can be claimed anytime.
        </Typography>
      </Alert>
    </Box>
  );
};

export default DailyROI;
