import React from 'react';
import { Box, Typography, Container } from '@mui/material';

const Footer = () => {
  return (
    <Box
      sx={{
        backgroundColor: '#051f1e',
        color: '#b89250',
        py: { xs: 2, md: 3 },
        mt: 'auto',
        borderTop: '1px solid #0a3c2e',
      }}
    >
      <Container maxWidth="xl">
        <Typography
          variant="body2"
          align="center"
          sx={{
            fontSize: { xs: '0.875rem', md: '1rem' },
            color: '#b89250',
          }}
        >
          Block Chain Bull © 2024 | All rights reserved
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
