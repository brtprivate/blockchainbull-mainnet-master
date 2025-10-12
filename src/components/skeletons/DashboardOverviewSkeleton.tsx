import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Paper,
  Stack,
  IconButton,
  Skeleton,
  Button,
  Typography,
} from '@mui/material';
import { Refresh, AccountBalanceWallet, PersonAdd } from '@mui/icons-material';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useWallet } from '../../context/WalletContext';
import { useMLM } from '../../context/MLMContext';
import { useNavigate } from 'react-router-dom';
import CardSkeleton from './CardSkeleton';

const DashboardOverviewSkeleton: React.FC = () => {
  const { open } = useWeb3Modal();
  const wallet = useWallet();
  const mlm = useMLM();
  const navigate = useNavigate();

  return (
    <Box>
      {/* Add CSS animation for pulse effect */}
      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7); }
            70% { transform: scale(1.02); box-shadow: 0 0 0 10px rgba(76, 175, 80, 0); }
            100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(76, 175, 80, 0); }
          }
        `}
      </style>
        {/* Welcome Header Skeleton */}
        <Box sx={{
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
          borderRadius: 3,
          p: 4,
          mb: 4,
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          border: '1px solid #333',
        }}>
          {/* Subtle Background Elements */}
          <Box sx={{
            position: 'absolute',
            top: -30,
            right: -30,
            width: 120,
            height: 120,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.02)',
          }} />
          <Box sx={{
            position: 'absolute',
            bottom: -20,
            left: -20,
            width: 100,
            height: 100,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.01)',
          }} />

          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4, alignItems: 'center', position: 'relative', zIndex: 1 }}>
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" width={300} height={48} sx={{ bgcolor: '#333', mb: 2 }} />
              <Skeleton variant="text" width={400} height={24} sx={{ bgcolor: '#333', mb: 3 }} />

              <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ mb: 3 }}>
                <Skeleton variant="rectangular" width={120} height={32} sx={{ bgcolor: '#333', borderRadius: 2 }} />
                <Skeleton variant="rectangular" width={140} height={32} sx={{ bgcolor: '#333', borderRadius: 2 }} />
                <Skeleton variant="rectangular" width={100} height={32} sx={{ bgcolor: '#333', borderRadius: 2 }} />
              </Stack>

              <Skeleton variant="text" width={250} height={16} sx={{ bgcolor: '#333' }} />
            </Box>
            
            <Box sx={{ minWidth: 300 }}>
              <Paper sx={{
                p: 3,
                background: '#1e1e1e',
                borderRadius: 3,
                textAlign: 'center',
                border: '1px solid #333',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
              }}>
                <Skeleton variant="text" width={60} height={40} sx={{ bgcolor: '#333', mx: 'auto', mb: 1 }} />
                <Skeleton variant="text" width={120} height={32} sx={{ bgcolor: '#333', mx: 'auto', mb: 1 }} />
                <Skeleton variant="text" width={150} height={20} sx={{ bgcolor: '#333', mx: 'auto', mb: 3 }} />

                <Box sx={{
                  display: 'flex',
                  justifyContent: 'space-around',
                  pt: 2,
                  borderTop: '1px solid #333'
                }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Skeleton variant="text" width={30} height={24} sx={{ bgcolor: '#333', mx: 'auto' }} />
                    <Skeleton variant="text" width={70} height={16} sx={{ bgcolor: '#333', mx: 'auto' }} />
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Skeleton variant="text" width={40} height={24} sx={{ bgcolor: '#333', mx: 'auto' }} />
                    <Skeleton variant="text" width={50} height={16} sx={{ bgcolor: '#333', mx: 'auto' }} />
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Skeleton variant="text" width={50} height={24} sx={{ bgcolor: '#333', mx: 'auto' }} />
                    <Skeleton variant="text" width={60} height={16} sx={{ bgcolor: '#333', mx: 'auto' }} />
                  </Box>
                </Box>
              </Paper>
            </Box>
          </Box>

          {/* Refresh Button */}
          <IconButton
            disabled
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              bgcolor: '#333',
              color: '#555',
              border: '1px solid #555',
            }}
          >
            <Refresh />
          </IconButton>
        </Box>

        {/* Real-time Stats Cards Skeleton */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
          <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '1 1 calc(25% - 18px)' } }}>
            <CardSkeleton variant="stats" />
          </Box>

          <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '1 1 calc(25% - 18px)' } }}>
            <CardSkeleton variant="stats" />
          </Box>

          <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '1 1 calc(25% - 18px)' } }}>
            <CardSkeleton variant="stats" />
          </Box>

          <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '1 1 calc(25% - 18px)' } }}>
            <CardSkeleton variant="stats" />
          </Box>
        </Box>

        {/* Quick Actions Section Skeleton */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mb: 4 }}>
          <Box sx={{ flex: 2 }}>
            <Card sx={{
              height: '100%',
              background: '#1e1e1e',
              border: '1px solid #333',
            }}>
              <CardContent sx={{ p: 3 }}>
                <Skeleton variant="text" width={150} height={32} sx={{ bgcolor: '#333', mb: 3 }} />
                
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                  <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)' } }}>
                    <CardSkeleton variant="action" height={140} />
                  </Box>

                  <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)' } }}>
                    <CardSkeleton variant="action" height={140} />
                  </Box>

                  <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)' } }}>
                    <CardSkeleton variant="action" height={140} />
                  </Box>

                  <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)' } }}>
                    <CardSkeleton variant="action" height={140} />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>

          <Box sx={{ flex: 1 }}>
            <Stack spacing={3}>
              {/* Account Information Skeleton */}
              <Card sx={{
                background: '#1e1e1e',
                border: '1px solid #333',
                borderRadius: 3,
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Skeleton variant="text" width={140} height={24} sx={{ bgcolor: '#333', mb: 3 }} />

                  <Stack spacing={3}>
                    <Box sx={{
                      p: 2,
                      borderRadius: 2,
                      background: '#333',
                      border: '1px solid #555'
                    }}>
                      <Skeleton variant="text" width={100} height={16} sx={{ bgcolor: '#555', mb: 1 }} />
                      <Skeleton variant="text" width={200} height={20} sx={{ bgcolor: '#555' }} />
                    </Box>

                    <Box sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      p: 2,
                      borderRadius: 2,
                      background: '#333',
                      border: '1px solid #555'
                    }}>
                      <Box>
                        <Skeleton variant="text" width={100} height={16} sx={{ bgcolor: '#555' }} />
                        <Skeleton variant="text" width={120} height={20} sx={{ bgcolor: '#555' }} />
                      </Box>
                      <Skeleton variant="rectangular" width={60} height={24} sx={{ bgcolor: '#555', borderRadius: 2 }} />
                    </Box>

                    {/* Connect Wallet Card */}
                    {!wallet.isConnected && (
                      <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        p: 3,
                        borderRadius: 2,
                        background: 'linear-gradient(45deg, #ff9800, #f57c00)',
                        border: '1px solid #ff9800',
                        textAlign: 'center'
                      }}>
                        <AccountBalanceWallet sx={{ fontSize: 40, color: 'white', mb: 1 }} />
                        <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', mb: 1 }}>
                          Connect Your Wallet
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)', mb: 2 }}>
                          Connect to access the MLM platform
                        </Typography>
                        <Button
                          variant="contained"
                          sx={{
                            bgcolor: 'rgba(255,255,255,0.9)',
                            color: '#f57c00',
                            fontWeight: 'bold',
                            '&:hover': {
                              bgcolor: 'white',
                            }
                          }}
                          onClick={() => open()}
                        >
                          Connect Wallet
                        </Button>
                      </Box>
                    )}

                    {/* Register Card - Show when connected but not registered */}
                    {wallet.isConnected && !mlm.isMLMRegistered && (
                      <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        p: 3,
                        borderRadius: 2,
                        background: 'linear-gradient(45deg, #4caf50, #388e3c)',
                        border: '2px solid #4caf50',
                        textAlign: 'center',
                        animation: 'pulse 2s infinite'
                      }}>
                        <PersonAdd sx={{ fontSize: 40, color: 'white', mb: 1 }} />
                        <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', mb: 1 }}>
                          🎉 Join MLM Platform
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)', mb: 2 }}>
                          Complete your registration to start earning
                        </Typography>
                        <Button
                          variant="contained"
                          sx={{
                            bgcolor: 'rgba(255,255,255,0.9)',
                            color: '#388e3c',
                            fontWeight: 'bold',
                            '&:hover': {
                              bgcolor: 'white',
                            }
                          }}
                          onClick={() => navigate('/usd/mlm/register')}
                        >
                          Register Now
                        </Button>
                      </Box>
                    )}
                  </Stack>
                </CardContent>
              </Card>

              {/* Performance Metrics Skeleton */}
              <Card sx={{
                background: '#1e1e1e',
                border: '1px solid #333',
                borderRadius: 3,
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
                height: 100,
              }}>
                <CardContent>
                  <Skeleton variant="text" width={150} height={24} sx={{ bgcolor: '#333' }} />
                </CardContent>
              </Card>
            </Stack>
          </Box>
        </Box>
      </Box>
  );
};

export default DashboardOverviewSkeleton;
