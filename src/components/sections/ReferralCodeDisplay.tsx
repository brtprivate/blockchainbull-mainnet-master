import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Alert,
  IconButton,
  Tooltip,
  Divider,
} from '@mui/material';
import {
  ContentCopy,
  Share,
  Link as LinkIcon,
  CheckCircle,
  Person,
  Group,
} from '@mui/icons-material';
import { OWNER_ADDRESS } from '../../config';
import { useMLM } from '../../context/MLMContext';
import { useWallet } from '../../context/WalletContext';

const ReferralCodeDisplay: React.FC = () => {
  const wallet = useWallet();
  const mlm = useMLM();
  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  // Generate referral link
  const referralLink = wallet.account
    ? `${window.location.origin}/usd/mlm/register?ref=${wallet.account}`
    : `${window.location.origin}/usd/mlm/register?ref=${OWNER_ADDRESS}`;

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(wallet.account || OWNER_ADDRESS);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy address:', error);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join USDStack Investment Platform',
          text: 'Join me on USDStack and start earning passive income!',
          url: referralLink,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#ffffff', mb: 3 }}>
        🔗 Referral System
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Default Referral Address - Featured */}
        <Box>
          <Card sx={{
            background: 'linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%)',
            border: '3px solid #ff9800',
            borderRadius: 3,
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(255, 152, 0, 0.2)',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '6px',
              background: 'linear-gradient(90deg, #ff9800, #ffb74d, #ff6f00, #ff9800)',
              animation: 'shimmer 2s infinite',
            }
          }}>
            <CardContent sx={{ p: 4 }}>
              <Box display="flex" alignItems="center" mb={3}>
                <Box
                  sx={{
                    bgcolor: '#ff9800',
                    borderRadius: '50%',
                    p: 1.5,
                    mr: 3,
                    boxShadow: '0 4px 16px rgba(255, 152, 0, 0.3)'
                  }}
                >
                  <Person sx={{ color: '#ffffff', fontSize: 32 }} />
                </Box>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#ffffff', mb: 0.5 }}>
                    🔗 Official USDStack Referral Address
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#ff9800', fontWeight: 'medium' }}>
                    Default referrer for all new registrations
                  </Typography>
                </Box>
              </Box>

              <Box sx={{
                bgcolor: '#0d1b2a',
                border: '2px solid #ff9800',
                borderRadius: 2,
                p: 2,
                mb: 3
              }}>
                <Typography variant="body2" sx={{ color: '#ff9800', mb: 1, fontWeight: 'bold' }}>
                  📋 Default Referral Code:
                </Typography>
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography
                    variant="body1"
                    sx={{
                      color: '#ffffff',
                      fontFamily: 'monospace',
                      bgcolor: '#1a1a1a',
                      p: 1.5,
                      borderRadius: 1,
                      flex: 1,
                      wordBreak: 'break-all',
                      border: '1px solid #333'
                    }}
                  >
                    {OWNER_ADDRESS}
                  </Typography>
                  <Tooltip title={copied ? "Copied!" : "Copy Default Address"}>
                    <IconButton
                      onClick={handleCopyAddress}
                      sx={{
                        color: '#ff9800',
                        bgcolor: '#2d2d2d',
                        border: '1px solid #ff9800',
                        '&:hover': {
                          bgcolor: '#ff9800',
                          color: '#ffffff'
                        }
                      }}
                    >
                      {copied ? <CheckCircle /> : <ContentCopy />}
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>

              <Alert
                severity="info"
                sx={{
                  bgcolor: '#1a3a3a',
                  color: '#4fc3f7',
                  border: '1px solid #4fc3f7',
                  '& .MuiAlert-icon': {
                    color: '#4fc3f7'
                  }
                }}
              >
                <Typography variant="body2">
                  <strong>Important:</strong> This address is automatically used when users register without a specific referral link.
                  All commissions from these registrations go to the USDStack platform.
                </Typography>
              </Alert>
            </CardContent>
          </Card>
        </Box>

        {/* Your Referral Code */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
          <Box sx={{ flex: 1 }}>
          <Card sx={{
            background: '#1e1e1e',
            border: mlm.isMLMRegistered ? '2px solid #4caf50' : '2px solid #666',
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
              background: mlm.isMLMRegistered
                ? 'linear-gradient(90deg, #4caf50, #81c784, #4caf50)'
                : 'linear-gradient(90deg, #666, #888, #666)',
            }
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" mb={2}>
                <Group sx={{ mr: 2, color: mlm.isMLMRegistered ? '#4caf50' : '#666', fontSize: 32 }} />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#ffffff' }}>
                    Your Referral Code
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                    {mlm.isMLMRegistered ? 'Share and earn commissions' : 'Register to get your code'}
                  </Typography>
                </Box>
              </Box>

              {mlm.isMLMRegistered && wallet.account ? (
                <>
                  <TextField
                    fullWidth
                    value={wallet.account}
                    // @ts-ignore - InputProps is deprecated but still functional
                    InputProps={{
                      readOnly: true,
                      endAdornment: (
                        <Tooltip title={copied ? "Copied!" : "Copy Your Code"}>
                          <IconButton onClick={handleCopyAddress} sx={{ color: '#4caf50' }}>
                            {copied ? <CheckCircle /> : <ContentCopy />}
                          </IconButton>
                        </Tooltip>
                      ),
                      sx: {
                        bgcolor: '#2d2d2d',
                        color: '#ffffff',
                        fontFamily: 'monospace',
                        '& fieldset': {
                          borderColor: '#555',
                        },
                      }
                    }}
                    sx={{ mb: 2 }}
                  />

                  <Box display="flex" gap={1} flexWrap="wrap">
                    <Button
                      variant="contained"
                      startIcon={<LinkIcon />}
                      onClick={handleCopyLink}
                      sx={{
                        bgcolor: '#4caf50',
                        '&:hover': { bgcolor: '#45a049' }
                      }}
                    >
                      {linkCopied ? 'Link Copied!' : 'Copy Link'}
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Share />}
                      onClick={handleShare}
                      sx={{
                        borderColor: '#4caf50',
                        color: '#4caf50',
                        '&:hover': { borderColor: '#45a049', bgcolor: 'rgba(76, 175, 80, 0.1)' }
                      }}
                    >
                      Share
                    </Button>
                  </Box>
                </>
              ) : (
                <Alert severity="warning" sx={{ bgcolor: '#3a2e1e', color: '#ff9800', border: '1px solid #ff9800' }}>
                  Please register for the platform to get your personal referral code.
                </Alert>
              )}
            </CardContent>
          </Card>
          </Box>
        </Box>

        {/* Referral Link Preview */}
        {mlm.isMLMRegistered && (
          <Box>
            <Card sx={{ background: '#1e1e1e', border: '1px solid #333' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#ffffff' }}>
                  📋 Your Referral Link
                </Typography>
                <Divider sx={{ mb: 2, borderColor: '#333' }} />

                <TextField
                  fullWidth
                  value={referralLink}
                  // @ts-ignore - InputProps is deprecated but still functional
                  InputProps={{
                    readOnly: true,
                    endAdornment: (
                      <Tooltip title={linkCopied ? "Copied!" : "Copy Referral Link"}>
                        <IconButton onClick={handleCopyLink} sx={{ color: '#4caf50' }}>
                          {linkCopied ? <CheckCircle /> : <ContentCopy />}
                        </IconButton>
                      </Tooltip>
                    ),
                    sx: {
                      bgcolor: '#2d2d2d',
                      color: '#ffffff',
                      '& fieldset': {
                        borderColor: '#555',
                      },
                    }
                  }}
                />

                <Typography variant="body2" sx={{ color: '#b0b0b0', mt: 1 }}>
                  Share this link with others to earn referral commissions when they join and invest.
                </Typography>
              </CardContent>
            </Card>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ReferralCodeDisplay;
