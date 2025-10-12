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
  People,
  TrendingUp,
  MonetizationOn,
  AccountTree,
  Star,
  EmojiEvents,
  Diamond,
  AccountBalanceWallet,
  Refresh,
  Groups,
} from '@mui/icons-material';
import { useMLM } from '../../context/MLMContext';
import { useWallet } from '../../context/WalletContext';

interface TeamMemberInvestment {
  address: string;
  totalInvestment: string;
  activePackages: number;
  totalEarned: string;
  joinDate: string;
  level: number;
  status: 'active' | 'inactive';
}

const TeamInvestments: React.FC = () => {
  const wallet = useWallet();
  const mlm = useMLM();
  const { packages } = useInvestment();

  const [directReferrals, setDirectReferrals] = useState<string[]>([]);
  const [teamInvestments, setTeamInvestments] = useState<TeamMemberInvestment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [teamStats, setTeamStats] = useState({
    totalTeamInvestment: '0',
    activeMembers: 0,
    totalMembers: 0,
    averageInvestment: '0',
  });

  // Package names and colors
  const packageNames = ['Starter', 'Silver', 'Gold', 'Diamond'];
  const packageColors = ['#FFA726', '#C0C0C0', '#FFD700', '#E1BEE7'];

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

  // Load team data
  const loadTeamData = async () => {
    if (!isConnected || !isCorrectNetwork) return;

    try {
      setIsLoading(true);
      
      // Get direct referrals
      const referrals = await getDirectReferrals();
      const referralArray = Array.from(referrals);
      setDirectReferrals(referralArray);

      // Generate mock team investment data (in real implementation, you'd fetch from contract)
      const mockTeamData: TeamMemberInvestment[] = referralArray.map((address, index) => {
        const randomInvestment = (Math.random() * 5000 + 100).toFixed(2);
        const randomEarned = (parseFloat(randomInvestment) * 0.1 * Math.random()).toFixed(2);
        const randomPackages = Math.floor(Math.random() * 3) + 1;
        
        return {
          address,
          totalInvestment: randomInvestment,
          activePackages: randomPackages,
          totalEarned: randomEarned,
          joinDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          level: 1, // Direct referrals are level 1
          status: Math.random() > 0.2 ? 'active' : 'inactive',
        };
      });

      setTeamInvestments(mockTeamData);

      // Calculate team stats
      const totalInvestment = mockTeamData.reduce((sum, member) => sum + parseFloat(member.totalInvestment), 0);
      const activeMembers = mockTeamData.filter(member => member.status === 'active').length;
      const averageInvestment = mockTeamData.length > 0 ? totalInvestment / mockTeamData.length : 0;

      setTeamStats({
        totalTeamInvestment: totalInvestment.toFixed(2),
        activeMembers,
        totalMembers: mockTeamData.length,
        averageInvestment: averageInvestment.toFixed(2),
      });

    } catch (error) {
      console.error('Error loading team data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTeamData();
  }, [isConnected, isCorrectNetwork]);

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getPackageIcon = (packageCount: number) => {
    if (packageCount >= 4) return <Diamond sx={{ color: '#E1BEE7' }} />;
    if (packageCount >= 3) return <EmojiEvents sx={{ color: '#FFD700' }} />;
    if (packageCount >= 2) return <AccountBalanceWallet sx={{ color: '#C0C0C0' }} />;
    return <Star sx={{ color: '#FFA726' }} />;
  };

  if (!wallet.isConnected || !wallet.isCorrectNetwork) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#FF9800' }}>
          Team Investments
        </Typography>
        <Alert severity="warning">
          Please connect your wallet and switch to BSC Testnet to view team investments.
        </Alert>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Box>
        <Typography variant="h5" gutterBottom>Loading Team Investment Data...</Typography>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#FF9800' }}>
          Team Investments
        </Typography>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={loadTeamData}
          sx={{ borderColor: '#FF9800', color: '#FF9800' }}
        >
          Refresh Data
        </Button>
      </Box>

    </Box>
  );
};

export default TeamInvestments;
