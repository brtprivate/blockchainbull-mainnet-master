import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  Divider,
} from '@mui/material';
import { useWallet } from '../../context/WalletContext';

const WithdrawFunds: React.FC = () => {
  const wallet = useWallet();

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#ffffff' }}>
        💰 Withdraw Funds
      </Typography>

      <Typography variant="body1" sx={{ color: '#b0b0b0', mb: 4 }}>
        Withdraw your earned rewards to your wallet. Minimum withdrawal amount is 1 USDT.
      </Typography>

      <Card sx={{ background: '#1e1e1e', border: '1px solid #333', p: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#ffffff' }}>
            ⚠️ Service Temporarily Unavailable
          </Typography>
          
          <Divider sx={{ mb: 3, borderColor: '#333' }} />
          
          <Alert severity="warning" sx={{ mb: 3 }}>
            <Typography variant="body2">
              The withdrawal functionality is currently undergoing maintenance. 
              Please check back later or contact support for assistance.
            </Typography>
          </Alert>

          <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
            <strong>Connected Wallet:</strong> {wallet.account ? `${wallet.account.slice(0, 10)}...${wallet.account.slice(-8)}` : 'Not Connected'}
          </Typography>
          
          <Typography variant="body2" sx={{ color: '#b0b0b0', mt: 2 }}>
            <strong>Available Balance:</strong> 0 USDT
          </Typography>
          
          <Typography variant="body2" sx={{ color: '#b0b0b0', mt: 1 }}>
            <strong>Minimum Withdrawal:</strong> 1 USDT
          </Typography>

          <Button
            variant="contained"
            size="large"
            disabled
            sx={{
              mt: 3,
              backgroundColor: '#666',
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 'bold',
              '&:hover': {
                backgroundColor: '#666',
              }
            }}
          >
            Service Unavailable
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default WithdrawFunds;
