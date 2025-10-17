import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Divider,
  IconButton,
  LinearProgress,
  Chip,
  Avatar,
} from '@mui/material';
import {
  MonetizationOn,
  Close,
  AccountBalanceWallet,
  TrendingUp,
  Security,
  Speed,
  CheckCircle,
  Warning,
} from '@mui/icons-material';
import { useInvestment } from '../../context/InvestmentContext';
import { useMLMSafe } from '../../context/MLMContext';
import { useWallet } from '../../context/WalletContext';


const Withdraw: React.FC = () => {
  const { totalPendingRewards, userInvestmentData, claimReward, isClaiming, userContributions, packages, refreshUserData } = useInvestment();
  const wallet = useWallet();
  const mlmContext = useMLMSafe();
  const mlm = mlmContext || {
    isMLMRegistered: false,
    isLoading: false,
    checkMLMRegistration: async () => false
  };

  const [showWithdrawDialog, setShowWithdrawDialog] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [showDebugInfo, setShowDebugInfo] = useState(false);

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



  const handleWithdraw = async () => {
    try {
      if (userContributions.length === 0) {
        throw new Error('No investments found to withdraw from');
      }

      const withdrawalStartTime = Date.now();
      const grossAmount = parseFloat(availableAmount);

      // Calculate actual fees (0% based on contract - no withdrawal fees)
      const feeAmount = 0; // No fees according to contract
      const netAmount = grossAmount - feeAmount;

      // Claim rewards from all contributions
      let successfulClaims = 0;
      const totalContributions = userContributions.length;
      const claimedContributions: number[] = [];

      for (let i = 0; i < totalContributions; i++) {
        try {
          console.log(`Claiming reward for contribution ${i}...`);
          await claimReward(i);
          successfulClaims++;
          claimedContributions.push(i);
        } catch (error) {
          console.error(`Failed to claim reward for contribution ${i}:`, error);
          // Continue with other contributions even if one fails
        }
      }

      if (successfulClaims > 0) {
        console.log(`Successfully claimed rewards from ${successfulClaims}/${totalContributions} contributions`);

        // Refresh all dashboard data after successful withdrawal
        console.log('🔄 Refreshing dashboard after withdrawal...');
        await refreshUserData();

        setShowWithdrawDialog(false);
        setWithdrawAmount('');
      } else {
        throw new Error('Failed to claim rewards from any contributions');
      }
    } catch (error) {
      console.error('Withdrawal failed:', error);
    }
  };

  const availableAmount = formatAmount(totalPendingRewards);
  const withdrawalFee = 0; // No withdrawal fees according to contract
  const netAmount = parseFloat(availableAmount) - withdrawalFee;

  if (!wallet.isConnected || !wallet.isCorrectNetwork) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#ffffff' }}>
          💸 Withdraw Funds
        </Typography>
        <Alert severity="warning">
          Please connect your wallet and switch to BSC Testnet to access withdrawal features.
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Box mb={3}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#ffffff', mb: 1 }}>
          💸 Withdraw Funds
        </Typography>
        <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
          Instantly withdraw your earned rewards to your wallet
        </Typography>

        {/* Debug Button */}
        <Button
          variant="outlined"
          size="small"
          onClick={() => setShowDebugInfo(!showDebugInfo)}
          sx={{ mt: 2, borderColor: '#666', color: '#666' }}
        >
          {showDebugInfo ? 'Hide' : 'Show'} Debug Info
        </Button>
      </Box>

      {/* Debug Information */}
      {showDebugInfo && (
        <Card sx={{ mb: 3, bgcolor: '#1a1a1a', border: '1px solid #333' }}>
          <CardContent>
            <Typography variant="h6" sx={{ color: '#ffffff', mb: 2 }}>
              🔍 Reward Calculation Debug
            </Typography>

            <Typography variant="body2" sx={{ color: '#b0b0b0', mb: 2 }}>
              Total Pending Rewards: {formatAmount(totalPendingRewards)} USDT
            </Typography>

            {userContributions.map((contribution, index) => {
              const packageInfo = packages.find(pkg => pkg.id === Number(contribution.planIndex));
              const timeSinceLastClaim = Math.floor((Date.now() / 1000) - Number(contribution.lastClaimTime));
              const minutesSinceLastClaim = Math.floor(timeSinceLastClaim / 60);

              if (!packageInfo) return null;

              const rewardMultiplier = Number(formatAmount(packageInfo.rewardMultiplier));
              const investmentAmount = Number(formatAmount(contribution.amount));
              const rewardPerMinute = (investmentAmount * rewardMultiplier) / 10000;
              const estimatedReward = rewardPerMinute * minutesSinceLastClaim;

              return (
                <Box key={index} sx={{ mb: 2, p: 2, bgcolor: '#2a2a2a', borderRadius: 1 }}>
                  <Typography variant="body2" sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                    Investment #{index + 1} - {packageInfo.name} Package
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                    Investment: {formatAmount(contribution.amount)} USDT
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                    Reward Rate: {rewardMultiplier}% per minute
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                    Reward per minute: {rewardPerMinute.toFixed(6)} USDT
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                    Minutes since last claim: {minutesSinceLastClaim}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#4caf50' }}>
                    Estimated current reward: {estimatedReward.toFixed(6)} USDT
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                    Already claimed: {formatAmount(contribution.rewardClaimed)} USDT
                  </Typography>
                </Box>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Main Withdrawal Card */}
      <Card sx={{
        background: '#1e1e1e',
        border: '2px solid #4caf50',
        borderRadius: 4,
        mb: 4,
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
        }
      }}>
        <CardContent sx={{ p: 4 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={8}>
              <Box display="flex" alignItems="center" mb={3}>
                <Avatar sx={{ bgcolor: '#4caf50', mr: 3, width: 56, height: 56 }}>
                  <MonetizationOn sx={{ fontSize: 32 }} />
                </Avatar>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#ffffff' }}>
                    Available Balance
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                    Your total withdrawable amount
                  </Typography>
                </Box>
              </Box>
              
              <Typography variant="h2" sx={{ fontWeight: 'bold', color: '#4caf50', mb: 2 }}>
                {availableAmount} USDT
              </Typography>
              
              <Box display="flex" gap={2} flexWrap="wrap">
                <Chip
                  icon={<Speed />}
                  label="Instant Withdrawal"
                  sx={{ bgcolor: '#1e3a1e', color: '#4caf50', border: '1px solid #4caf50' }}
                />
                <Chip
                  icon={<Security />}
                  label="Secure Transaction"
                  sx={{ bgcolor: '#1e3a1e', color: '#4caf50', border: '1px solid #4caf50' }}
                />
                <Chip
                  icon={<CheckCircle />}
                  label="0% Fee"
                  sx={{ bgcolor: '#1e3a1e', color: '#4caf50', border: '1px solid #4caf50' }}
                />
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={() => setShowWithdrawDialog(true)}
                disabled={totalPendingRewards === 0n || isClaiming}
                sx={{
                  backgroundColor: '#4caf50',
                  color: 'white',
                  fontWeight: 'bold',
                  py: 2,
                  fontSize: '1.2rem',
                  borderRadius: 3,
                  boxShadow: '0 4px 20px rgba(76, 175, 80, 0.3)',
                  '&:hover': {
                    backgroundColor: '#45a049',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 25px rgba(76, 175, 80, 0.4)'
                  },
                  '&:disabled': {
                    backgroundColor: '#555',
                    color: '#888'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                {isClaiming ? 'Processing...' : '💸 Withdraw Now'}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Withdrawal Information */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ background: '#1e1e1e', border: '1px solid #333', height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#ffffff' }}>
                📋 Withdrawal Information
              </Typography>
              <Divider sx={{ mb: 2, borderColor: '#333' }} />
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ color: '#b0b0b0' }} gutterBottom>
                  <strong>Processing Time:</strong>
                </Typography>
                <Typography variant="body2" sx={{ color: '#ffffff' }}>
                  Instant - Funds appear in your wallet immediately
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ color: '#b0b0b0' }} gutterBottom>
                  <strong>Withdrawal Fee:</strong>
                </Typography>
                <Typography variant="body2" sx={{ color: '#ffffff' }}>
                  0% - No withdrawal fees
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ color: '#b0b0b0' }} gutterBottom>
                  <strong>Minimum Amount:</strong>
                </Typography>
                <Typography variant="body2" sx={{ color: '#ffffff' }}>
                  No minimum limit
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="body2" sx={{ color: '#b0b0b0' }} gutterBottom>
                  <strong>Network:</strong>
                </Typography>
                <Typography variant="body2" sx={{ color: '#ffffff' }}>
                  BSC (Binance Smart Chain)
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card sx={{ background: '#1e1e1e', border: '1px solid #333', height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#ffffff' }}>
                💰 Earnings Summary
              </Typography>
              <Divider sx={{ mb: 2, borderColor: '#333' }} />
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ color: '#b0b0b0' }} gutterBottom>
                  <strong>Total Invested:</strong>
                </Typography>
                <Typography variant="body2" sx={{ color: '#ffffff' }}>
                  {userInvestmentData ? formatAmount(userInvestmentData.totalContribution) : '0'} USDT
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ color: '#b0b0b0' }} gutterBottom>
                  <strong>Total Claimed:</strong>
                </Typography>
                <Typography variant="body2" sx={{ color: '#ffffff' }}>
                  {userInvestmentData ? formatAmount(userInvestmentData.totalClaimedReward) : '0'} USDT
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ color: '#b0b0b0' }} gutterBottom>
                  <strong>Referral Income:</strong>
                </Typography>
                <Typography variant="body2" sx={{ color: '#ffffff' }}>
                  {userInvestmentData ? formatAmount(userInvestmentData.totalLevelIncome) : '0'} USDT
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="body2" sx={{ color: '#b0b0b0' }} gutterBottom>
                  <strong>Available Now:</strong>
                </Typography>
                <Typography variant="h6" sx={{ color: '#4caf50', fontWeight: 'bold' }}>
                  {availableAmount} USDT
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Withdrawal Dialog */}
      <Dialog
        open={showWithdrawDialog}
        onClose={() => setShowWithdrawDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: '#1e1e1e',
            border: '1px solid #333',
          }
        }}
      >
        <DialogTitle sx={{ bgcolor: '#1a1a1a', borderBottom: '1px solid #333' }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" sx={{ color: '#ffffff' }}>
              💸 Confirm Withdrawal
            </Typography>
            <IconButton onClick={() => setShowWithdrawDialog(false)} sx={{ color: '#ffffff' }}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        
        <DialogContent sx={{ bgcolor: '#1e1e1e', p: 3 }}>
          <Alert
            severity="info"
            sx={{
              mb: 3,
              bgcolor: '#1a3a3a',
              color: '#4fc3f7',
              border: '1px solid #4fc3f7',
              '& .MuiAlert-icon': {
                color: '#4fc3f7'
              }
            }}
          >
            You are about to withdraw your available rewards. This action cannot be undone.
          </Alert>

          <Box sx={{ mb: 3, p: 3, bgcolor: '#333', border: '1px solid #555', borderRadius: 2 }}>
            <Typography variant="body2" sx={{ color: '#b0b0b0' }} gutterBottom>
              <strong>💰 Withdrawal Details:</strong>
            </Typography>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography variant="body2" sx={{ color: '#ffffff' }}>
                Available Amount:
              </Typography>
              <Typography variant="body2" sx={{ color: '#4caf50', fontWeight: 'bold' }}>
                {availableAmount} USDT
              </Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography variant="body2" sx={{ color: '#ffffff' }}>
                Withdrawal Fee (0%):
              </Typography>
              <Typography variant="body2" sx={{ color: '#4caf50' }}>
                {withdrawalFee.toFixed(4)} USDT
              </Typography>
            </Box>
            <Divider sx={{ my: 1, borderColor: '#555' }} />
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body2" sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                Net Amount:
              </Typography>
              <Typography variant="body2" sx={{ color: '#4caf50', fontWeight: 'bold' }}>
                {netAmount.toFixed(4)} USDT
              </Typography>
            </Box>
          </Box>

          {totalPendingRewards === 0n && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              No funds available for withdrawal. Start investing to earn rewards!
            </Alert>
          )}
        </DialogContent>
        
        <DialogActions sx={{ p: 3, bgcolor: '#1a1a1a', borderTop: '1px solid #333' }}>
          <Button
            onClick={() => setShowWithdrawDialog(false)}
            size="large"
            sx={{
              color: '#b0b0b0',
              '&:hover': {
                bgcolor: '#333'
              }
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleWithdraw}
            disabled={isClaiming || totalPendingRewards === 0n}
            size="large"
            sx={{
              backgroundColor: '#4caf50',
              minWidth: 120,
              '&:hover': {
                backgroundColor: '#45a049',
              },
              '&:disabled': {
                backgroundColor: '#555',
                color: '#888'
              }
            }}
          >
            {isClaiming ? 'Processing...' : 'Confirm Withdrawal'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Withdraw;
