import { useEffect, useState } from "react";
import { Alert, Box, CircularProgress, Paper, Snackbar, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate, useParams } from "react-router-dom";
import HeaderHomeCoach from "../../../components/header/HeaderHomeCoach";
import { SwitchLightDarkMode } from "../../../components/common";
import { useUserContext } from "../../../contexts/UserContext";
import { getAthleteById, updateAthlete } from "../../../services/coach/athletes/coachAthletesService";
import type { Athletes, UpdateAthletePayload } from "../../../types/athleteType";
import AthleteForm from "../../../components/coach/athletesCoach/AthleteForm";

export default function EditAthlete() {
    const theme = useTheme();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { user } = useUserContext();    

    const [athlete, setAthlete] = useState< Athletes| null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [snack, setSnack] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
        open: false, message: "", severity: "success"
    });
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            try {
                if (!user?.id || !id) return;
                setLoading(true);
                setError(null);
                const data = await getAthleteById(user.id, Number(id));
                setAthlete(data);
            } catch (e: any) {
                console.error(e);
                setError("Failed loading athlete.");
            } finally {
                setLoading(false);
            }
        })();
    }, [user?.id, id]);

    const handleSubmit = async (values: UpdateAthletePayload) => {
        if (!id) return;
        if (!user) return;
        try {
            setSaving(true);
            await updateAthlete(user.id, Number(id), values);
            setSnack({ open: true, message: "Athlete updated successfully.", severity: "success" });
            navigate(-1);
        } catch (e: any) {
            console.error(e);
            setSnack({ open: true, message: e?.response?.data?.message ?? "Failed to update athlete.", severity: "error" });
        } finally {
            setSaving(false);
        }
    };

    return (
        <Box sx={{ bgcolor: theme.palette.background.paper, minHeight: "100vh" }}>
            <HeaderHomeCoach />

            <Box sx={{ px: 8, pt: 4, pb: 8 }}>
                {/* barra topo */}
                <Paper elevation={4} sx={{ position: "relative", mb: 2, borderRadius: 3, overflow: "hidden", bgcolor: "transparent" }}>
                    <Box sx={{
                        px: 2.5, py: 1.5, display: "flex", alignItems: "center", justifyContent: "space-between",
                        background: "linear-gradient(90deg, #1db954 0%, #17a24a 50%, #12903f 100%)",
                    }}>
                        <Typography variant="h6" fontWeight={700} color="#fff">
                            Edit Athlete
                        </Typography>
                    </Box>
                </Paper>

                {/* conteúdo */}
                <Paper elevation={4} sx={{ borderRadius: 3, p: 3, bgcolor: theme.palette.background.default, maxWidth: 1400, mx: "auto" }}>
                    {loading && (
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", py: 6 }}>
                            <CircularProgress size={28} />
                        </Box>
                    )}

                    {!loading && error && <Alert severity="error">{error}</Alert>}

                    {!loading && !error && athlete && (
                        <AthleteForm
                            initial={athlete}
                            saving={saving}
                            onCancel={() => navigate(-1)}
                            onSubmit={handleSubmit}
                        />
                    )}
                </Paper>
            </Box>

            <Snackbar
                open={snack.open}
                autoHideDuration={3500}
                onClose={() => setSnack(s => ({ ...s, open: false }))}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <Alert severity={snack.severity} sx={{ width: "100%" }}>{snack.message}</Alert>
            </Snackbar>

            <SwitchLightDarkMode />
        </Box>
    );
}
