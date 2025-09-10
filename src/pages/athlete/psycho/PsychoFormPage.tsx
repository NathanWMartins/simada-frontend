import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Box,
    Button,
    Container,
    MenuItem,
    Snackbar,
    TextField,
    Typography,
    Alert,
    CircularProgress,
    useTheme,
} from "@mui/material";
import LogoLight from '../../../assets/LogoWiKoLight.png';
import LogoDark from '../../../assets/LogoWiKoDark.png';
import { submitPsyForm, validatePsyForm } from "../../../services/coach/session/psychoEmocional/psyFormType";
import { SwitchLightDarkMode } from "../../../components/common";

type FormData = {
    srpe: string;
    fatigue: string;
    soreness: string;
    mood: string;
    energy: string;
};

const options = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

export default function PsychoFormPage() {
    const { token } = useParams<{ token: string }>();
    const navigate = useNavigate();
    const theme = useTheme();
    const logo = theme.palette.mode === 'dark' ? LogoDark : LogoLight;


    const [form, setForm] = useState<FormData>({
        srpe: "",
        fatigue: "",
        soreness: "",
        mood: "",
        energy: "",
    });

    const [loading, setLoading] = useState(false);
    const [validating, setValidating] = useState(true);

    const [athleteEmail, setAthleteEmail] = useState("");

    const [snack, setSnack] = useState<{ open: boolean; msg: string; type: "success" | "error" }>({
        open: false,
        msg: "",
        type: "success",
    });

    useEffect(() => {
        const checkToken = async () => {
            if (!token) return;
            try {
                const res = await validatePsyForm(token);
                setAthleteEmail(res.email);
            } catch (err: any) {
                setSnack({
                    open: true,
                    msg: err?.response?.data?.message || "Token inválido ou expirado.",
                    type: "error",
                });
                setTimeout(() => navigate("/"), 2500);
            } finally {
                setValidating(false);
            }
        };
        checkToken();
    }, [token, navigate]);

    const handleChange = (field: keyof FormData, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        if (!token) return;
        if (Object.values(form).some((v) => !v)) {
            setSnack({ open: true, msg: "Por favor, preencha todas as respostas.", type: "error" });
            return;
        }

        try {
            setLoading(true);
            await submitPsyForm(token, {
                srpe: Number(form.srpe),
                fatigue: Number(form.fatigue),
                soreness: Number(form.soreness),
                mood: Number(form.mood),
                energy: Number(form.energy),
            });
            setSnack({ open: true, msg: "Form send successfully!", type: "success" });
            setTimeout(() => navigate("/"), 2000);
        } catch (err: any) {
            setSnack({
                open: true,
                msg: err?.response?.data?.message || "Error sending form.",
                type: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    if (validating) {
        return (
            <Container maxWidth="sm" sx={{ py: 5, textAlign: "center" }}>
                <CircularProgress />
                <Typography variant="body2" sx={{ mt: 2 }}>
                    Validating Form...
                </Typography>
            </Container>
        );
    }

    return (
        <Box sx={{ bgcolor: theme.palette.background.paper }}>
            <Container
                maxWidth="sm"
                sx={{
                    py: 4,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    minHeight: "100vh",
                    bgcolor: theme.palette.background.default
                }}
            >
                <Box
                    component="img"
                    src={logo}
                    alt="SIMADA Logo"
                    sx={{
                        height: 30, mb: 3, display: "block", mx: "auto"
                    }}
                />
                <Typography variant="h6" fontWeight={600} gutterBottom textAlign="center"
                    sx={{ color: theme.palette.text.primary }}>
                    Psychoemocional Avaluation
                </Typography>

                <Typography variant="body2" color="text.secondary"
                    sx={{ mb: 3, textAlign: "center", color: theme.palette.text.secondary }}>
                    Email: <b>{athleteEmail}</b>
                </Typography>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {(
                        [
                            { key: "srpe", label: "Session Rating Exertion" },
                            { key: "fatigue", label: "Fatigue" },
                            { key: "soreness", label: "Soreness" },
                            { key: "mood", label: "Mood" },
                            { key: "energy", label: "Energy" },
                        ] as const
                    ).map(({ key, label }) => (
                        <TextField
                            key={key}
                            select
                            fullWidth
                            label={label}
                            value={form[key]}
                            onChange={(e) => handleChange(key, e.target.value)}
                            sx={{ bgcolor: theme.palette.background.paper }}
                        >
                            {options.map((o) => (
                                <MenuItem key={o} value={o}>
                                    {o}
                                </MenuItem>
                            ))}
                        </TextField>
                    ))}

                    <Button
                        variant="contained"
                        fullWidth
                        size="large"
                        disabled={loading}
                        onClick={handleSubmit}
                        color="success"
                    >
                        <Typography color="white">
                            {loading ? "Enviando..." : "Enviar"}
                        </Typography>
                    </Button>
                </Box>

                <Snackbar
                    open={snack.open}
                    autoHideDuration={3000}
                    onClose={() => setSnack((s) => ({ ...s, open: false }))}
                    anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                >
                    <Alert
                        severity={snack.type}
                        onClose={() => setSnack((s) => ({ ...s, open: false }))}
                        sx={{ width: "100%" }}
                    >
                        {snack.msg}
                    </Alert>
                </Snackbar>
                <SwitchLightDarkMode />
            </Container>
        </Box>
    );
}
