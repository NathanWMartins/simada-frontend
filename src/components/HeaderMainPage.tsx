import { AppBar, Box, Button, Toolbar } from '@mui/material';
import React from 'react';
import { useTheme } from '@mui/material/styles';
import LogoLight from '../assets/LogoWiKoLight.png';
import LogoDark from '../assets/LogoWiKoDark.png';
import { useNavigate } from 'react-router-dom';

function HeaderMainPage() {
  const theme = useTheme();
  const logo = theme.palette.mode === 'dark' ? LogoDark : LogoLight;
  const navigate = useNavigate();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        sx={{
          backgroundColor: theme.palette.background.paper, color: theme.palette.text.primary,
        }}
        elevation={1}
      >
        <Toolbar>
          <Box component="img" src={logo} alt="SIMADA Logo"
            sx={{
              height: 30,
              ml: 1,
              mr: 'auto'
            }}
          />

          <Button
            variant="contained"
            onClick={() => navigate('/login')}
            sx={{
              mr: 1, backgroundColor: '#2CAE4D', textTransform: 'none',
              color: '#fff', width: '130px', height: '30px',
              '&:hover': {
                backgroundColor: '#249B45'
              }
            }}
          >
            Sign In
          </Button>
          <Button
            variant="contained"
            color="success"
            sx={{
              mr: 2, backgroundColor: '#2CAE4D', textTransform: 'none',
              color: '#fff', width: '130px', height: '30px',
              '&:hover': {
                backgroundColor: '#249B45'
              }
            }}
          >
            Contact Us
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default HeaderMainPage;
