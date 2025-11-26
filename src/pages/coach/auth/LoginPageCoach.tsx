import { Alert, Box, Button, CircularProgress, Divider, Snackbar, Typography, useTheme } from '@mui/material'
import React, { useState } from 'react'
import coachPhoto from '../../../assets/coach-photo.png'
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { login } from '../../../services/auth/authService';
import { BackFab, SwitchLightDarkMode, CustomTextField, PasswordInput, Logo } from '../../../components/common';
import { useUserContext } from '../../../contexts/UserContext';
import { SnackbarState } from '../../../types/types';
import { useI18n } from '../../../i18n/I18nProvider';

function LoginPageCoach() {
    const theme = useTheme();
    const navigate = useNavigate();
    const {t} = useI18n();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorEmail, setErrorEmail] = useState(false);
    const [errorPassword, setErrorPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState<SnackbarState>({
        open: false,
        message: "",
        severity: "error",
    });
    const { setUser } = useUserContext();
    const { setAuth } = useUserContext();

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
            setSnackbar({ open: true, message: errors.join("\n"), severity: "error" });
            return;
        }

        try {
            setLoading(true);
            const response = await login({ email, password });

            if (response.status === 200 || response.status === 201) {
                setSnackbar({ open: true, message: "Account logged successfully!", severity: "success" });
                setUser({ ...response.data, fotoUsuario: response.data.fotoUsuario ?? undefined });
                setAuth(
                    { id: response.data.id, email: response.data.email, name: response.data.name, userType: response.data.userType, userPhoto: response.data.userPhoto },
                    response.data.accessToken
                );
                navigate("/coach-home");
            } else {
                setSnackbar({ open: true, message: response.data?.message || "Error logging in user", severity: "error" });
            }
        } catch (error: any) {
            const backendMessage =
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                error.message ||
                "Unexpected error. Please try again.";
            setSnackbar({ open: true, message: backendMessage, severity: "error" });
        } finally {
            setLoading(false);
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
                            {t('login_coach_title')} <br/>
                            {t('login_coach_subtitle')}
                        </Typography>
                        <Typography
                            sx={{
                                color: theme.palette.text.secondary, fontWeight: 'bold',
                                alignSelf: 'center', textAlign: 'center', fontSize: 10, pt: 1
                            }}
                        >
                            {t('login_coach_subtitle_2')}
                        </Typography>

                        <CustomTextField label={t('login_coach_email_label')} type="email" value={email} error={!!errorEmail}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} />

                        <PasswordInput label={t('login_coach_password_label')} id="password" value={password} error={!!errorPassword}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} />

                        <Button
                            variant="contained"
                            sx={{
                                mt: 1,
                                backgroundColor: '#2CAE4D',
                                textTransform: 'none',
                                color: '#fff',
                                width: '230px',
                                height: '35px',
                                '&:hover': { backgroundColor: '#249B45' }
                            }}
                            onClick={handleLogin}
                            disabled={loading}
                        >
                            {loading ? (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <CircularProgress size={18} thickness={4} />
                                    {t('login_btn_login_loading')}
                                </Box>
                            ) : (
                                t('login_btn_login')
                            )}
                        </Button>


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
                                {t('login_coach_dont_have_account')}
                            </Typography>

                            <Typography
                                variant="body2"
                                onClick={() => navigate('/coach-register')}
                                sx={{
                                    fontWeight: 'bold', fontSize: 12, color: theme.palette.success.main,
                                    cursor: 'pointer', '&:hover': { textDecoration: 'underline', },
                                }}
                            >
                                {t('login_coach_register_link')}
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

export default LoginPageCoach