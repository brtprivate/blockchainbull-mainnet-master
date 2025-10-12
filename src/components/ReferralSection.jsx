import React from 'react';
import { Box, Button, Card, CardContent, TextField, Typography, Divider } from '@mui/material';

const ReferralSection = ({ wallet, setSuccess }) => {
  return (
    <Card sx={{ boxShadow: 3, borderRadius: 2, backgroundColor: '#051f1e', color: '#ffffff' }}>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Title */}
        <Typography
          variant="h6"
          sx={{ fontSize: { xs: '1rem', sm: '1.25rem' }, fontWeight: 600, color: '#b89250' }}
        >
          Your Referral Code
        </Typography>

        {/* Code Field */}
        <TextField
          fullWidth
          label="Referral Code"
          value={wallet.account || ''}
          InputProps={{ readOnly: true }}
          size="small"
          sx={{
            '& .MuiInputBase-input': { fontSize: { xs: '0.875rem', sm: '1rem' }, color: '#ffffff' },
            '& .MuiInputLabel-root': { color: '#b89250' },
            '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#b89250' } },
          }}
        />

        {/* Buttons */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
           variant="outlined"
            fullWidth
            onClick={() => {
              if (wallet.account) {
                navigator.clipboard.writeText(wallet.account);
                setSuccess('Referral code copied to clipboard!');
              }
            }}
            disabled={!wallet.account}
            sx={{ color: '#b89250', borderColor: '#b89250', fontSize: { xs: '0.75rem', sm: '0.875rem' }, '&:hover': { backgroundColor: '#b89250', color: '#051f1e' } }}
          >
            Copy
          </Button>
          <Button
            variant="outlined"
            fullWidth
            onClick={() => {
              if (wallet.account) {
                const shareText = `Join me on the platform! Use my referral code: ${wallet.account}`;
                if (navigator.share) {
                  navigator
                    .share({
                      title: 'Referral',
                      text: shareText,
                      url: window.location.origin,
                    })
                    .catch(() => {
                      navigator.clipboard.writeText(shareText);
                      setSuccess('Referral message copied to clipboard!');
                    });
                } else {
                  navigator.clipboard.writeText(shareText);
                  setSuccess('Referral message copied to clipboard!');
                }
              }
            }}
            disabled={!wallet.account}
            sx={{ color: '#b89250', borderColor: '#b89250', fontSize: { xs: '0.75rem', sm: '0.875rem' }, '&:hover': { backgroundColor: '#b89250', color: '#051f1e' } }}
          >
            Share
          </Button>
        </Box>

        <Divider sx={{ backgroundColor: '#ffd700' }} />

        {/* Info Text */}
        <Typography
          variant="body2"
          sx={{ color: '#ffffff', fontSize: { xs: '0.75rem', sm: '0.875rem' }, lineHeight: 1.6 }}
        >
          Share this code with your friends. You’ll earn referral bonuses when they join
          and purchase a package!
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ReferralSection;
