import { AppBar, Box, Button, Toolbar } from '@mui/material';
import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import LogoLight from '../../assets/LogoWiKoLight.png';
import LogoDark from '../../assets/LogoWiKoDark.png';
import { useNavigate } from 'react-router-dom';
import SupportHelpDialog from '../dialog/SupportHelpDialog';

function HeaderMainPage() {
  const theme = useTheme();
  const logo = theme.palette.mode === 'dark' ? LogoDark : LogoLight;
  const navigate = useNavigate();
  const [openSupport, setOpenSupport] = useState(false);

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
          <Box component="img" src={logo} alt="WIKO Logo"
            sx={{ height: 30, ml: 1, mr: 'auto' }}
          />

          <Button
            variant="contained"
            onClick={() => navigate('/coach-login')}
            sx={{
              mr: 1, backgroundColor: '#2CAE4D', textTransform: 'none',
              color: '#fff', width: '130px', height: '30px',
              '&:hover': {
                backgroundColor: '#249B45'
              }
            }}
          >
            Coach Login
          </Button>
          <Button
            variant="contained"
            onClick={() => navigate('/athlete-login')}
            sx={{
              mr: 1, backgroundColor: '#2CAE4D', textTransform: 'none',
              color: '#fff', width: '130px', height: '30px',
              '&:hover': { backgroundColor: '#249B45' }
            }}
          >
            Athlete Login
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={() => setOpenSupport(true)}
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
      <SupportHelpDialog
        open={openSupport}
        onClose={() => setOpenSupport(false)}
        supportEmail="suporte@wiko.app"
        appName="WIKO"
        version="v1.0.0"
      />
    </Box>
  );
}

export default HeaderMainPage;
