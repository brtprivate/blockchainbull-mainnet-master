import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Stack,
  Alert,
  IconButton,
  Tooltip,
  Chip,
} from '@mui/material';
import {
  ContentCopy,
  Share,
  Edit,
  Save,
  Cancel,
  Link as LinkIcon,
} from '@mui/icons-material';
import { useWallet } from '../../context/WalletContext';

const ReferralLinkManager: React.FC = () => {
  const wallet = useWallet();
  const [customSlug, setCustomSlug] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  // Generate referral link
  const generateReferralLink = (slug?: string) => {
    const baseUrl = `${window.location.origin}/usd/mlm/register`;
    if (slug && slug.trim()) {
      return `${baseUrl}?ref=${wallet.account}&slug=${encodeURIComponent(slug.trim())}`;
    }
    return `${baseUrl}?ref=${wallet.account}`;
  };

  const defaultReferralLink = generateReferralLink();
  const customReferralLink = customSlug ? generateReferralLink(customSlug) : defaultReferralLink;

  // Copy to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  // Share referral link
  const shareReferralLink = (link: string) => {
    if (navigator.share) {
      navigator.share({
        title: 'Join safemint MLM Platform',
        text: 'Join me on bdc - the amazing MLM investment platform!',
        url: link,
      }).then(() => {
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 3000);
      });
    } else {
      copyToClipboard(link);
    }
  };

  // Save custom slug
  const saveCustomSlug = () => {
    // Here you could save to localStorage or backend
    localStorage.setItem(`referral_slug_${wallet.account}`, customSlug);
    setIsEditing(false);
  };

  // Load saved slug on component mount
  React.useEffect(() => {
    if (wallet.account) {
      const savedSlug = localStorage.getItem(`referral_slug_${wallet.account}`);
      if (savedSlug) {
        setCustomSlug(savedSlug);
      }
    }
  }, [wallet.account]);

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{
        fontWeight: 'bold',
        color: '#ffffff',
        mb: 3,
        display: 'flex',
        alignItems: 'center',
        gap: 1
      }}>
        <LinkIcon sx={{ color: '#ff9800' }} />
        Referral Link Manager
      </Typography>

      {/* Success Alerts */}
      {copied && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Referral link copied to clipboard!
        </Alert>
      )}
      
      {shareSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Referral link shared successfully!
        </Alert>
      )}

      {/* Default Referral Link */}
      <Card sx={{
        background: '#1e1e1e',
        border: '1px solid #333',
        mb: 3,
      }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ color: '#ffffff', display: 'flex', alignItems: 'center', gap: 1 }}>
            <LinkIcon sx={{ color: '#4caf50' }} />
            Default Referral Link
          </Typography>
          
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            p: 2,
            bgcolor: '#2d2d2d',
            borderRadius: 2,
            border: '1px solid #444',
            mb: 2
          }}>
            <Typography
              variant="body2"
              sx={{
                flex: 1,
                color: '#ffffff',
                fontFamily: 'monospace',
                fontSize: '0.9rem',
                wordBreak: 'break-all'
              }}
            >
              {defaultReferralLink}
            </Typography>
            
            <Tooltip title="Copy Link">
              <IconButton
                onClick={() => copyToClipboard(defaultReferralLink)}
                sx={{ color: '#4caf50' }}
              >
                <ContentCopy />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Share Link">
              <IconButton
                onClick={() => shareReferralLink(defaultReferralLink)}
                sx={{ color: '#2196f3' }}
              >
                <Share />
              </IconButton>
            </Tooltip>
          </Box>

          <Stack direction="row" spacing={1} flexWrap="wrap">
            <Button
              variant="contained"
              startIcon={<ContentCopy />}
              onClick={() => copyToClipboard(defaultReferralLink)}
              sx={{
                bgcolor: '#4caf50',
                '&:hover': { bgcolor: '#45a049' }
              }}
            >
              Copy Link
            </Button>
            
            <Button
              variant="outlined"
              startIcon={<Share />}
              onClick={() => shareReferralLink(defaultReferralLink)}
              sx={{
                borderColor: '#2196f3',
                color: '#2196f3',
                '&:hover': { borderColor: '#1976d2', bgcolor: 'rgba(33, 150, 243, 0.1)' }
              }}
            >
              Share
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {/* Custom Referral Link */}
      <Card sx={{
        background: '#1e1e1e',
        border: '1px solid #333',
      }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ color: '#ffffff', display: 'flex', alignItems: 'center', gap: 1 }}>
            <Edit sx={{ color: '#ff9800' }} />
            Custom Referral Link
            <Chip
              label="Premium"
              size="small"
              sx={{
                bgcolor: '#ff9800',
                color: 'white',
                fontWeight: 'bold'
              }}
            />
          </Typography>

          <Typography variant="body2" sx={{ color: '#b0b0b0', mb: 2 }}>
            Create a personalized referral link with your custom identifier
          </Typography>

          {/* Custom Slug Input */}
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              label="Custom Identifier"
              value={customSlug}
              onChange={(e) => setCustomSlug(e.target.value)}
              disabled={!isEditing}
              placeholder="e.g., your-name, team-leader, crypto-expert"
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: '#2d2d2d',
                  '& fieldset': { borderColor: '#444' },
                  '&:hover fieldset': { borderColor: '#666' },
                  '&.Mui-focused fieldset': { borderColor: '#ff9800' },
                },
                '& .MuiInputLabel-root': { color: '#b0b0b0' },
                '& .MuiInputBase-input': { color: '#ffffff' },
              }}
            />
          </Box>

          {/* Custom Link Preview */}
          {customSlug && (
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              p: 2,
              bgcolor: '#2d2d2d',
              borderRadius: 2,
              border: '1px solid #444',
              mb: 2
            }}>
              <Typography
                variant="body2"
                sx={{
                  flex: 1,
                  color: '#ffffff',
                  fontFamily: 'monospace',
                  fontSize: '0.9rem',
                  wordBreak: 'break-all'
                }}
              >
                {customReferralLink}
              </Typography>
              
              <Tooltip title="Copy Custom Link">
                <IconButton
                  onClick={() => copyToClipboard(customReferralLink)}
                  sx={{ color: '#4caf50' }}
                >
                  <ContentCopy />
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Share Custom Link">
                <IconButton
                  onClick={() => shareReferralLink(customReferralLink)}
                  sx={{ color: '#2196f3' }}
                >
                  <Share />
                </IconButton>
              </Tooltip>
            </Box>
          )}

          {/* Action Buttons */}
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {!isEditing ? (
              <Button
                variant="outlined"
                startIcon={<Edit />}
                onClick={() => setIsEditing(true)}
                sx={{
                  borderColor: '#ff9800',
                  color: '#ff9800',
                  '&:hover': { borderColor: '#f57c00', bgcolor: 'rgba(255, 152, 0, 0.1)' }
                }}
              >
                Edit Custom Link
              </Button>
            ) : (
              <>
                <Button
                  variant="contained"
                  startIcon={<Save />}
                  onClick={saveCustomSlug}
                  sx={{
                    bgcolor: '#4caf50',
                    '&:hover': { bgcolor: '#45a049' }
                  }}
                >
                  Save
                </Button>
                
                <Button
                  variant="outlined"
                  startIcon={<Cancel />}
                  onClick={() => {
                    setIsEditing(false);
                    // Reset to saved value
                    const savedSlug = localStorage.getItem(`referral_slug_${wallet.account}`);
                    setCustomSlug(savedSlug || '');
                  }}
                  sx={{
                    borderColor: '#f44336',
                    color: '#f44336',
                    '&:hover': { borderColor: '#d32f2f', bgcolor: 'rgba(244, 67, 54, 0.1)' }
                  }}
                >
                  Cancel
                </Button>
              </>
            )}
            
            {customSlug && !isEditing && (
              <>
                <Button
                  variant="contained"
                  startIcon={<ContentCopy />}
                  onClick={() => copyToClipboard(customReferralLink)}
                  sx={{
                    bgcolor: '#4caf50',
                    '&:hover': { bgcolor: '#45a049' }
                  }}
                >
                  Copy Custom Link
                </Button>
                
                <Button
                  variant="outlined"
                  startIcon={<Share />}
                  onClick={() => shareReferralLink(customReferralLink)}
                  sx={{
                    borderColor: '#2196f3',
                    color: '#2196f3',
                    '&:hover': { borderColor: '#1976d2', bgcolor: 'rgba(33, 150, 243, 0.1)' }
                  }}
                >
                  Share Custom
                </Button>
              </>
            )}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ReferralLinkManager;
