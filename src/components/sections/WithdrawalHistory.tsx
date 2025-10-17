import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
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
  Stack,
  Divider,
  Button,
  TextField,
  InputAdornment,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import {
  GetApp,
  MonetizationOn,
  TrendingDown,
  CalendarToday,
  Search,
  FilterList,
  Refresh,
  CheckCircle,
  Schedule,
  Error,
} from '@mui/icons-material';
import { useInvestment } from '../../context/InvestmentContext';
import { useMLMSafe } from '../../context/MLMContext';
import { useWallet } from '../../context/WalletContext';
import { useTransactionHistory } from '../../context/TransactionHistoryContext';

interface WithdrawalRecord {
  id: string;
  amount: string;
  date: string;
  txHash: string;
  status: 'completed' | 'pending' | 'failed';
  type: 'roi' | 'referral' | 'principal';
  fee: string;
  netAmount: string;
}

const WithdrawalHistory: React.FC = () => {
  const { userInvestmentData, totalPendingRewards } = useInvestment();
  const wallet = useWallet();
  const mlmContext = useMLMSafe();
  const mlm = mlmContext || {
    isMLMRegistered: false,
    isLoading: false,
    checkMLMRegistration: async () => false
  };
  const { getWithdrawalHistory, getTotalWithdrawals } = useTransactionHistory();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Get withdrawal history from transaction context
  const withdrawalHistory = getWithdrawalHistory();
  const withdrawalStats = getTotalWithdrawals();

  // Calculate this month's withdrawals
  const thisMonth = new Date().getMonth();
  const thisYear = new Date().getFullYear();
  const thisMonthWithdrawals = withdrawalHistory
    .filter(tx => {
      const txDate = new Date(tx.date);
      return txDate.getMonth() === thisMonth && txDate.getFullYear() === thisYear;
    })
    .reduce((sum, tx) => sum + parseFloat(tx.amount), 0);

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

  // Convert transaction records to withdrawal records for compatibility
  const convertedWithdrawalHistory: WithdrawalRecord[] = withdrawalHistory.map(tx => ({
    id: tx.id,
    amount: tx.amount,
    date: tx.date,
    txHash: tx.txHash,
    status: tx.status,
    type: 'roi' as const, // Default to ROI type
    fee: tx.fee,
    netAmount: tx.netAmount,
  }));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'pending': return 'warning';
      case 'failed': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle sx={{ fontSize: 16 }} />;
      case 'pending': return <Schedule sx={{ fontSize: 16 }} />;
      case 'failed': return <Error sx={{ fontSize: 16 }} />;
      default: return null;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'roi': return '#4CAF50';
      case 'referral': return '#FF9800';
      case 'principal': return '#2196F3';
      default: return '#757575';
    }
  };

  const filteredWithdrawals = convertedWithdrawalHistory.filter(withdrawal => {
    const matchesSearch = withdrawal.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         withdrawal.txHash.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         withdrawal.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || withdrawal.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  if (!wallet.isConnected || !wallet.isCorrectNetwork) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#FF9800' }}>
          Withdrawal History
        </Typography>
        <Alert severity="warning">
          Please connect your wallet and switch to BSC Testnet to view withdrawal history.
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#ffffff', mb: 1 }}>
            💸 Withdrawal History
          </Typography>
          <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
            Track all your withdrawal transactions and earnings
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          sx={{
            borderColor: '#4caf50',
            color: '#4caf50',
            '&:hover': {
              borderColor: '#45a049',
              bgcolor: 'rgba(76, 175, 80, 0.1)'
            }
          }}
        >
          Refresh
        </Button>
      </Box>

      {/* Withdrawal Stats Overview */}
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
                <GetApp sx={{ mr: 1, color: '#4caf50' }} />
                <Typography variant="h6" sx={{ color: '#ffffff' }}>Total Withdrawals</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#ffffff' }}>
                {withdrawalStats.count}
              </Typography>
              <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                Transactions
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{
            background: '#1e1e1e',
            border: '1px solid #333',
            borderRadius: 3,
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
                <Typography variant="h6" sx={{ color: '#ffffff' }}>Total Amount</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#ffffff' }}>
                {withdrawalStats.amount.toFixed(4)}
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
            border: '1px solid #333',
            borderRadius: 3,
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
              borderColor: '#ff9800'
            }
          }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <TrendingDown sx={{ mr: 1, color: '#ff9800' }} />
                <Typography variant="h6" sx={{ color: '#ffffff' }}>Total Fees</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#ffffff' }}>
                {withdrawalStats.fees.toFixed(4)}
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
            border: '1px solid #333',
            borderRadius: 3,
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
                <Typography variant="h6" sx={{ color: '#ffffff' }}>This Month</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#ffffff' }}>
                {thisMonthWithdrawals.toFixed(4)}
              </Typography>
              <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                USDT
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Available Balance */}
      <Card sx={{
        mb: 3,
        background: '#1e1e1e',
        border: '2px solid #4caf50',
        borderRadius: 3,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, #4caf50, #81c784, #4caf50)',
          animation: 'shimmer 2s infinite'
        },
        '@keyframes shimmer': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        }
      }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={8}>
              <Box display="flex" alignItems="center" mb={2}>
                <MonetizationOn sx={{ mr: 2, color: '#4caf50', fontSize: 32 }} />
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#ffffff' }}>
                    💰 Available for Withdrawal
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                    Your pending rewards ready to be withdrawn
                  </Typography>
                </Box>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#4caf50', mb: 1 }}>
                {formatAmount(totalPendingRewards)} USDT
              </Typography>
              
            </Grid>
            <Grid item xs={12} md={4}>
              <Button
                variant="contained"
                size="large"
                fullWidth
                sx={{
                  backgroundColor: '#4caf50',
                  color: 'white',
                  fontWeight: 'bold',
                  py: 2,
                  fontSize: '1.1rem',
                  borderRadius: 3,
                  boxShadow: '0 4px 20px rgba(76, 175, 80, 0.3)',
                  '&:hover': {
                    backgroundColor: '#45a049',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 25px rgba(76, 175, 80, 0.4)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                💸 Withdraw Now
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Filters and Search */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search by ID, transaction hash, or type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                select
                label="Filter by Status"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                SelectProps={{
                  native: true,
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FilterList />
                    </InputAdornment>
                  ),
                }}
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </TextField>
            </Grid>
            <Grid item xs={12} md={2}>
              <Typography variant="body2" color="text.secondary">
                {filteredWithdrawals.length} of {convertedWithdrawalHistory.length} withdrawals
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Withdrawal History Table */}
      <Card sx={{ background: '#1e1e1e', border: '1px solid #333' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#ffffff' }}>
            📊 Transaction History
          </Typography>
          <Divider sx={{ mb: 2, borderColor: '#333' }} />

          {filteredWithdrawals.length > 0 ? (
            <TableContainer component={Paper} elevation={0} sx={{ bgcolor: '#1e1e1e' }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#333' }}>
                    <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Transaction ID</TableCell>
                    <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Type</TableCell>
                    <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Amount</TableCell>
                    <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Fee</TableCell>
                    <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Net Amount</TableCell>
                    <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Date</TableCell>
                    <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Status</TableCell>
                    <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>TX Hash</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredWithdrawals.map((withdrawal, index) => (
                    <TableRow key={index} hover sx={{
                      '&:hover': { bgcolor: '#2d2d2d' },
                      bgcolor: '#1e1e1e'
                    }}>
                      <TableCell sx={{ borderColor: '#333' }}>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 'bold', color: '#ffffff' }}>
                          {withdrawal.id}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={withdrawal.type.toUpperCase()}
                          size="small"
                          sx={{
                            backgroundColor: getTypeColor(withdrawal.type),
                            color: 'white',
                            fontWeight: 'bold'
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {withdrawal.amount} USDT
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="error.main">
                          -{withdrawal.fee} USDT
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                          {withdrawal.netAmount} USDT
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {withdrawal.date}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          {getStatusIcon(withdrawal.status)}
                          <Chip
                            label={withdrawal.status}
                            color={getStatusColor(withdrawal.status) as any}
                            size="small"
                            sx={{ ml: 1, textTransform: 'capitalize' }}
                          />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontFamily: 'monospace',
                            cursor: 'pointer',
                            color: 'primary.main',
                            '&:hover': { textDecoration: 'underline' }
                          }}
                          onClick={() => window.open(`https://bscscan.com/tx/${withdrawal.txHash}`, '_blank')}
                        >
                          {withdrawal.txHash.slice(0, 10)}...{withdrawal.txHash.slice(-8)}
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
                {withdrawalHistory.length === 0 
                  ? "No withdrawals found. Start earning and withdraw your rewards!"
                  : "No withdrawals match your search criteria."
                }
              </Typography>
            </Alert>
          )}
        </CardContent>
      </Card>


    </Box>
  );
};

export default WithdrawalHistory;
