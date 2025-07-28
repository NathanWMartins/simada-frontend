import { Box, Button, Card, Container, Fab, Typography, useTheme } from '@mui/material'
import React from 'react'
import HeaderMainPage from '../components/HeaderMainPage'
import MainIllustration1 from '../assets/MainIllustration1.png';
import MainIllustration2 from '../assets/MainIllustration2.png';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useThemeMode } from '../contexts/ThemeContext';

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
            theme.palette.mode === 'light' ? '#f4f4f4ff' : '#383838',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 8,
        }}
      >
        <Box>
          <Typography variant="h3" sx={{ color: theme.palette.text.primary, fontWeight: 'bold', }}>
            Monitor. Analyze. Evolve.
          </Typography>
          <Typography variant="body2" sx={{
            color: theme.palette.mode === 'light' ? '#717171' : '#dadadaff',
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

      {/* Box Features */}
      <Box
        sx={{
          width: '100vw', minHeight: '370px', backgroundColor: theme.palette.mode === 'light' ? '#f4f4f4ff' : theme.palette.background.paper,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', px: 8, pt: 4,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 'bold',
            color: theme.palette.text.primary,
            marginBottom: 4,
          }}
        >
          Features Availables
        </Typography>

        <Box
          sx={{
            display: 'flex',
            gap: 4,
            justifyContent: 'center',
            width: '100%',
            maxWidth: '1100px',
            flexWrap: 'wrap',
          }}
        >
          {/* Card 1 */}
          <Box
            sx={{
              backgroundColor: theme.palette.background.default, boxShadow: 3, borderRadius: 2, padding: 3, gap: 1,
              width: '220px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center',
            }}
          >
            <FileDownloadOutlinedIcon sx={{ fontSize: 40, color: theme.palette.mode === 'light' ? '#2CAE4D' : '#9ee3a4ff' }} />
            <Typography
              variant="body1"
              sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}
            >
              Custom Report<br /> for Coaches
            </Typography>
          </Box>

          {/* Card 2 */}
          <Box
            sx={{
              backgroundColor: theme.palette.background.default, boxShadow: 3, borderRadius: 2, padding: 3, gap: 1,
              width: '220px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center',
            }}
          >
            <SmartToyOutlinedIcon sx={{ fontSize: 40, color: theme.palette.mode === 'light' ? '#2CAE4D' : '#9ee3a4ff' }} />
            <Typography
              variant="body1"
              sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}
            >
              AI Based Injury<br /> Risk Detection
            </Typography>
          </Box>

          {/* Card 3 */}
          <Box
            sx={{
              backgroundColor: theme.palette.background.default, boxShadow: 3, borderRadius: 2, padding: 3, gap: 1,
              width: '220px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center',
            }}
          >
            <DashboardOutlinedIcon sx={{ fontSize: 40, color: theme.palette.mode === 'light' ? '#2CAE4D' : '#9ee3a4ff' }} />
            <Typography
              variant="body1"
              sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}
            >
              Personalized<br /> Dashboard
            </Typography>
          </Box>
        </Box>
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