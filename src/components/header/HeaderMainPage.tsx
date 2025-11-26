import { AppBar, Box, Button, Toolbar } from '@mui/material';
import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import LogoLight from '../../assets/LogoWiKoLight.png';
import LogoDark from '../../assets/LogoWiKoDark.png';
import { useNavigate } from 'react-router-dom';
import SupportHelpDialog from '../dialog/SupportHelpDialog';
import LanguageSwitcher from '../mainPage/LanguageSwitcher';
import { useI18n } from '../../i18n/I18nProvider';

function HeaderMainPage() {
  const theme = useTheme();
  const logo = theme.palette.mode === 'dark' ? LogoDark : LogoLight;
  const navigate = useNavigate();
  const [openSupport, setOpenSupport] = useState(false);
  const { t } = useI18n();

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
            {t("nav_btn_coach")}
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
            {t("nav_btn_athlete")}
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
            {t("nav_btn_contact")}
          </Button>
          <LanguageSwitcher/>
        </Toolbar>
      </AppBar>
      <SupportHelpDialog
        open={openSupport}
        onClose={() => setOpenSupport(false)}
        supportEmail="suporte@wiko.app"
        version="v1.0.0"
      />
    </Box>
  );
}

export default HeaderMainPage;
