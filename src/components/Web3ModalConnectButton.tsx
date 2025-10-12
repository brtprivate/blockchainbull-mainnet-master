import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useAccount, useDisconnect } from 'wagmi';
import { Button, Stack } from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import LogoutIcon from '@mui/icons-material/Logout';

const Web3ModalConnectButton = ({ label = 'Connect Wallet' }) => {
  const { open } = useWeb3Modal();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  const truncated = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : label;

  if (isConnected) {
    return (
      <Stack direction="row" spacing={1} alignItems="center">
        <Button
          variant="outlined"
          onClick={() => open()}
          startIcon={<AccountBalanceWalletIcon />}
          sx={{
            borderRadius: 3,
            textTransform: 'none',
            fontFamily: 'monospace',
            fontSize: '0.9rem',
            color: '#ffd700',
            borderColor: '#ffd700',
            '&:hover': {
              backgroundColor: '#ffd700',
              color: '#0d2818'
            }
          }}
        >
          {truncated}
        </Button>
        <Button
          variant="outlined"
          onClick={() => {
            disconnect();
            // Clear cached data
            localStorage.removeItem('wagmi.store');
            localStorage.removeItem('wagmi.cache');
          }}
          startIcon={<LogoutIcon />}
          sx={{
            borderRadius: 3,
            color: '#ff6b6b',
            borderColor: '#ff6b6b',
            '&:hover': {
              backgroundColor: '#ff6b6b',
              color: '#ffffff'
            }
          }}
        >
          Disconnect
        </Button>
      </Stack>
    );
  }

  return (
    <Button
      variant="contained"
      size="large"
      onClick={() => open()}
      startIcon={<AccountBalanceWalletIcon />}
      sx={{
        py: 1.5,
        px: 4,
        fontSize: '1.1rem',
        fontWeight: 'bold',
        borderRadius: 3,
        backgroundColor: '#0d2818',
        color: '#ffd700',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
        '&:hover': {
          backgroundColor: '#1e3a2e',
          boxShadow: '0 6px 25px rgba(0, 0, 0, 0.4)',
          transform: 'translateY(-2px)'
        },
        transition: 'all 0.3s ease'
      }}
    >
      {label}
    </Button>
  );
};

export default Web3ModalConnectButton;
