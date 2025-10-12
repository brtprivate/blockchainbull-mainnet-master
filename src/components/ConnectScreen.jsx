import React from 'react';
import {
  Container,
  Box,
  Typography,
  Card,
  Fade,
} from '@mui/material';
import Web3ModalConnectButton from './Web3ModalConnectButton';


const ConnectScreen = ({ onRegisterClick, onBackToHome }) => {
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
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 20% 80%, rgba(184,146,80,0.1) 0%, transparent 50%)',
          pointerEvents: 'none',
        },
      }}
    >
      <Fade in={true} timeout={600}>
        <Card
          sx={{
            p: { xs: 3, md: 5 },
            boxShadow: 8,
            borderRadius: 4,
            mx: 'auto',
            maxWidth: { xs: '90%', sm: 'sm' },
            backgroundColor: 'rgba(10, 60, 46, 0.95)',
            color: '#ffffff',
            border: '2px solid #b89250',
            backdropFilter: 'blur(10px)',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box
              component="img"
              src="/safemint-logo.png"
              alt="SafeMint Logo"
              sx={{
                width: { xs: 120, sm: 150 },
                height: 'auto',
                mb: 3,
                filter: 'drop-shadow(0 4px 8px rgba(184, 146, 80, 0.4))',
                borderRadius: '50%',
                border: '2px solid #b89250',
              }}
            />
            <Typography
              variant="h3"
              sx={{
                fontWeight: 'bold',
                color: '#b89250',
                mb: 1,
                fontSize: { xs: '2.2rem', sm: '2.8rem' },
                textShadow: '0 2px 4px rgba(0,0,0,0.7)',
                letterSpacing: '1px',
              }}
            >
              Welcome to Block Chain Bull
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: '#ffffff',
                mb: 4,
                fontSize: { xs: '1.1rem', sm: '1.3rem' },
                opacity: 0.95,
                lineHeight: 1.4,
              }}
            >
              Securely connect your wallet to unlock the full potential of our blockchain platform
            </Typography>
          </Box>

          <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
            <Web3ModalConnectButton label="🌟 Connect & Earn" />
          </Box>

          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography
              variant="body2"
              sx={{
                color: '#b89250',
                fontStyle: 'italic',
                opacity: 0.85,
                fontSize: '0.95rem',
              }}
            >
              Powered by Secure Blockchain Technology
            </Typography>
          </Box>

          <Box sx={{ textAlign: 'center', mt: 3, pt: 2, borderTop: '1px solid rgba(184,146,80,0.2)' }}>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
              Your assets are protected with enterprise-grade security
            </Typography>
          </Box>
        </Card>
      </Fade>
    </Container>
  );
};

export default ConnectScreen;
