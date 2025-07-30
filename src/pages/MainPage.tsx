import { Box, Button, Fab, Typography, useTheme } from '@mui/material'
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
import SportsOutlinedIcon from '@mui/icons-material/SportsOutlined';
import SportsSoccerOutlinedIcon from '@mui/icons-material/SportsSoccerOutlined';
import GroupsIcon from '@mui/icons-material/Groups';

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

      {/* Box Features & Suitable*/}
      <Box
        sx={{
          width: '100vw',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          minHeight: '350px',
          backgroundColor:
            theme.palette.background.paper,
        }}
      >
        {/* FEATURES */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            px: 4,
            py: 4,
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: 'bold', mb: 1, color: theme.palette.text.primary, textAlign: 'center' }}
          >
            Features Available
          </Typography>
          <Typography
            variant="body2"
            sx={{ mb: 3, textAlign: 'center', color: theme.palette.text.primary }}
          >
            Smart tools designed for modern teams
          </Typography>

          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              gap: 2,
              alignItems: 'center',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            {/* CARD 1 */}
            <Box
              sx={{
                backgroundColor: theme.palette.background.default,
                boxShadow: 3,
                borderRadius: 2,
                p: 2,
                width: 180,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
              }}
            >
              <Box sx={{ position: 'relative', mb: 1 }}>
                <Box
                  sx={{
                    backgroundColor: '#e9f4e9',
                    borderRadius: '12px 0px 12px 0px',
                    padding: 0.5,
                    minWidth: 36,
                    minHeight: 36,
                    ml: 3,
                    mt: 1,
                  }}
                />
                <FileDownloadOutlinedIcon
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    fontSize: 32,
                    color: theme.palette.mode === 'light' ? '#0C621F' : '#2CAE4D',
                  }}
                />
              </Box>
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                Custom Report<br />for Coaches
              </Typography>
            </Box>

            {/* CARD 2 */}
            <Box
              sx={{
                backgroundColor: theme.palette.background.default,
                boxShadow: 3,
                borderRadius: 2,
                p: 2,
                width: 180,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
              }}
            >
              <Box sx={{ position: 'relative', mb: 1 }}>
                <Box
                  sx={{
                    backgroundColor: '#e9f4e9',
                    borderRadius: '12px 0px 12px 0px',
                    padding: 0.5,
                    minWidth: 36,
                    minHeight: 36,
                    ml: 3,
                    mt: 1,
                  }}
                />
                <SmartToyOutlinedIcon
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    fontSize: 32,
                    color: theme.palette.mode === 'light' ? '#0C621F' : '#2CAE4D',
                  }}
                />
              </Box>
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                AI Based Injury<br />Risk Detection
              </Typography>
            </Box>

            {/* CARD 3 */}
            <Box
              sx={{
                backgroundColor: theme.palette.background.default,
                boxShadow: 3,
                borderRadius: 2,
                p: 2,
                width: 180,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
              }}
            >
              <Box sx={{ position: 'relative', mb: 1 }}>
                <Box
                  sx={{
                    backgroundColor: '#e9f4e9',
                    borderRadius: '12px 0px 12px 0px',
                    padding: 0.5,
                    minWidth: 36,
                    minHeight: 36,
                    ml: 3,
                    mt: 1,
                  }}
                />
                <DashboardOutlinedIcon
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    fontSize: 32,
                    color: theme.palette.mode === 'light' ? '#0C621F' : '#2CAE4D',
                  }}
                />
              </Box>
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                Personalized<br />Dashboard
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* SUITABLE FOR */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            px: 4,
            py: 4,
            borderLeft: { md: `1px solid ${theme.palette.divider}` },
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 'bold',
              mb: 1,
              textAlign: 'center',
              color: theme.palette.text.primary,
            }}
          >
            Manage your entire athletes in a single system
          </Typography>
          <Typography
            variant="body2"
            sx={{ mb: 3, textAlign: 'center', color: theme.palette.text.primary }}
          >
            Who is WiKo suitable for?
          </Typography>

          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              gap: 2,
              alignItems: 'center',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            {/* CARD 1 */}
            <Box
              sx={{
                backgroundColor: theme.palette.background.default,
                boxShadow: 3,
                borderRadius: 2,
                p: 2,
                width: 180,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
              }}
            >
              <Box sx={{ position: 'relative', mb: 1 }}>
                <Box
                  sx={{
                    backgroundColor: '#e9f4e9',
                    borderRadius: '12px 0px 12px 0px',
                    padding: 0.5,
                    minWidth: 36,
                    minHeight: 36,
                    ml: 3,
                    mt: 1,
                  }}
                />
                <SportsOutlinedIcon
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    fontSize: 32,
                    color: theme.palette.mode === 'light' ? '#0C621F' : '#2CAE4D',
                  }}
                />
              </Box>
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                Coaches &<br />Physical Trainers
              </Typography>
              <Typography
                sx={{ mt: 1, fontWeight: 'light', color: theme.palette.mode === 'light' ? '#717171' : '#EDECEC', fontSize: '0.7rem' }}
              >
                Access performance insights and training optimization tools.
              </Typography>
            </Box>

            {/* CARD 2 */}
            <Box
              sx={{
                backgroundColor: theme.palette.background.default,
                boxShadow: 3,
                borderRadius: 2,
                p: 2,
                width: 180,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
              }}
            >
              <Box sx={{ position: 'relative', mb: 1 }}>
                <Box
                  sx={{
                    backgroundColor: '#e9f4e9',
                    borderRadius: '12px 0px 12px 0px',
                    padding: 0.5,
                    minWidth: 36,
                    minHeight: 36,
                    ml: 3,
                    mt: 1,
                  }}
                />
                <SportsSoccerOutlinedIcon
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    fontSize: 32,
                    color: theme.palette.mode === 'light' ? '#0C621F' : '#2CAE4D',
                  }}
                />
              </Box>
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                Athletes for All<br />Sports
              </Typography>
              <Typography
                sx={{ mt: 1, fontWeight: 'light', color: theme.palette.mode === 'light' ? '#717171' : '#EDECEC', fontSize: '0.7rem' }}
              >
                Track progress, manage workload, and reduce injury risk.
              </Typography>
            </Box>

            {/* CARD 3 */}
            <Box
              sx={{
                backgroundColor: theme.palette.background.default,
                boxShadow: 3,
                borderRadius: 2,
                p: 2,
                width: 180,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
              }}
            >
              <Box sx={{ position: 'relative', mb: 1 }}>
                <Box
                  sx={{
                    backgroundColor: '#e9f4e9',
                    borderRadius: '12px 0px 12px 0px',
                    padding: 0.5,
                    minWidth: 36,
                    minHeight: 36,
                    ml: 3,
                    mt: 1,
                  }}
                />
                <GroupsIcon
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    fontSize: 32,
                    color: theme.palette.mode === 'light' ? '#0C621F' : '#2CAE4D',
                  }}
                />
              </Box>
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                Sport Teams and<br />Clubs
              </Typography>
              <Typography
                sx={{ mt: 1, fontWeight: 'light', color: theme.palette.mode === 'light' ? '#717171' : '#EDECEC', fontSize: '0.7rem' }}
              >
                Implement centralized data systems to monitor entire squads
              </Typography>
            </Box>
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