import { Box, Button, Divider, Typography, useTheme } from '@mui/material'
import React from 'react'
import SwitchLightDarkMode from '../components/SwitchLightDarkMode';
import coachPhoto from '../assets/coach-photo.png'
import { styled } from '@mui/material/styles';
import LogoHeader from '../components/LogoHeader';
import EmailInput from '../components/EmailInput';
import PasswordInput from '../components/PasswordInput';
import GoogleButton from '../components/GoogleButton';
import BackFab from '../components/BackFab';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
    const theme = useTheme();
    const navigate = useNavigate();

    const Root = styled('div')(({ theme }) => ({
        width: '100%',
        ...theme.typography.body2,
        color: (theme.vars || theme).palette.text.secondary,
        '& > :not(style) ~ :not(style)': {
            marginTop: theme.spacing(2),
        },
    }));
    return (
        <>
            <Box sx={{
                width: '100vw', height: '100vh', backgroundColor: theme.palette.background.paper,
                display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 4,
            }}
            >
                <LogoHeader />

                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        width: '100%',
                        maxWidth: 750,
                        height: 'auto',
                        p: 0,
                        backgroundColor: theme.palette.primary.contrastText,
                        boxShadow: 10,
                        borderRadius: 2,
                        overflow: 'hidden',
                        mt: 4,
                    }}
                >
                    {/* Inputs */}
                    <Box
                        sx={{
                            width: '70%',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                        }}
                    >
                        <Typography
                            variant="body2"
                            sx={{
                                color: theme.palette.text.primary,
                                fontWeight: 'bold',
                                alignSelf: 'center',
                                textAlign: 'center',
                                pt: 2,
                            }}
                        >
                            Welcome back, Trainer! <br />
                            Let’s elevate physical performance together.
                        </Typography>
                        <Typography
                            sx={{
                                color: theme.palette.text.secondary,
                                fontWeight: 'bold',
                                alignSelf: 'center',
                                textAlign: 'center',
                                fontSize: 10,
                                pt: 1,
                            }}
                        >
                            Enter your login to sign up for this app
                        </Typography>

                        <EmailInput />
                        <PasswordInput />

                        <Button
                            variant="contained"
                            sx={{
                                mt: 1,
                                backgroundColor: '#2CAE4D',
                                textTransform: 'none',
                                color: '#fff',
                                width: '230px',
                                height: '35px',
                                '&:hover': {
                                    backgroundColor: '#249B45',
                                },
                            }}
                        >
                            Sign In
                        </Button>

                        <Root sx={{ width: '80%', mt: 2 }}>
                            <Divider sx={{ fontSize: 12 }}>or continue with</Divider>
                        </Root>

                        <GoogleButton />

                        <Root sx={{ width: '80%', mt: 2 }}>
                            <Divider></Divider>
                        </Root>
                        <Box
                            sx={{
                                mt: 1,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: 1,
                            }}
                        >
                            <Typography
                                variant="body2"
                                color={theme.palette.text.secondary}
                                sx={{ fontSize: 12 }}
                            >
                                Don't have an account?
                            </Typography>

                            <Typography
                                variant="body2"
                                onClick={() => navigate('/register')}
                                sx={{
                                    fontWeight: 'bold',
                                    fontSize: 12,
                                    color: theme.palette.success.main,
                                    cursor: 'pointer',
                                    '&:hover': { textDecoration: 'underline' },
                                }}
                            >
                                Create Account
                            </Typography>
                        </Box>
                    </Box>

                    {/* Imagem */}
                    <Box
                        sx={{
                            width: '45%',
                            backgroundImage: `url(${coachPhoto})`,
                            backgroundColor: theme.palette.background.default,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            minHeight: 400,
                        }}
                    />
                </Box>


            </Box>
            <BackFab to="/" />
            <SwitchLightDarkMode />
        </>
    )
}

export default RegisterPage