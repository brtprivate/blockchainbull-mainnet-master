
import React, { useState } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Alert,
  Button,
  TextField,
  CircularProgress,
} from '@mui/material';
import { useWallet } from '../context/WalletContext';
import { useChainId, useSwitchChain } from 'wagmi';
import { MAINNET_CHAIN_ID, dwcContractInteractions } from '../services/contractService';
import { waitForTransactionReceipt } from '@wagmi/core';
import { config } from '../config/web3modal';
import RefreshIcon from '@mui/icons-material/Refresh';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import useMLMData from '../hook/useMLMData';
import usePackageDetails from '../hook/usePackageDetails';
import PackagePurchase from '../components/PackagePurchase';
import ReferralSection from '../components/ReferralSection';
import PerformanceOverview from '../components/PerformanceOverview';

const Dashboard = () => {
  const wallet = useWallet();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [showReferralInput, setShowReferralInput] = useState(false);
  const { mlmData, stakes, fetchMlmData, notRegistered } = useMLMData(wallet, chainId, switchChain, setError, setIsLoading);
  const { packageDetails, packages } = usePackageDetails();

  const handleRegister = async () => {
    if (!wallet.isConnected || !wallet.account) {
      setError('Please connect your wallet to register.');
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
      setSuccess('');

      const refCode = referralCode || '0xA841371376190547E54c8Fa72B0e684191E756c7';
      const registerTx = await dwcContractInteractions.registration(refCode, wallet.account);
      await waitForTransactionReceipt(config, { hash: registerTx, chainId: MAINNET_CHAIN_ID });

      setSuccess(`Registration successful! Transaction: ${registerTx}`);
      setReferralCode('');
      setShowReferralInput(false);
      setTimeout(fetchMlmData, 3000);
    } catch (error) {
      console.error('Error registering user:', error);
      if (error.message?.includes('User rejected')) {
        setError('Transaction was cancelled by user');
      } else if (error.message?.includes('already registered')) {
        setError('Address is already registered');
      } else {
        setError(`Failed to register: ${error.message || 'Unknown error'}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleWithdrawStake = async (index, onComplete) => {
    if (!wallet.isConnected || !wallet.account) {
      setError('Please connect your wallet to withdraw.');
      onComplete?.();
      return;
    }

    if (chainId !== MAINNET_CHAIN_ID) {
      try {
        await switchChain({ chainId: MAINNET_CHAIN_ID });
      } catch (error) {
        setError('Please switch to BSC Mainnet.');
        onComplete?.();
        return;
      }
    }

    try {
      setIsLoading(true);
      setError('');
      setSuccess('');

      console.log('=== WITHDRAWAL DEBUG INFO ===');
      console.log(`Stake index: ${index}`);
      console.log(`User account: ${wallet.account}`);
      console.log(`UI Registration status: ${mlmData.isRegistered}`);
      console.log(`UI Stake count: ${mlmData.stakeCount}`);
      console.log(`Stakes array:`, stakes);

      const stakeToWithdraw = stakes.find((s) => s.index === index);
      console.log(`Stake to withdraw:`, stakeToWithdraw);

      if (!stakeToWithdraw) {
        setError('Stake not found. Please refresh and try again.');
        onComplete?.();
        return;
      }

      if (stakeToWithdraw.claimable <= 0) {
        setError('No rewards available to claim for this stake.');
        onComplete?.();
        return;
      }

      setSuccess(`Initiating withdrawal of $${stakeToWithdraw.claimable.toFixed(4)} USDC...`);

      const txHash = await dwcContractInteractions.withdraw(BigInt(index), wallet.account);

      setSuccess('Transaction submitted! Waiting for confirmation...');
      await waitForTransactionReceipt(config, { hash: txHash, chainId: MAINNET_CHAIN_ID });

      setSuccess(`Successfully withdrawn $${stakeToWithdraw.claimable.toFixed(4)} USDC! Transaction: ${txHash}`);

      setTimeout(fetchMlmData, 2000);
    } catch (error) {
      console.error('=== WITHDRAWAL ERROR ===', error);

      if (error.message?.includes('User rejected') || error.message?.includes('cancelled')) {
        setError('Transaction was cancelled by user');
      } else if (error.message?.includes('insufficient funds') || error.message?.includes('Insufficient BNB')) {
        setError('Insufficient BNB for gas fees. Please add BNB to your wallet.');
      } else if (error.message?.includes('No rewards available')) {
        setError('No rewards available to claim for this stake.');
      } else if (error.message?.includes('User not found') || error.message?.includes('not registered')) {
        setError('Registration issue detected. Please try refreshing the page or re-registering.');
      } else {
        setError(`Withdrawal failed: ${error.message || 'Unknown error occurred'}`);
      }
    } finally {
      setIsLoading(false);
      onComplete?.();
    }
  };

  if (!wallet.isConnected) {
    return (
      <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3 }, background: 'linear-gradient(135deg, #f0f4ff 0%, #d9e4ff 100%)', minHeight: '100vh' }}>
        <Alert severity="warning">Please connect your wallet to view the dashboard.</Alert>
      </Container>
    );
  }

  if (isLoading && !mlmData.totalInvestment) {
    return (
      <Container
        maxWidth="xl"
        sx={{ py: { xs: 2, sm: 3 }, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: 'linear-gradient(135deg, #f0f4ff 0%, #d9e4ff 100%)' }}
      >
        <CircularProgress />
      </Container>
    );
  }

  const registrationAlert = notRegistered ? (
    showReferralInput ? (
      <Alert
        severity="info"
        sx={{ mb: 2 }}
        action={
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <TextField
              size="small"
              label="Referral Address (optional)"
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value)}
              sx={{ minWidth: 200 }}
            />
            <Button
              color="inherit"
              size="small"
              startIcon={<PersonAddIcon />}
              onClick={handleRegister}
              disabled={isLoading}
            >
              Register
            </Button>
            <Button
              color="inherit"
              size="small"
              onClick={() => setShowReferralInput(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </Box>
        }
      >
        Enter a referral address if you have one, or leave blank to use the default.
      </Alert>
    ) : (
      <Alert
        severity="info"
        sx={{ mb: 2 }}
        action={
          <Button
            color="inherit"
            size="small"
            startIcon={<PersonAddIcon />}
            onClick={() => setShowReferralInput(true)}
            disabled={isLoading}
          >
            Register Now
          </Button>
        }
      >
        You need to register to participate in the system. Click "Register Now" to enter a referral address (optional).
      </Alert>
    )
  ) : null;

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3 }, background: 'linear-gradient(135deg, #f0f4ff 0%, #d9e4ff 100%)', minHeight: '100vh' }}>
      {registrationAlert}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      <Box
        sx={{
          mb: { xs: 2, sm: 4 },
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'stretch', sm: 'center' },
          gap: 2,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            gutterBottom
            sx={{ color: 'primary.main', fontWeight: 'bold', fontSize: { xs: '1.5rem', sm: '2rem' } }}
          >
            Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
            Monitor your team performance and manage your package investments
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, width: { xs: '100%', sm: 'auto' } }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchMlmData}
            disabled={isLoading}
            sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12} md={8} sx={{ order: { xs: 2, md: 1 } }}>
          <PerformanceOverview
            mlmData={mlmData}
            stakes={stakes}
            notRegistered={notRegistered}
            handleWithdrawStake={handleWithdrawStake}
            isLoading={isLoading}
          />
        </Grid>
        <Grid item xs={12} md={4} sx={{ order: { xs: 1, md: 2 } }}>
          <PackagePurchase
            notRegistered={notRegistered}
            packages={packages}
            packageDetails={packageDetails}
            isLoading={isLoading}
            setError={setError}
            setSuccess={setSuccess}
            setIsLoading={setIsLoading}
            wallet={wallet}
            chainId={chainId}
            switchChain={switchChain}
            fetchMlmData={fetchMlmData}
            stakes={stakes}
            handleWithdrawStake={handleWithdrawStake}
          />
          <ReferralSection wallet={wallet} setSuccess={setSuccess} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
