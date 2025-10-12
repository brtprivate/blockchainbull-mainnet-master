import React from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  TextField,
  Link,
  Card,
  Fade,
  Alert,
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const RegisterScreen = ({ wallet, referralCode, setReferralCode, handleRegister, isLoading, onBackToHome, errorMessage }) => {
  return (
    <Container
      maxWidth="sm"
      sx={{
        py: 4,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #051f1e 0%, #0a3c2e 100%)',
        color: '#ffffff',
      }}
    >
      <Fade in={true} timeout={600}>
        <Card
          sx={{
            p: { xs: 2, md: 4 },
            boxShadow: 4,
            borderRadius: 3,
            mx: 'auto',
            maxWidth: { xs: '90%', sm: 'sm' },
            backgroundColor: '#0a3c2e',
            color: '#ffffff',
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 'bold',
                color: '#b89250',
                mb: 2,
                fontSize: { xs: '2.5rem', sm: '3.5rem' },
                textShadow: '0 2px 4px rgba(0,0,0,0.5)',
              }}
            >
              Block Chain Bull
            </Typography>
            <Typography
              variant="h5"
              sx={{
                color: '#b89250',
                mb: 4,
                fontSize: { xs: '1.2rem', sm: '1.5rem' },
              }}
            >
              Register your Block Chain Bull Account
            </Typography>
          </Box>

          {/* Display Connected Wallet */}
          <Box sx={{ mb: 3, textAlign: 'center' }}>
            <Typography variant="body1" sx={{ color: '#ffffff', mb: 1 }}>
              Connected Wallet:
            </Typography>
            <TextField
              fullWidth
              value={wallet.account ? `${wallet.account.slice(0, 6)}...${wallet.account.slice(-4)}` : ''}
              InputProps={{ readOnly: true }}
              size="small"
              sx={{
                '& .MuiInputBase-input': { color: '#ffffff', textAlign: 'center' },
                '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#b89250' } },
                backgroundColor: '#0a3c2e',
              }}
            />
          </Box>

          {/* Referral Input */}
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label="Referral Address (required)"
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value)}
              required
              helperText="Enter a valid Ethereum address"
              size="small"
              sx={{
                '& .MuiInputLabel-root': { color: '#b89250' },
                '& .MuiInputBase-input': { color: '#ffffff' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#b89250' },
                  '&:hover fieldset': { borderColor: '#d4af37' },
                  '&.Mui-focused fieldset': { borderColor: '#d4af37', boxShadow: '0 0 0 2px rgba(184,146,80,0.2)' },
                },
                '& .MuiFormHelperText-root': { color: '#b89250' },
                backgroundColor: '#0a3c2e',
              }}
            />
            {errorMessage && (
              <Alert severity="error" sx={{ mt: 1, backgroundColor: '#4d1a1a', color: '#ff6b6b', border: '1px solid #ff6b6b' }}>
                {errorMessage}
              </Alert>
            )}
          </Box>

          <Box sx={{ mb: 3 }}>
            <Button
              variant="contained"
              fullWidth
              startIcon={<PersonAddIcon />}
              onClick={handleRegister}
              disabled={isLoading || !referralCode.trim()}
              sx={{
                backgroundColor: '#b89250',
                color: '#051f1e',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                transition: 'all 0.2s',
                '&:hover': {
                  backgroundColor: '#d4af37',
                  color: '#051f1e',
                  transform: 'scale(1.02)',
                },
                '&.Mui-disabled': {
                  backgroundColor: 'rgba(184, 146, 80, 0.3)',
                  color: 'rgba(5, 31, 30, 0.5)',
                },
              }}
            >
              REGISTER
            </Button>
          </Box>

          <Box sx={{ textAlign: 'center' }}>
            <Button
              variant="outlined"
              onClick={onBackToHome}
              sx={{
                color: '#b89250',
                borderColor: '#b89250',
                '&:hover': {
                  backgroundColor: '#b89250',
                  color: '#051f1e',
                },
              }}
            >
              Back to Home
            </Button>
          </Box>
        </Card>
      </Fade>
    </Container>
  );
};

export default RegisterScreen;
