import { Box, Button, Fab, Typography, useTheme } from '@mui/material'
import React from 'react'
import HeaderMainPage from '../components/HeaderMainPage'
import MainIllustration1 from '../assets/MainIllustration1.png';
import MainIllustration2 from '../assets/MainIllustration2.png';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useThemeMode } from '../contexts/ThemeContext';
import BoxFeaturesSuitableMainPage from '../components/BoxFeaturesSuitableMainPage';

function MainPage() {
  const theme = useTheme();
  const { mode, toggleTheme } = useThemeMode();

  return (
    <>
      <HeaderMainPage />
      {/*Box Monitor. Analyze. Evolve*/}
      <Box
        sx={{
          width: '100vw', height: '370px', backgroundColor:
            theme.palette.background.default,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 8,
        }}
      >
        <Box>
          <Typography variant="h3" sx={{ color: theme.palette.text.primary, fontWeight: 'bold', }}>
            Monitor. Analyze. Evolve.
          </Typography>
          <Typography variant="body2" sx={{
            color: theme.palette.text.secondary,
            fontWeight: 'light', paddingTop: '10px', paddingBottom: '15px'
          }}
          >
            The missing technology to enhance athletic performance for your team.
          </Typography>
          <Button variant="contained"
            sx={{
              mr: 1, backgroundColor: '#2CAE4D', textTransform: 'none',
              color: '#fff', width: '100px', height: '40px',
              '&:hover': {
                backgroundColor: '#249B45'
              }
            }}
          >
            Register
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
            What is WiKo?
          </Typography>
          <Typography
            variant="body2"
            sx={{ fontWeight: 'light', paddingTop: '10px', paddingBottom: '15px' }}
          >
            WIKO is an intelligent platform that uses neural network to monitor and analyze athletes' performance. Designed for coaches and physical trainers, it provides insights, tracks trends, and helps prevent injuries through data-driven decisions.
            <br /><br />
            Trains smarter, make data-driven decisions, evolve your team’s physical condition.
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
          Ready to Revolutionize Performance?
        </Typography>

        <Typography variant="body1" sx={{ maxWidth: 400, color: '#e8e8e8ff' }}>
          Join coaches and athletes who are transforming training
        </Typography>

        <Button
          variant="contained"
          sx={{
            backgroundColor: 'white',
            color: '#000000ff',
            mb: 5,
            mt: 3,
            '&:hover': {
              backgroundColor: '#e0f2e9',
            },
          }}
        >
          Get Started Now
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
          Empowering athletic performance through innovation.
        </Typography>

        <Box
          sx={{
            display: 'flex', justifyContent: 'center', gap: 3, mt: 2, flexWrap: 'wrap',
          }}
        >
          {['About Us', 'Features', 'Contact', 'Privacy Policy', 'Terms'].map((text) => (
            <Typography
              key={text}
              variant="body2"
              sx={{
                cursor: 'pointer',
                color: theme.palette.text.primary,
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              {text}
            </Typography>
          ))}
        </Box>

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
          © 2025 WiKo. All rights reserved.
        </Typography>
      </Box>

      {/*Switch Light and Dark Mode*/}
      <Fab
        size="medium" onClick={toggleTheme} sx={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 1300,
          backgroundColor: theme.palette.background.paper, color: theme.palette.text.primary,
          boxShadow: 4, '&:hover': { backgroundColor: mode === 'light' ? '#e0e0e0' : '#555', },
        }}
      >
        {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
      </Fab>
    </>
  )
}

export default MainPage