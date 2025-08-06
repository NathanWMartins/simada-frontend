import { Box, TextField, Typography, useTheme } from '@mui/material'
import React from 'react'
import SwitchLightDarkMode from '../components/SwitchLightDarkMode';
import LogoLight from '../assets/LogoWiKoLight.png';
import LogoDark from '../assets/LogoWiKoDark.png';
import coachPhoto from '../assets/coach-photo.png'
function LoginPage() {
    const theme = useTheme();
    const logo = theme.palette.mode === 'dark' ? LogoDark : LogoLight;
    return (
        <>
            <Box sx={{
                width: '100vw', height: '100vh', backgroundColor: theme.palette.background.paper,
                display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 4,
            }}
            >
                <Box component="img" src={logo} alt="SIMADA Logo" sx={{ height: 30 }} />
                <Box
                    sx={{
                        display: 'flex', flexDirection: 'row', width: '100%', maxWidth: 700,
                        height: 'auto', p: 0, backgroundColor: theme.palette.primary.contrastText,
                        boxShadow: 10, borderRadius: 2, overflow: 'hidden', mt: 4,
                    }}
                >
                    {/* Imagem */}
                    <Box
                        sx={{
                            width: '45%', backgroundImage: `url(${coachPhoto})`, backgroundColor: theme.palette.background.default,
                            backgroundSize: 'cover', backgroundPosition: 'center', minHeight: 400
                        }}
                    />

                    {/* Inputs */}
                    <Box
                        sx={{
                            width: '70%', display: 'flex', flexDirection: 'column',
                            justifyContent: 'flex-start', alignItems: 'center'
                        }}
                    >
                        <Typography
                            variant="body2"
                            sx={{
                                color: theme.palette.text.primary, fontWeight: 'bold',
                                alignSelf: 'center', textAlign: 'center', pt: 2
                            }}
                        >
                            Welcome back, Trainer! <br />
                            Let’s elevate physical performance together.
                        </Typography>
                        <Typography
                            sx={{
                                color: theme.palette.text.secondary, fontWeight: 'bold',
                                alignSelf: 'center', textAlign: 'center', fontSize: 10, pt: 1
                            }}
                        >
                            Enter your login to sign up for this app
                        </Typography>
                    </Box>
                </Box>


            </Box>
            <SwitchLightDarkMode />
        </>
    )
}

export default LoginPage