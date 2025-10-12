import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  TextField,
  useTheme,
  useMediaQuery,
  Fade,
  Zoom,
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  Grid
} from '@mui/material';
import { useThirdWebMLM } from '../context/ThirdWebMLMContext';
import MenuIcon from '@mui/icons-material/Menu';
import TelegramIcon from '@mui/icons-material/Telegram';
import TranslateIcon from '@mui/icons-material/Translate';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SecurityIcon from '@mui/icons-material/Security';
import GroupsIcon from '@mui/icons-material/Groups';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import DiamondIcon from '@mui/icons-material/Diamond';
import TimelineIcon from '@mui/icons-material/Timeline';


const TronSpider: React.FC = () => {
  const {
    isConnected: isThirdWebConnected
  } = useThirdWebMLM();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Animation states
  const [showContent, setShowContent] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Investment form states
  const [player1Amount, setPlayer1Amount] = useState<string>('');
  const [player2Amount, setPlayer2Amount] = useState<string>('');
  const [sptAmount, setSptAmount] = useState<string>('');

  // Dashboard states
  const [walletBalance] = useState<string>('0.00');
  const [totalInvested] = useState<string>('00000.00');
  const [totalReferralRewards] = useState<string>('00000.00');
  const [totalSptRewards] = useState<string>('00000.00');

  // Trigger animations after component mounts
  useEffect(() => {
    setTimeout(() => setShowContent(true), 300);
  }, []);

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleInvestment = (plan: string, amount: string) => {
    if (!isThirdWebConnected) {
      console.log('Please connect wallet first');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      console.log('Please enter a valid amount');
      return;
    }

    console.log(`Investing ${amount} TRX in ${plan}`);
  };

  const gradientBackground = {
    background: 'linear-gradient(135deg, #6200ea 0%, #3f51b5 25%, #2196f3 50%, #00bcd4 75%, #4caf50 100%)',
    minHeight: '100vh',
    position: 'relative' as const,
    overflow: 'hidden'
  };

  const sectionStyle = {
    py: { xs: 4, md: 8 },
    position: 'relative' as const,
    zIndex: 2
  };

  const cardStyle = {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    borderRadius: 4,
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
      transform: 'translateY(-8px)',
      boxShadow: '0 16px 48px rgba(0, 0, 0, 0.15)',
    }
  };

  return (
    <Box sx={gradientBackground}>
      {/* Custom Header */}
      <AppBar position="fixed" sx={{
        background: 'rgba(0, 0, 0, 0.9)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <DiamondIcon sx={{ color: '#00bcd4', fontSize: 32, mr: 2 }} />
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>
              TRON Spider
            </Typography>
          </Box>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Stack direction="row" spacing={3} sx={{ mr: 2 }}>
              <Button color="inherit" href="#dashboard">Dashboard</Button>
              <Button color="inherit" href="#defi">DEFI Token</Button>
              <Button color="inherit" href="#investment">Daily Dividends</Button>
              <Button color="inherit" href="#dex_exchange">DEX Exchange</Button>
            </Stack>
          )}

          {/* Social Links */}
          <Stack direction="row" spacing={1} alignItems="center">
            <IconButton color="inherit" href="http://tronspider.info/" target="_blank">
              <TelegramIcon />
            </IconButton>
            <IconButton color="inherit">
              <TranslateIcon />
            </IconButton>
            {isMobile && (
              <IconButton color="inherit" onClick={handleMobileMenuToggle}>
                <MenuIcon />
              </IconButton>
            )}
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Mobile Menu */}
      <Menu
        anchorEl={null}
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        sx={{ mt: 6 }}
      >
        <MenuItem onClick={() => setMobileMenuOpen(false)}>
          <Button href="#dashboard">Dashboard</Button>
        </MenuItem>
        <MenuItem onClick={() => setMobileMenuOpen(false)}>
          <Button href="#defi">DEFI Token</Button>
        </MenuItem>
        <MenuItem onClick={() => setMobileMenuOpen(false)}>
          <Button href="#investment">Daily Dividends</Button>
        </MenuItem>
        <MenuItem onClick={() => setMobileMenuOpen(false)}>
          <Button href="#dex_exchange">DEX Exchange</Button>
        </MenuItem>
      </Menu>

      {/* Hero Section */}
      <Box sx={{ ...sectionStyle, pt: { xs: 12, md: 16 } }} id="home_section">
        <Container maxWidth="lg">
          <Fade in={showContent} timeout={1000}>
            <Box sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: 'center',
              gap: 4
            }}>
              <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
                <Typography
                  variant="h2"
                  sx={{
                    color: 'white',
                    fontWeight: 700,
                    mb: 2,
                    fontSize: { xs: '2rem', md: '3rem' }
                  }}
                >
                  THE NEW GENERATION PLATFORM (<span style={{ color: '#00bcd4' }}>DeFI</span>)
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    mb: 4,
                    fontSize: { xs: '1.2rem', md: '1.5rem' }
                  }}
                >
                  The World First Sustainable ROI & DeFi Token Platform
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Button
                    variant="contained"
                    size="large"
                    href="http://tronspider.info/"
                    target="_blank"
                    sx={{
                      borderRadius: 8,
                      px: 4,
                      py: 1.5,
                      background: 'linear-gradient(45deg, #ff6b35 30%, #f7931e 90%)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #e55a2b 30%, #e8851a 90%)',
                      }
                    }}
                  >
                    Announcement
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    sx={{
                      borderRadius: 8,
                      px: 4,
                      py: 1.5,
                      borderColor: 'white',
                      color: 'white',
                      '&:hover': {
                        borderColor: '#00bcd4',
                        color: '#00bcd4',
                      }
                    }}
                  >
                    Contract(SCAN)
                  </Button>
                </Stack>
              </Box>
              <Box sx={{ flex: 1, textAlign: 'center' }}>
                <Zoom in={showContent} timeout={1000} style={{ transitionDelay: '500ms' }}>
                  <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: 300
                  }}>
                    <DiamondIcon sx={{
                      fontSize: 200,
                      color: '#00bcd4',
                      filter: 'drop-shadow(0 0 20px rgba(0, 188, 212, 0.5))'
                    }} />
                  </Box>
                </Zoom>
              </Box>
            </Box>
          </Fade>
        </Container>
      </Box>

      {/* Statistics Section */}
      <Box sx={sectionStyle}>
        <Container maxWidth="lg">
          <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 4,
            mb: 4
          }}>
            <Box sx={{ flex: 1 }}>
              <Fade in={showContent} timeout={1000} style={{ transitionDelay: '200ms' }}>
                <Card sx={cardStyle}>
                  <CardContent sx={{ textAlign: 'center', py: 3 }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#ff6b35', mb: 1 }}>
                      {totalInvested}
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: '#ff6b35' }}>
                      Total Invested TRX
                    </Typography>
                  </CardContent>
                </Card>
              </Fade>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Fade in={showContent} timeout={1000} style={{ transitionDelay: '400ms' }}>
                <Card sx={cardStyle}>
                  <CardContent sx={{ textAlign: 'center', py: 3 }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#00d2ee', mb: 1 }}>
                      {totalReferralRewards}
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: '#00d2ee' }}>
                      Total Referral Rewards
                    </Typography>
                  </CardContent>
                </Card>
              </Fade>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Fade in={showContent} timeout={1000} style={{ transitionDelay: '600ms' }}>
                <Card sx={cardStyle}>
                  <CardContent sx={{ textAlign: 'center', py: 3 }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#ff3557', mb: 1 }}>
                      {totalSptRewards}
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: '#ff3557' }}>
                      Total SPT Rewards Issued
                    </Typography>
                  </CardContent>
                </Card>
              </Fade>
            </Box>
          </Box>

          {/* Wallet Info */}
          <Fade in={showContent} timeout={1000} style={{ transitionDelay: '800ms' }}>
            <Box sx={{ mt: 4 }}>
              <Card sx={{ ...cardStyle, maxWidth: 600, mx: 'auto' }}>
                <CardContent sx={{ textAlign: 'center', py: 3 }}>
                  <Typography variant="body1" sx={{ fontWeight: 700, color: 'black', mb: 1 }}>
                    Your Wallet:
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 700, color: 'black' }}>
                    Your Wallet Balance: <span style={{ fontWeight: 900 }}>{walletBalance}</span> TRX
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          </Fade>
        </Container>
      </Box>

      {/* Investment Plans Section */}
      <Box sx={sectionStyle} id="investment">
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            sx={{
              color: 'white',
              fontWeight: 700,
              textAlign: 'center',
              mb: 6,
              fontSize: { xs: '2rem', md: '2.5rem' }
            }}
          >
            Investment Plans
          </Typography>

          <Grid container spacing={4}>
            {/* Player-1 Plan */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Zoom in={showContent} timeout={1000} style={{ transitionDelay: '200ms' }}>
                <Card sx={{
                  ...cardStyle,
                  background: 'linear-gradient(135deg, #a900d3 0%, #8e24aa 100%)',
                  color: 'white'
                }}>
                  <Box sx={{
                    background: 'rgba(169, 0, 211, 1)',
                    p: 2,
                    textAlign: 'center',
                    borderRadius: '16px 16px 0 0'
                  }}>
                    <img
                      src="/assets/DEMO-trx-logo.png"
                      alt="TRX Logo"
                      style={{ width: 70, height: 70, marginBottom: 8 }}
                    />
                    <Typography variant="h5" sx={{ fontWeight: 700, color: 'white' }}>
                      Player-1
                    </Typography>
                  </Box>
                  <CardContent sx={{ background: 'white', color: 'black', p: 3 }}>
                    <Typography variant="h3" sx={{
                      fontWeight: 700,
                      textAlign: 'center',
                      color: '#a900d3',
                      mb: 2
                    }}>
                      3%
                    </Typography>

                    <Stack spacing={1} sx={{ mb: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <img src="/final/1001.png" alt="check" style={{ width: 20, marginRight: 8 }} />
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          Dividends Every Second
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <img src="/final/1001.png" alt="check" style={{ width: 20, marginRight: 8 }} />
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          90 Days
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <img src="/final/1001.png" alt="check" style={{ width: 20, marginRight: 8 }} />
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          Total Return: 270%
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <img src="/final/1001.png" alt="check" style={{ width: 20, marginRight: 8 }} />
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          Reward 1TRX: 2 SPT
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <img src="/final/1001.png" alt="check" style={{ width: 20, marginRight: 8 }} />
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          Minimum Deposit 500 TRX
                        </Typography>
                      </Box>
                    </Stack>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <img
                        src="/assets/DEMO-trx-logo.png"
                        alt="TRX Logo"
                        style={{ width: 50, marginRight: 8 }}
                      />
                      <TextField
                        fullWidth
                        placeholder="Amount of TRX"
                        value={player1Amount}
                        onChange={(e) => setPlayer1Amount(e.target.value)}
                        type="number"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            backgroundColor: 'white',
                            '& input::placeholder': {
                              color: 'black',
                              fontWeight: 700
                            }
                          }
                        }}
                      />
                    </Box>

                    <Box sx={{ textAlign: 'center' }}>
                      <Button
                        variant="contained"
                        fullWidth
                        onClick={() => handleInvestment('Player-1', player1Amount)}
                        sx={{
                          background: 'darkblue',
                          borderRadius: 8,
                          py: 1.5,
                          fontWeight: 700,
                          '&:hover': {
                            background: '#000080'
                          }
                        }}
                      >
                        Invest Now
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Zoom>
            </Grid>

            {/* Player-2 Plan */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Zoom in={showContent} timeout={1000} style={{ transitionDelay: '400ms' }}>
                <Card sx={{
                  ...cardStyle,
                  background: 'linear-gradient(135deg, #a900d3 0%, #8e24aa 100%)',
                  color: 'white'
                }}>
                  <Box sx={{
                    background: 'rgba(169, 0, 211, 1)',
                    p: 2,
                    textAlign: 'center',
                    borderRadius: '16px 16px 0 0'
                  }}>
                    <img
                      src="/assets/DEMO-trx-logo.png"
                      alt="TRX Logo"
                      style={{ width: 70, height: 70, marginBottom: 8 }}
                    />
                    <Typography variant="h5" sx={{ fontWeight: 700, color: 'white' }}>
                      Player-2
                    </Typography>
                  </Box>
                  <CardContent sx={{ background: 'white', color: 'black', p: 3 }}>
                    <Typography variant="h3" sx={{
                      fontWeight: 700,
                      textAlign: 'center',
                      color: '#a900d3',
                      mb: 2
                    }}>
                      8%
                    </Typography>

                    <Stack spacing={1} sx={{ mb: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <img src="/final/1001.png" alt="check" style={{ width: 20, marginRight: 8 }} />
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          Dividends Every Second
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <img src="/final/1001.png" alt="check" style={{ width: 20, marginRight: 8 }} />
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          15 Days
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <img src="/final/1001.png" alt="check" style={{ width: 20, marginRight: 8 }} />
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          Total Return: 120%
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <img src="/final/1001.png" alt="check" style={{ width: 20, marginRight: 8 }} />
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          Reward 1TRX: 1 SPT
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <img src="/final/1001.png" alt="check" style={{ width: 20, marginRight: 8 }} />
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          Minimum Deposit 500 TRX
                        </Typography>
                      </Box>
                    </Stack>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <img
                        src="/assets/DEMO-trx-logo.png"
                        alt="TRX Logo"
                        style={{ width: 50, marginRight: 8 }}
                      />
                      <TextField
                        fullWidth
                        placeholder="Amount of TRX"
                        value={player2Amount}
                        onChange={(e) => setPlayer2Amount(e.target.value)}
                        type="number"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            backgroundColor: 'white',
                            '& input::placeholder': {
                              color: 'black',
                              fontWeight: 700
                            }
                          }
                        }}
                      />
                    </Box>

                    <Box sx={{ textAlign: 'center' }}>
                      <Button
                        variant="contained"
                        fullWidth
                        onClick={() => handleInvestment('Player-2', player2Amount)}
                        sx={{
                          background: 'darkblue',
                          borderRadius: 8,
                          py: 1.5,
                          fontWeight: 700,
                          '&:hover': {
                            background: '#000080'
                          }
                        }}
                      >
                        Invest Now
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Zoom>
            </Grid>

            {/* Spider Token Presale */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Zoom in={showContent} timeout={1000} style={{ transitionDelay: '600ms' }}>
                <Card sx={{
                  ...cardStyle,
                  background: 'linear-gradient(135deg, #a900d3 0%, #8e24aa 100%)',
                  color: 'white'
                }}>
                  <Box sx={{
                    background: 'rgba(169, 0, 211, 1)',
                    p: 2,
                    textAlign: 'center',
                    borderRadius: '16px 16px 0 0'
                  }}>
                    <img
                      src="/assets/DEMO-trx-logo.png"
                      alt="TRX Logo"
                      style={{ width: 70, height: 70, marginBottom: 8 }}
                    />
                    <Typography variant="h5" sx={{ fontWeight: 700, color: 'white' }}>
                      Spider Token Presale
                    </Typography>
                  </Box>
                  <CardContent sx={{ background: 'white', color: 'black', p: 3 }}>
                    <Typography variant="h4" sx={{
                      fontWeight: 700,
                      textAlign: 'center',
                      color: '#a900d3',
                      mb: 2
                    }}>
                      100 Million <span style={{ fontSize: '1.5rem' }}>SPT</span>
                    </Typography>

                    <Stack spacing={1} sx={{ mb: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <img src="/final/1001.png" alt="check" style={{ width: 20, marginRight: 8 }} />
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          Pre Sale Allocation: 35%
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <img src="/final/1001.png" alt="check" style={{ width: 20, marginRight: 8 }} />
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          Each Token Price: 1 TRX
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <img src="/final/1001.png" alt="check" style={{ width: 20, marginRight: 8 }} />
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          Minimum Buy: 10000 SPT
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <img src="/final/1001.png" alt="check" style={{ width: 20, marginRight: 8 }} />
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          Maximum Buy: 1,000,000 SPT
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <img src="/final/1001.png" alt="check" style={{ width: 20, marginRight: 8 }} />
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          Presale Date: Follow News
                        </Typography>
                      </Box>
                    </Stack>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <img
                        src="/assets/DEMO-trx-logo.png"
                        alt="TRX Logo"
                        style={{ width: 50, marginRight: 8 }}
                      />
                      <TextField
                        fullWidth
                        placeholder="Amount of SPT"
                        value={sptAmount}
                        onChange={(e) => setSptAmount(e.target.value)}
                        type="number"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            backgroundColor: 'white',
                            '& input::placeholder': {
                              color: 'black',
                              fontWeight: 700
                            }
                          }
                        }}
                      />
                    </Box>

                    <Box sx={{ textAlign: 'center' }}>
                      <Button
                        variant="contained"
                        fullWidth
                        href="http://DEMOspider.info/"
                        target="_blank"
                        sx={{
                          background: 'darkblue',
                          borderRadius: 8,
                          py: 1.5,
                          fontWeight: 700,
                          '&:hover': {
                            background: '#000080'
                          }
                        }}
                      >
                        BUY
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Zoom>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Dashboard Section */}
      <Box sx={sectionStyle} id="dashboard">
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            sx={{
              color: 'white',
              fontWeight: 700,
              textAlign: 'center',
              mb: 6,
              fontSize: { xs: '2rem', md: '2.5rem' }
            }}
          >
            Dashboard
          </Typography>

          <Grid container spacing={4}>
            {/* Dividends Section */}
            <Grid size={{ xs: 12, md: 5 }}>
              <Fade in={showContent} timeout={1000} style={{ transitionDelay: '200ms' }}>
                <Card sx={{
                  ...cardStyle,
                  background: 'linear-gradient(135deg, #23c1ff 0%, #1976d2 100%)',
                  borderRadius: 8
                }}>
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <MonetizationOnIcon sx={{ color: '#00007a', mr: 1, fontSize: 28 }} />
                      <Typography variant="h5" sx={{ fontWeight: 700, color: '#00007a' }}>
                        Dividends
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body1" sx={{ fontWeight: 500, color: '#00007a', mb: 1 }}>
                        Daily Dividends
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <TextField
                          placeholder="000.00"
                          fullWidth
                          sx={{ mr: 2 }}
                        />
                        <img
                          src="/assets/DEMO-trx-logo.png"
                          alt="TRX Logo"
                          style={{ width: 40, height: 40 }}
                        />
                      </Box>
                    </Box>

                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body1" sx={{ fontWeight: 500, color: '#00007a', mb: 1 }}>
                        Withdrawal Dividends
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <TextField
                          placeholder="000.00"
                          fullWidth
                          sx={{ mr: 2 }}
                        />
                        <img
                          src="/assets/DEMO-trx-logo.png"
                          alt="TRX Logo"
                          style={{ width: 40, height: 40 }}
                        />
                      </Box>
                      <Button
                        variant="contained"
                        sx={{
                          background: 'darkblue',
                          borderRadius: 8,
                          px: 4,
                          py: 1.5,
                          fontWeight: 700,
                          '&:hover': {
                            background: '#00007a'
                          }
                        }}
                      >
                        WITHDRAW
                      </Button>
                      <Typography variant="body2" sx={{ color: '#00007a', mt: 1 }}>
                        Transaction Fee: 3 TRX
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Fade>
            </Grid>

            {/* Referral Program Section */}
            <Grid size={{ xs: 12, md: 7 }}>
              <Fade in={showContent} timeout={1000} style={{ transitionDelay: '400ms' }}>
                <Card sx={{
                  ...cardStyle,
                  background: 'linear-gradient(135deg, #23c1ff 0%, #1976d2 100%)',
                  borderRadius: 8
                }}>
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <GroupsIcon sx={{ color: '#00007a', mr: 1, fontSize: 28 }} />
                      <Typography variant="h5" sx={{ fontWeight: 700, color: '#00007a' }}>
                        Referral Program
                      </Typography>
                    </Box>

                    <Typography variant="body1" sx={{ fontWeight: 500, color: '#00007a', mb: 2 }}>
                      Your referral link (COPY LINK):
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 400, color: '#00007a', mb: 3 }}>
                      You can get your referral link after investing
                    </Typography>

                    <Typography variant="body1" sx={{ fontWeight: 500, color: '#00007a', mb: 2 }}>
                      1st Level (6% Referral Rewards): 0.00 TRX<br />
                      2nd Level (2% Referral Rewards): 0.00 TRX<br />
                      Invitee (1% of the Self Investment)
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <Typography variant="body1" sx={{ fontWeight: 500, color: '#00007a', mr: 2 }}>
                        Total Referral Reward Payouts:
                      </Typography>
                      <TextField
                        placeholder="000.00"
                        sx={{ maxWidth: 150 }}
                      />
                    </Box>

                    <Button
                      variant="contained"
                      sx={{
                        background: 'darkblue',
                        borderRadius: 8,
                        px: 4,
                        py: 1.5,
                        fontWeight: 700,
                        '&:hover': {
                          background: '#00007a'
                        }
                      }}
                    >
                      WITHDRAW
                    </Button>
                  </CardContent>
                </Card>
              </Fade>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* My Investments Section */}
      <Box sx={sectionStyle}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid size={{ xs: 12, md: 7 }}>
              <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                <Typography
                  variant="h3"
                  sx={{
                    color: '#51ceff',
                    fontWeight: 700,
                    mb: 3,
                    fontSize: { xs: '2rem', md: '2.5rem' }
                  }}
                >
                  My Investments
                </Typography>

                <Typography variant="body1" sx={{ color: 'white', fontWeight: 500, mb: 3 }}>
                  My Total Investments: <span style={{ fontWeight: 700 }}>0.00</span> TRX<br />
                  Total Dividends so far: <span style={{ fontWeight: 700 }}>0.00</span> TRX
                </Typography>

                <Button
                  variant="contained"
                  href="#investment"
                  sx={{
                    background: 'darkblue',
                    borderRadius: 8,
                    px: 4,
                    py: 1.5,
                    fontWeight: 700,
                    mb: 4,
                    '&:hover': {
                      background: '#00007a'
                    }
                  }}
                >
                  BUY
                </Button>

                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  <SecurityIcon sx={{ fontSize: 48, color: 'white', mb: 2 }} />
                  <Typography variant="h5" sx={{ color: 'white', fontWeight: 500, mb: 2 }}>
                    My Investments
                  </Typography>

                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={2}
                    justifyContent="center"
                    sx={{ flexWrap: 'wrap' }}
                  >
                    <Chip
                      label="Player-1"
                      sx={{
                        color: 'white',
                        borderColor: 'white',
                        '&:hover': {
                          borderColor: '#23c1ff',
                          color: '#23c1ff'
                        }
                      }}
                      variant="outlined"
                    />
                    <Chip
                      label="Player-2"
                      sx={{
                        color: 'white',
                        borderColor: 'white',
                        '&:hover': {
                          borderColor: '#23c1ff',
                          color: '#23c1ff'
                        }
                      }}
                      variant="outlined"
                    />
                    <Chip
                      label="SPT Token"
                      sx={{
                        color: 'white',
                        borderColor: 'white',
                        '&:hover': {
                          borderColor: '#23c1ff',
                          color: '#23c1ff'
                        }
                      }}
                      variant="outlined"
                    />
                  </Stack>
                </Box>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 5 }}>
              <Zoom in={showContent} timeout={1000} style={{ transitionDelay: '600ms' }}>
                <Box sx={{ textAlign: 'center' }}>
                  <img
                    src="/final/img001.png"
                    alt="Investment Illustration"
                    style={{
                      maxWidth: '100%',
                      height: 'auto',
                      filter: 'drop-shadow(0 0 20px rgba(255, 255, 255, 0.2))'
                    }}
                  />
                </Box>
              </Zoom>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* SPT Token Rewards Section */}
      <Box sx={sectionStyle}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            sx={{
              color: 'white',
              fontWeight: 700,
              textAlign: 'center',
              mb: 6,
              fontSize: { xs: '2rem', md: '2.5rem' }
            }}
          >
            SPT Token Rewards
          </Typography>

          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 5 }}>
              <Fade in={showContent} timeout={1000} style={{ transitionDelay: '200ms' }}>
                <Card sx={{
                  ...cardStyle,
                  background: 'linear-gradient(135deg, #23c1ff 0%, #1976d2 100%)',
                  borderRadius: 8
                }}>
                  <CardContent sx={{ p: 4 }}>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#00007a', mb: 3 }}>
                      SPT Rewards Structure:
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500, color: '#00007a' }}>
                      Invest in <span style={{ fontWeight: 700 }}>ROI</span> any plan<br />
                      <span style={{ fontWeight: 700 }}>EX: 1000 TRX = 1000 SPT</span><br />
                      Tokens You get Instantly
                    </Typography>
                  </CardContent>
                </Card>
              </Fade>
            </Grid>

            <Grid size={{ xs: 12, md: 7 }}>
              <Fade in={showContent} timeout={1000} style={{ transitionDelay: '400ms' }}>
                <Card sx={{
                  ...cardStyle,
                  background: 'linear-gradient(135deg, #23c1ff 0%, #1976d2 100%)',
                  borderRadius: 8
                }}>
                  <CardContent sx={{ p: 4 }}>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#00007a', mb: 3 }}>
                      SPT Token Balance
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                      <TextField
                        placeholder="00.000"
                        type="number"
                        sx={{ flex: 1 }}
                      />
                      <Button
                        variant="contained"
                        sx={{
                          background: 'darkblue',
                          borderRadius: 8,
                          px: 3,
                          py: 1.5,
                          fontWeight: 700,
                          fontSize: '0.8rem',
                          '&:hover': {
                            background: '#00007a'
                          }
                        }}
                      >
                        Withdraw To DEMO Wallet
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Fade>
            </Grid>
          </Grid>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, mb: 2 }}>
              Tokens History
            </Typography>
            <Typography variant="body1" sx={{ color: 'white', fontWeight: 500 }}>
              1.100 TRX Sent to DEMO Wallet Address
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Project Roadmap Section */}
      <Box sx={sectionStyle} id="roadmap">
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            sx={{
              color: 'white',
              fontWeight: 700,
              textAlign: 'center',
              mb: 6,
              fontSize: { xs: '2rem', md: '2.5rem' }
            }}
          >
            Project Roadmap
          </Typography>

          <Grid container spacing={4}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Fade in={showContent} timeout={1000} style={{ transitionDelay: '200ms' }}>
                <Card sx={{
                  ...cardStyle,
                  textAlign: 'center',
                  minHeight: 250,
                  background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.9) 0%, rgba(46, 125, 50, 0.9) 100%)'
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      background: '#4caf50',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 2
                    }}>
                      <TimelineIcon sx={{ color: 'white', fontSize: 30 }} />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: 'white', mb: 2 }}>
                      Q3-2020
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'white' }}>
                      Project Idea Creation<br />
                      Website Development Start.
                    </Typography>
                  </CardContent>
                </Card>
              </Fade>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Fade in={showContent} timeout={1000} style={{ transitionDelay: '400ms' }}>
                <Card sx={{
                  ...cardStyle,
                  textAlign: 'center',
                  minHeight: 250,
                  background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.9) 0%, rgba(46, 125, 50, 0.9) 100%)'
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      background: '#4caf50',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 2
                    }}>
                      <SecurityIcon sx={{ color: 'white', fontSize: 30 }} />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: 'white', mb: 2 }}>
                      Q3-2020
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'white' }}>
                      ROI Platform Making Start.<br />
                      DAPP Smart Contract Creation.<br />
                      Coin Integration.
                    </Typography>
                  </CardContent>
                </Card>
              </Fade>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Fade in={showContent} timeout={1000} style={{ transitionDelay: '600ms' }}>
                <Card sx={{
                  ...cardStyle,
                  textAlign: 'center',
                  minHeight: 250,
                  background: 'linear-gradient(135deg, rgba(255, 193, 7, 0.9) 0%, rgba(255, 152, 0, 0.9) 100%)'
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      background: '#ff9800',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 2
                    }}>
                      <TrendingUpIcon sx={{ color: 'white', fontSize: 30 }} />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: 'white', mb: 2 }}>
                      Q4-2020
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'white' }}>
                      Own DEX Exchange Launch.<br />
                      Listing in Justswap.<br />
                      Listing in International DEX Exchanges.
                    </Typography>
                  </CardContent>
                </Card>
              </Fade>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Fade in={showContent} timeout={1000} style={{ transitionDelay: '800ms' }}>
                <Card sx={{
                  ...cardStyle,
                  textAlign: 'center',
                  minHeight: 250,
                  background: 'linear-gradient(135deg, rgba(255, 193, 7, 0.9) 0%, rgba(255, 152, 0, 0.9) 100%)'
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      background: '#ff9800',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 2
                    }}>
                      <DiamondIcon sx={{ color: 'white', fontSize: 30 }} />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: 'white', mb: 2 }}>
                      Q1-2021
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'white' }}>
                      Coin API Launch.<br />
                      Merchants Integration.<br />
                      Coinmarketcap Listing.
                    </Typography>
                  </CardContent>
                </Card>
              </Fade>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default TronSpider;
