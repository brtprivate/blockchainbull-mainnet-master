import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Chip,
  LinearProgress,
  Alert,
  Divider,
  Avatar,
  Stack,
} from '@mui/material';
import {
  TrendingUp,
  AccessTime,
  MonetizationOn,
  Diamond,
  Star,
  EmojiEvents,
  AccountBalanceWallet,
} from '@mui/icons-material';
// import { useInvestment } from '../../context/InvestmentContext';

const MyInvestments: React.FC = () => {


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
      case 0: return <Star sx={{ color: '#ff9800' }} />;
      case 1: return <AccountBalanceWallet sx={{ color: '#9e9e9e' }} />;
      case 2: return <EmojiEvents sx={{ color: '#ffc107' }} />;
      case 3: return <Diamond sx={{ color: '#9c27b0' }} />;
      default: return <Star />;
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

  // Format timestamp
  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) * 1000);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const handleClaimReward = async (index: number) => {
    try {
      // const success = await claimReward(index);

  
    } catch (error) {
      console.error('Claim failed:', error);
    }
  };




  return (

      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#ffffff' }}>
        💼 My Investments
      </Typography>

    
  )
}
export default MyInvestments