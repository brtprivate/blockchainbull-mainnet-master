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
  Divider,
  Button,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  Publish,
  MonetizationOn,
  TrendingUp,
  CalendarToday,
  Search,
  FilterList,
  Refresh,
  Star,
  EmojiEvents,
  Diamond,
  AccountBalanceWallet,
} from '@mui/icons-material';
import { useInvestment } from '../../context/InvestmentContext';
import { useMLM } from '../../context/MLMContext';
import { useWallet } from '../../context/WalletContext';

interface DepositRecord {
  id: string;
  amount: string;
  packageType: string;
  packageId: number;
  date: string;
  txHash: string;
  status: 'completed' | 'pending' | 'failed';
  roi: string;
}

const DepositHistory: React.FC = () => {
  const { userContributions, isLoading } = useInvestment();
  const wallet = useWallet();
  const mlm = useMLM();

  const [depositHistory, setDepositHistory] = useState<DepositRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPackage, setFilterPackage] = useState('all');
  const [depositStats, setDepositStats] = useState({
    totalDeposits: '0',
    totalAmount: '0',
    averageDeposit: '0',
    thisMonthDeposits: '0',
  });

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

  // Generate deposit history from user contributions
  useEffect(() => {
    if (userContributions.length > 0) {
      const deposits: DepositRecord[] = userContributions.map((contribution, index) => {
        const packageId = Number(contribution.planIndex);
        const amount = formatAmount(contribution.amount);
        const roiPercentage = contribution.amount > 0n 
          ? (Number(contribution.rewardClaimed) / Number(contribution.amount)) * 100 
          : 0;

        return {
          id: `DEP-${index}`,
          amount,
          packageType: packageNames[packageId],
          packageId,
          date: new Date(Number(contribution.lastClaimTime) * 1000).toISOString().split('T')[0],
          txHash: '', // Real transaction hash would come from blockchain events
          status: 'completed' as const,
          roi: roiPercentage.toFixed(2),
        };
      });

      // Sort by date (newest first)
      deposits.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setDepositHistory(deposits);

      // Calculate stats
      const totalAmount = deposits.reduce((sum, deposit) => sum + parseFloat(deposit.amount), 0);
      const averageDeposit = deposits.length > 0 ? totalAmount / deposits.length : 0;
      
      const thisMonth = new Date();
      thisMonth.setDate(1);
      const thisMonthDeposits = deposits.filter(deposit => new Date(deposit.date) >= thisMonth);
      const thisMonthAmount = thisMonthDeposits.reduce((sum, deposit) => sum + parseFloat(deposit.amount), 0);

      setDepositStats({
        totalDeposits: deposits.length.toString(),
        totalAmount: totalAmount.toFixed(2),
        averageDeposit: averageDeposit.toFixed(2),
        thisMonthDeposits: thisMonthAmount.toFixed(2),
      });
    }
  }, [userContributions]);

  const getPackageIcon = (packageId: number) => {
    switch (packageId) {
      case 0: return <Star sx={{ color: '#FFA726' }} />;
      case 1: return <AccountBalanceWallet sx={{ color: '#C0C0C0' }} />;
      case 2: return <EmojiEvents sx={{ color: '#FFD700' }} />;
      case 3: return <Diamond sx={{ color: '#E1BEE7' }} />;
      default: return <Star />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'pending': return 'warning';
      case 'failed': return 'error';
      default: return 'default';
    }
  };

  const filteredDeposits = depositHistory.filter(deposit => {
    const matchesSearch = deposit.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         deposit.txHash.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         deposit.packageType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterPackage === 'all' || deposit.packageType.toLowerCase() === filterPackage.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  if (!wallet.isConnected || !wallet.isCorrectNetwork) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#FF9800' }}>
          Deposit History
        </Typography>
        <Alert severity="warning">
          Please connect your wallet and switch to BSC Testnet to view deposit history.
        </Alert>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Box>
        <Typography variant="h5" gutterBottom>Loading Deposit History...</Typography>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#FF9800' }}>
          Deposit History
        </Typography>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          sx={{ borderColor: '#FF9800', color: '#FF9800' }}
        >
          Refresh
        </Button>
      </Box>

      {/* Deposit Stats Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <Publish sx={{ mr: 1 }} />
                <Typography variant="h6">Total Deposits</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {depositStats.totalDeposits}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Transactions
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <MonetizationOn sx={{ mr: 1 }} />
                <Typography variant="h6">Total Amount</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {depositStats.totalAmount}
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
                <TrendingUp sx={{ mr: 1 }} />
                <Typography variant="h6">Average Deposit</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {depositStats.averageDeposit}
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
                <CalendarToday sx={{ mr: 1 }} />
                <Typography variant="h6">This Month</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {depositStats.thisMonthDeposits}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                USDT
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters and Search */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search by ID, transaction hash, or package..."
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
                label="Filter by Package"
                value={filterPackage}
                onChange={(e) => setFilterPackage(e.target.value)}
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
                <option value="all">All Packages</option>
                <option value="starter">Starter</option>
                <option value="silver">Silver</option>
                <option value="gold">Gold</option>
                <option value="diamond">Diamond</option>
              </TextField>
            </Grid>
            <Grid item xs={12} md={2}>
              <Typography variant="body2" color="text.secondary">
                {filteredDeposits.length} of {depositHistory.length} deposits
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Deposit History Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
            Transaction History
          </Typography>
          <Divider sx={{ mb: 2 }} />

          {filteredDeposits.length > 0 ? (
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'rgba(255, 152, 0, 0.1)' }}>
                    <TableCell><strong>Transaction ID</strong></TableCell>
                    <TableCell><strong>Package</strong></TableCell>
                    <TableCell><strong>Amount</strong></TableCell>
                    <TableCell><strong>Date</strong></TableCell>
                    <TableCell><strong>Current ROI</strong></TableCell>
                    <TableCell><strong>Status</strong></TableCell>
                    <TableCell><strong>TX Hash</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredDeposits.map((deposit, index) => (
                    <TableRow key={index} hover>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
                          {deposit.id}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          {getPackageIcon(deposit.packageId)}
                          <Typography variant="body2" sx={{ ml: 1, fontWeight: 'bold' }}>
                            {deposit.packageType}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#FF9800' }}>
                          {deposit.amount} USDT
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {deposit.date}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                          {deposit.roi}%
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={deposit.status}
                          color={getStatusColor(deposit.status) as any}
                          size="small"
                          sx={{ textTransform: 'capitalize' }}
                        />
                      </TableCell>
                      <TableCell>
                        {deposit.txHash ? (
                          <Typography
                            variant="body2"
                            sx={{
                              fontFamily: 'monospace',
                              cursor: 'pointer',
                              color: 'primary.main',
                              '&:hover': { textDecoration: 'underline' }
                            }}
                            onClick={() => window.open(`https://bscscan.com/tx/${deposit.txHash}`, '_blank')}
                          >
                            {deposit.txHash.slice(0, 10)}...{deposit.txHash.slice(-8)}
                          </Typography>
                        ) : (
                          <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                            On-chain data
                          </Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Alert severity="info">
              <Typography variant="body2">
                {depositHistory.length === 0 
                  ? "No deposits found. Start investing to see your deposit history!"
                  : "No deposits match your search criteria."
                }
              </Typography>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Investment Tips */}
      <Alert severity="success" sx={{ mt: 3 }}>
        <Typography variant="body2">
          <strong>Investment Tips:</strong> Diversify your investments across different packages 
          to maximize your returns. Higher tier packages offer better daily ROI rates!
        </Typography>
      </Alert>
    </Box>
  );
};

export default DepositHistory;
