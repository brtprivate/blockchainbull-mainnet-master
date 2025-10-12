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
import ConnectScreen from '../components/ConnectScreen';
import RegisterScreen from '../components/RegisterScreen';
import Footer from '../components/Footer';
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
  const [registerError, setRegisterError] = useState('');
  const [forceRegistered, setForceRegistered] = useState(false);
  const { mlmData, stakes, fetchMlmData, notRegistered } = useMLMData(wallet, chainId, switchChain, setError, setIsLoading);
  const { packageDetails, packages } = usePackageDetails();

  // ============================
  // Register user
  // ============================
  const handleRegister = async () => {
    setRegisterError('');
    if (!wallet.isConnected || !wallet.account) {
      setError('Please connect your wallet to register.');
      return;
    }

    if (!referralCode.trim()) {
      setRegisterError('Referral address is required.');
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

      const registerTx = await dwcContractInteractions.registration(referralCode.trim(), wallet.account);

      await waitForTransactionReceipt(config, { 
        hash: registerTx, 
        chainId: MAINNET_CHAIN_ID,
        confirmations: 2 
      });

      setSuccess(`Registration successful! Transaction: ${registerTx}`);
      setReferralCode('');
      setForceRegistered(true);
      setTimeout(() => fetchMlmData(), 1000);
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

  // ============================
  // Withdraw Stake
  // ============================
  const handleWithdrawStake = async (index) => {
    if (!wallet.isConnected || !wallet.account) {
      setError('Please connect your wallet to withdraw.');
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

      const stakeToWithdraw = stakes.find((s) => s.index === index);

      if (!stakeToWithdraw) {
        setError('Stake not found. Please refresh and try again.');
        return;
      }

      if (stakeToWithdraw.claimable <= 0) {
        setError('No rewards available to claim for this stake.');
        return;
      }

      setSuccess(`Initiating withdrawal of ${stakeToWithdraw.claimable.toFixed(4)} USDT...`);

      const txHash = await dwcContractInteractions.withdraw(BigInt(index), wallet.account);

      setSuccess('Transaction submitted! Waiting for confirmation...');
      await waitForTransactionReceipt(config, { 
        hash: txHash, 
        chainId: MAINNET_CHAIN_ID,
        confirmations: 2 
      });

      setSuccess(`Successfully withdrawn ${stakeToWithdraw.claimable.toFixed(4)} USDT! Transaction: ${txHash}`);

      setTimeout(() => fetchMlmData(), 1000);
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
    }
  };

  console.log('MLM Data:', mlmData);
  console.log('Stakes:', stakes);
  console.log('Not Registered:', notRegistered);
  // ============================
  // UI Renders
  // ============================
  if (!wallet.isConnected) {
    return (
      <ConnectScreen
        onRegisterClick={() => console.log('Connect wallet first to register')}
        onBackToHome={() => window.location.href = '/'}
      />
    );
  }

  if (isLoading && !mlmData.totalInvestment) {
    return (
      <Container
        maxWidth="xl"
        sx={{ py: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: 'linear-gradient(135deg, #051f1e 0%, #0a3c2e 100%)', color: '#b89250' }}
      >
        <CircularProgress sx={{ color: '#b89250' }} />
      </Container>
    );
  }

  if (notRegistered && !forceRegistered) {
    return (
      <RegisterScreen
        wallet={wallet}
        referralCode={referralCode}
        setReferralCode={setReferralCode}
        handleRegister={handleRegister}
        isLoading={isLoading}
        onBackToHome={() => window.location.href = '/'}
        errorMessage={registerError}
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
      {success && (
        <Alert severity="success" sx={{ mb: 2, backgroundColor: '#1a4d2e', color: '#4caf50', border: '1px solid #4caf50' }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" gutterBottom sx={{ color: '#b89250', fontWeight: 'bold' }}>
            Dashboard
          </Typography>
          <Typography variant="body1" sx={{ color: '#ffffff' }}>
            Monitor your team performance and manage your package investments
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={fetchMlmData}
          disabled={isLoading}
          sx={{ color: '#b89250', borderColor: '#b89250', '&:hover': { backgroundColor: '#b89250', color: '#051f1e' } }}
        >
          Refresh
        </Button>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <PerformanceOverview
            mlmData={mlmData}
            stakes={stakes}
            notRegistered={notRegistered}
            handleWithdrawStake={handleWithdrawStake}
            isLoading={isLoading}
          />
        </Grid>
        <Grid item xs={12} md={4}>
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
          />
          <ReferralSection wallet={wallet} setSuccess={setSuccess} />
        </Grid>
      </Grid>
      <Footer />
    </Container>
  );
};

export default Dashboard;