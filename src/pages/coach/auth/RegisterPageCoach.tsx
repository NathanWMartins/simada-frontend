import { Alert, Box, Button, Divider, Snackbar, Typography, useTheme } from '@mui/material'
import React, { useState } from 'react'
import coachPhoto2 from '../../../assets/coach-photo2.png'
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { registerCoach } from '../../../services/auth/authService';
import { useUserContext } from '../../../contexts/UserContext';
import { BackFab, CustomTextField, PasswordInput, SwitchLightDarkMode, Logo } from '../../../components/common';

type SnackbarState = {
    open: boolean;
    message: string;
    severity: "error" | "success" | "warning" | "info";
};

function RegisterPageCoach() {
    const theme = useTheme();
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const { setUser } = useUserContext();
    const { setAuth } = useUserContext();

    const [errorName, setErrorName] = useState(false);
    const [errorEmail, setErrorEmail] = useState(false);
    const [errorPassword, setErrorPassword] = useState(false);
    const [errorRepeatPassword, setErrorRepeatPassword] = useState(false);

    const [snackbar, setSnackbar] = useState<SnackbarState>({
        open: false,
        message: "",
        severity: "error",
    });

    const Root = styled('div')(({ theme }) => ({
        width: '100%',
        ...theme.typography.body2,
        color: (theme.vars || theme).palette.text.secondary,
        '& > :not(style) ~ :not(style)': {
            marginTop: theme.spacing(2),
        },
    }));

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    const resetError = () => {
        setErrorEmail(false);
        setErrorPassword(false);
    };

    const handleRegister = async () => {
        const errors: string[] = [];
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        resetError();

        if (!name) { errors.push("Full name is required"); setErrorName(true); }
        if (!email) { errors.push("Email is required"); setErrorEmail(true); }
        else if (!emailRegex.test(email)) { errors.push("Please enter a valid email"); setErrorEmail(true); }
        if (!password) { errors.push("Password is required"); setErrorPassword(true); }
        if (!repeatPassword) { errors.push("Repeat password is required"); setErrorRepeatPassword(true); }
        if (password && repeatPassword && password !== repeatPassword) { errors.push("Passwords do not match"); setErrorPassword(true); setErrorRepeatPassword(true); }

        if (errors.length > 0) {
            setSnackbar({
                open: true,
                message: errors.join("\n"),
                severity: "error",
            });
            return;
        }

        try {
            const response = await registerCoach({ name, email, password });

            if (response.status === 200 || response.status === 201) {
                setSnackbar({
                    open: true,
                    message: "Account created successfully!",
                    severity: "success",
                });
                setUser({
                    ...response.data,
                    fotoUsuario: response.data.fotoUsuario ?? undefined,
                });
                setAuth(
                    { id: response.data.id, email: response.data.email, name: response.data.name, userType: response.data.userType, userPhoto: response.data.userPhoto },
                    response.data.accessToken
                );
                navigate("/coach-home");
            } else {
                setSnackbar({
                    open: true,
                    message: response.data.message || "Error registering user",
                    severity: "error",
                });
            }
        } catch (error: any) {
            setSnackbar({
                open: true,
                message: error.message || "Error registering user",
                severity: "error",
            });
        }
    };

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

                        <CustomTextField label="Full Name" type="name" value={name} error={errorName}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)} />

                        <CustomTextField label="Email" type="email" value={email} error={errorEmail}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} />

                        <PasswordInput label="Password" id="password" value={password} error={errorPassword}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} />

                        <PasswordInput label="Repeat Password" id="repeat-password" error={errorRepeatPassword}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRepeatPassword(e.target.value)} />

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
                                variant="body2" onClick={() => navigate('/coach-login')}
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

export default RegisterPageCoach