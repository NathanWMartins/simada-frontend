import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
    Alert, Box, Button, MenuItem, Snackbar, Typography, CircularProgress, useTheme,
    Link
} from "@mui/material";

import Logo from "../../../components/common/Logo";
import athletePhoto from "../../../assets/athlete-photo.png";
import { BackFab, SwitchLightDarkMode, CustomTextField, PasswordInput } from "../../../components/common";

import { completeInvite, fetchInvite } from "../../../services/auth/invite";
import PrivacyPolicyDialog from "../../../components/dialog/PrivacyPolicyDialog";

const POSITIONS = ["Goalkeeper", "Defender", "Midfielder", "Forward"] as const;

type SnackbarState = {
    open: boolean;
    message: string;
    severity: "error" | "success" | "warning" | "info";
};

export default function InviteSignup() {
    const theme = useTheme();
    const [params] = useSearchParams();
    const navigate = useNavigate();

    const token = params.get("invite") || "";

    const [loading, setLoading] = useState(true);
    const [inv, setInv] = useState<{ email: string; coachName: string } | null>(null);    
    const [privacyOpen, setPrivacyOpen] = useState(false);

    // form
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [birth, setBirth] = useState("");
    const [position, setPosition] = useState("");

    // errors
    const [errName, setErrName] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [errPassword, setErrPassword] = useState(false);

    const [snack, setSnack] = useState<SnackbarState>({
        open: false, message: "", severity: "error",
    });

    useEffect(() => {
        (async () => {
            if (!token) { setError("Missing invite token"); setLoading(false); return; }
            try {
                const data = await fetchInvite(token);
                setInv(data);
            } catch (e: any) {
                setError(e?.response?.data?.message || "Invalid or expired invite.");
            } finally {
                setLoading(false);
            }
        })();
    }, [token]);

    const resetErrors = () => { setErrName(false); setErrPassword(false); };

    const submit = async () => {
        resetErrors();
        const problems: string[] = [];
        if (!name.trim()) { problems.push("Name is required"); setErrName(true); }
        if (!password) { problems.push("Password is required"); setErrPassword(true); }

        if (problems.length) {
            setSnack({ open: true, message: problems.join("\n"), severity: "error" });
            return;
        }

        try {
            await completeInvite({ token, name, password, phone, birth, position });
            setSnack({ open: true, message: "Account created successfully!", severity: "success" });
            navigate("/athlete-login");
        } catch (e: any) {
            setSnack({
                open: true,
                message: e?.response?.data?.message || "Failed to complete signup.",
                severity: "error",
            });
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: "grid", placeItems: "center", minHeight: "60vh" }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ display: "grid", placeItems: "center", minHeight: "60vh", px: 2 }}>
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

    return (
        <>
            <Box
                sx={{
                    width: "100vw",
                    height: "130vh",
                    bgcolor: theme.palette.background.paper,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    pt: 4,
                }}
            >
                <Logo />

                {/* Card principal */}
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        width: "100%",
                        maxWidth: 900,
                        minHeight: 440,
                        boxShadow: 10,
                        borderRadius: 2,
                        overflow: "hidden",
                        mt: 3,
                        bgcolor: theme.palette.background.default,
                    }}
                >
                    {/* Lado da imagem */}
                    <Box
                        sx={{
                            flex: 1,
                            backgroundImage: `url(${athletePhoto})`,
                            backgroundSize: "contain",
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "center",
                            bgcolor: theme.palette.background.default,
                            display: { xs: "none", sm: "block" },
                            maxWidth: 400,
                            minHeight: 480,
                            alignSelf: "center",
                        }}
                    />

                    {/* Lado do formulário */}
                    <Box
                        sx={{
                            flex: { xs: 1, sm: 1.2 },
                            p: { xs: 3, sm: 4 },
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 1.2,
                            backgroundColor: theme.palette.background.paper
                        }}
                    >
                        <Typography
                            variant="body2"
                            sx={{ color: theme.palette.text.primary, fontWeight: "bold", textAlign: "center" }}
                        >
                            Welcome to your performance hub.
                            <br />
                            Create your account and start optimizing training.
                        </Typography>

                        <Typography
                            sx={{
                                color: theme.palette.text.secondary,
                                fontSize: 12,
                                textAlign: "center",
                            }}
                        >
                            Invited by <b>{inv?.coachName}</b>
                        </Typography>

                        {/* Campos */}
                        <CustomTextField
                            label="Email"
                            value={inv?.email || ""}
                            InputProps={{ readOnly: true }}
                        />

                        <CustomTextField
                            label="Full Name"
                            value={name}
                            error={errName}
                            onChange={(e) => setName(e.target.value)}
                            restriction="onlyLetters"
                        />

                        <PasswordInput
                            label="Password"
                            id="invite-password"
                            value={password}
                            error={errPassword}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <CustomTextField
                            label="Phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            restriction="onlyNumbers"
                        />

                        <CustomTextField
                            label="Birth"
                            type="date"
                            value={birth}
                            onChange={(e) => setBirth(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                        />

                        <CustomTextField
                            select
                            label="Position"
                            value={position}
                            onChange={(e) => setPosition(e.target.value)}
                        >
                            <MenuItem value="">—</MenuItem>
                            {POSITIONS.map((p) => (
                                <MenuItem key={p} value={p}>
                                    {p}
                                </MenuItem>
                            ))}
                        </CustomTextField>

                        <Typography
                            variant="caption"
                            sx={{ mt: 1, color: theme.palette.text.secondary, textAlign: 'center', px: 2 }}
                        >
                            By registering, you agree to our{' '}
                            <Link
                                component="button"
                                color='success'
                                onClick={() => setPrivacyOpen(true)}
                                underline="hover"
                                sx={{ fontWeight: 'bold' }}
                            >
                                Privacy Policy
                            </Link>.
                        </Typography>

                        <Button
                            variant="contained"
                            onClick={submit}
                            disabled={!name || !password}
                            sx={{
                                mt: 0.5,
                                textTransform: "none",
                                width: 230,
                                height: 36,
                                bgcolor: "#2CAE4D",
                                color: "#fff",
                                "&:hover": { bgcolor: "#249B45" },
                            }}
                        >
                            Register
                        </Button>
                    </Box>
                </Box>
            </Box>

            <PrivacyPolicyDialog
                open={privacyOpen}
                onClose={() => setPrivacyOpen(false)}
            />

            <Snackbar
                open={snack.open}
                autoHideDuration={4000}
                onClose={() => setSnack((s) => ({ ...s, open: false }))}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <Alert severity={snack.severity} sx={{ width: "100%", whiteSpace: "pre-line" }}>
                    {snack.message}
                </Alert>
            </Snackbar>

            <BackFab to="/" />
            <SwitchLightDarkMode />
        </>
    );
}
