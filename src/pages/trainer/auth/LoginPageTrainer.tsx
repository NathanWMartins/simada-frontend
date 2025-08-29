import { Alert, Box, Button, Divider, Snackbar, Typography, useTheme } from '@mui/material'
import React, { useState } from 'react'
import coachPhoto from '../../../assets/coach-photo.png'
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { login } from '../../../services/auth/authService';
import { BackFab, SwitchLightDarkMode, CustomTextField, PasswordInput, GoogleButton, Logo } from '../../../components/common';
import { useUserContext } from '../../../contexts/UserContext';
import { SnackbarState } from '../../../types/types';

function LoginPageTrainer() {
    const theme = useTheme();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorEmail, setErrorEmail] = useState(false);
    const [errorPassword, setErrorPassword] = useState(false);
    const [snackbar, setSnackbar] = useState<SnackbarState>({
        open: false,
        message: "",
        severity: "error",
    });
    const { setUser } = useUserContext();

    const Root = styled('div')(({ theme }) => ({
        width: '100%',
        ...theme.typography.body2,
        color: (theme.vars || theme).palette.text.secondary,
        '& > :not(style) ~ :not(style)': {
            marginTop: theme.spacing(2),
        },
    }));

    const handleCloseSnackbar = () => {
        setSnackbar((prev) => ({ ...prev, open: false }));
    };

    const resetError = () => {
        setErrorEmail(false);
        setErrorPassword(false);
    };

    const handleLogin = async () => {
        const errors: string[] = [];
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        resetError();

        if (!email) { errors.push("Email is required"); setErrorEmail(true); }
        else if (!emailRegex.test(email)) { errors.push("Please enter a valid email"); setErrorEmail(true); }
        if (!password) { errors.push("Password is required"); setErrorPassword(true); }

        if (errors.length > 0) {
            setSnackbar({
                open: true,
                message: errors.join("\n"),
                severity: "error",
            });
            return;
        }
        try {
            const response = await login({ email, password });

            if (response.status === 200 || response.status === 201) {
                setSnackbar({
                    open: true,
                    message: "Account loged successfully!",
                    severity: "success",
                });
                setUser({
                    ...response.data,
                    fotoUsuario: response.data.fotoUsuario ?? undefined,
                });
                navigate("/trainer-home");
            } else {
                setSnackbar({
                    open: true,
                    message: response.data?.message || "Error login user",
                    severity: "error",
                });
            }
        } catch (error: any) {
            setSnackbar({
                open: true,
                message: error.message || "Error logging in",
                severity: "error",
            });
        }
    };

    // const handleGoogle = async () => {
    //     try {
    //         const response = await loginWithGoogle();

    //         if (response && response.status === 200) {
    //             setSnackbar({ open: true, message: "Login com Google realizado!", severity: "success" });
    //             navigate("/trainer-home");
    //         } else {
    //             setSnackbar({ open: true, message: "Erro no login com Google", severity: "error" });
    //         }
    //     } catch (error: any) {
    //         setSnackbar({ open: true, message: error.message, severity: "error" });
    //     }
    // };

    return (
        <>
            <Box sx={{
                width: '100vw', height: '100vh', backgroundColor: theme.palette.background.paper,
                display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 4,
            }}
            >
                <Logo />

                <Box
                    sx={{
                        display: 'flex', flexDirection: 'row', width: '100%', maxWidth: 750,
                        height: 'auto', p: 0, backgroundColor: theme.palette.primary.contrastText, alignItems: 'center',
                        boxShadow: 10, borderRadius: 2, overflow: 'hidden', mt: 3, justifyContent: 'center',
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
                            justifyContent: 'flex-start', alignItems: 'center',
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

                        <CustomTextField label="Email" type="email" value={email} error={!!errorEmail}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} />

                        <PasswordInput label="Password" id="password" value={password} error={!!errorPassword}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} />

                        <Button
                            variant="contained"
                            sx={{
                                mt: 1, backgroundColor: '#2CAE4D', textTransform: 'none',
                                color: '#fff', width: '230px', height: '35px',
                                '&:hover': {
                                    backgroundColor: '#249B45'
                                }
                            }} onClick={handleLogin}
                        >
                            Sign In
                        </Button>

                        <Root sx={{ width: '80%', mt: 2 }}>
                            <Divider sx={{ fontSize: 12 }}>or continue with</Divider>
                        </Root>

                        <GoogleButton />

                        <Root sx={{ width: '80%', mt: 2, }}>
                            <Divider></Divider>
                        </Root>
                        <Box
                            sx={{
                                mt: 1, display: 'flex', justifyContent: 'center',
                                alignItems: 'center', gap: 1, mb: 2
                            }}
                        >
                            <Typography variant="body2" color={theme.palette.text.secondary} sx={{ fontSize: 12 }}>
                                Don't have an account?
                            </Typography>

                            <Typography
                                variant="body2"
                                onClick={() => navigate('/trainer-register')}
                                sx={{
                                    fontWeight: 'bold', fontSize: 12, color: theme.palette.success.main,
                                    cursor: 'pointer', '&:hover': { textDecoration: 'underline', },
                                }}
                            >
                                Create Account
                            </Typography>
                        </Box>

                    </Box>
                </Box>

            </Box>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    sx={{ width: "100%", whiteSpace: "pre-line" }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>

            <BackFab to="/" />
            <SwitchLightDarkMode />
        </>
    )
}

export default LoginPageTrainer