import { Box, Button, Typography, useTheme } from '@mui/material'
import React from 'react'
import HeaderMainPage from '../components/header/HeaderMainPage'
import MainIllustration1 from '../assets/MainIllustration1.png';
import MainIllustration2 from '../assets/MainIllustration2.png';
import BoxFeaturesSuitableMainPage from '../components/mainPage/BoxFeaturesSuitableMainPage';
import SwitchLightDarkMode from '../components/common/SwitchLightDarkMode';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../i18n/I18nProvider';

function MainPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { t } = useI18n();

  return (
    <>
      <HeaderMainPage />
      {/*Box Monitor. Analyze. Evolve*/}
      <Box
        sx={{
          width: '100vw', height: '370px', backgroundColor: theme.palette.background.default,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 8,
        }}
      >
        <Box>
          <Typography variant="h3" sx={{ color: theme.palette.text.primary, fontWeight: 'bold', }}>
            {t('main_title_1')}
          </Typography>
          <Typography variant="body2" sx={{
            color: theme.palette.text.secondary,
            fontWeight: 'light', paddingTop: '10px', paddingBottom: '15px'
          }}
          >
            {t('main_subtitle_1')}
          </Typography>
          <Button variant="contained" onClick={() => navigate('/coach-register')}
            sx={{
              mr: 1, backgroundColor: '#2CAE4D', textTransform: 'none',
              color: '#fff', width: '170px', height: '40px',
              '&:hover': {
                backgroundColor: '#249B45'
              }
            }}
          >
            {t('main_btn_register_coach')}
          </Button>
        </Box>
        <Box component="img" src={MainIllustration1} alt="MainIllustration1"
          sx={{ height: '80%', maxWidth: '50%', objectFit: 'contain', }}
        />
      </Box >

      {/* Box What is WiKo */}
      <Box
        sx={{
          width: '100vw', height: '370px', backgroundColor: '#4CAF4F', display: 'flex',
          alignItems: 'center', justifyContent: 'space-between', px: 8,
        }}
      >
        <Box
          component="img" src={MainIllustration2} alt="MainIllustration2"
          sx={{ height: '65%', maxWidth: '35%', objectFit: 'contain', }}
        />

        <Box sx={{ maxWidth: '50%', marginLeft: 'auto', textAlign: 'right', color: '#fff' }}>
          <Typography
            variant="h3"
            sx={{ fontWeight: 'light', }}
          >
            {t('main_title_2')}
          </Typography>
          <Typography
            variant="body2"
            sx={{ fontWeight: 'light', paddingTop: '10px', paddingBottom: '15px' }}
          >
            {t('main_subtitle_2')}
            <br /><br />
            {t('main_subtitle_2_alt')}
          </Typography>
        </Box>
      </Box>

      {/* Box Features & Suitable */}
      <BoxFeaturesSuitableMainPage />

      {/* Box Ready */}
      <Box
        sx={{
          backgroundColor: '#2CAE4D',
          borderRadius: 2,
          padding: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: 2,
          color: 'white',
        }}
      >
        <Typography variant="h4" fontWeight="bold" sx={{ mt: 5 }}>
          {t('main_cta_title')}
        </Typography>

        <Typography variant="body1" sx={{ maxWidth: 400, color: '#e8e8e8ff' }}>
          {t('main_cta_subtitle')}
        </Typography>

        <Button
          variant="contained" onClick={() => navigate('/coach-register')}
          sx={{
            backgroundColor: 'white', color: '#000000ff', mb: 5, mt: 3,
            '&:hover': { backgroundColor: '#e0f2e9', },
          }}
        >
          {t('main_cta_btn')}
        </Button>
      </Box>

      {/* Box Footer*/}
      <Box
        sx={{
          width: '100%',
          backgroundColor:
            theme.palette.background.paper,
          color: theme.palette.text.primary,
          py: 3,
          px: 2,
          textAlign: 'center',
        }}
      >
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
          WiKo
        </Typography>

        <Typography
          variant="body2"
          sx={{
            maxWidth: 500, mx: 'auto', color: theme.palette.text.primary,
          }}
        >
          {t('main_footer_contact')}
        </Typography>

        <Typography
          variant="body2"
          sx={{ mt: 2, color: theme.palette.text.secondary }}
        >
          contact@wikoplatform.com
        </Typography>

        <Typography
          variant="caption"
          sx={{
            mt: 2, display: 'block', color: theme.palette.mode === 'light' ? '#999' : '#777',
          }}
        >
          © 2025 WiKo. {t('main_footer_rights')}
        </Typography>
      </Box>

      {/*Switch Light and Dark Mode*/}
      <SwitchLightDarkMode />
    </>
  )
}

export default MainPage