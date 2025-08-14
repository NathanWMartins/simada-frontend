import { Box, Button, Divider, Typography, useTheme } from '@mui/material'
import React, { useState } from 'react'
import SwitchLightDarkMode from '../components/SwitchLightDarkMode';
import coachPhoto2 from '../assets/coach-photo2.png'
import { styled } from '@mui/material/styles';
import LogoHeader from '../components/LogoHeader';
import GoogleButton from '../components/GoogleButton';
import BackFab from '../components/BackFab';
import { useNavigate } from 'react-router-dom';
import { registerTrainer } from '../services/authService';
import CustomTextField from '../components/CustomTextField';
import PasswordInput from '../components/PasswordInput';

function RegisterPage() {
    const theme = useTheme();
    const navigate = useNavigate();

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');

    const Root = styled('div')(({ theme }) => ({
        width: '100%',
        ...theme.typography.body2,
        color: (theme.vars || theme).palette.text.secondary,
        '& > :not(style) ~ :not(style)': {
            marginTop: theme.spacing(2),
        },
    }));

    const handleRegister = async () => {
        if (password !== repeatPassword) {
            alert('As senhas não coincidem!');
            return;
        }
        try {
            await registerTrainer({ fullName, email, password });
            alert('Conta criada com sucesso!');
            navigate('/');
        } catch (error: any) {
            alert(error.message || 'Erro ao registrar usuário');
        }
    };

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
                        display: 'flex', flexDirection: 'row', width: '100%', maxWidth: 750,
                        height: 'auto', p: 0, backgroundColor: theme.palette.primary.contrastText,
                        boxShadow: 10, borderRadius: 2, overflow: 'hidden', mt: 3,
                    }}
                >
                    {/* Inputs */}
                    <Box
                        sx={{
                            width: '70%', display: 'flex', flexDirection: 'column',
                            justifyContent: 'flex-start', alignItems: 'center',
                        }}
                    >
                        <Typography
                            variant="body2"
                            sx={{
                                color: theme.palette.text.primary, fontWeight: 'bold',
                                alignSelf: 'center', textAlign: 'center', pt: 2,
                            }}
                        >
                            Welcome to your performance hub.<br />
                            Create your account and start optimizing training.
                        </Typography>

                        <CustomTextField label="Full Name" value={fullName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFullName(e.target.value)} />
                        <CustomTextField label="Email" type="email" value={email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} />
                        <PasswordInput label="Password" id="password" value={password} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} />
                        <PasswordInput label="Repeat Password" id="repeat-password" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRepeatPassword(e.target.value)}/>

                        <Button
                            variant="contained"
                            sx={{
                                mt: 1, backgroundColor: '#2CAE4D', textTransform: 'none',
                                color: '#fff', width: '230px', height: '35px',
                                '&:hover': {
                                    backgroundColor: '#249B45',
                                },
                            }} onClick={handleRegister}
                        >
                            Register
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
                                mt: 1, display: 'flex', justifyContent: 'center',
                                alignItems: 'center', gap: 1, mb: 2
                            }}
                        >
                            <Typography
                                variant="body2" color={theme.palette.text.secondary}
                                sx={{ fontSize: 12 }}
                            >
                                Don't have an account?
                            </Typography>

                            <Typography
                                variant="body2" onClick={() => navigate('/login')}
                                sx={{
                                    fontWeight: 'bold', fontSize: 12, color: theme.palette.success.main,
                                    cursor: 'pointer', '&:hover': { textDecoration: 'underline' },
                                }}
                            >
                                Sign In
                            </Typography>
                        </Box>
                    </Box>

                    {/* Imagem */}
                    <Box
                        sx={{
                            width: '45%',
                            backgroundImage: `url(${coachPhoto2})`,
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