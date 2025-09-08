import { useEffect, useState } from "react";
import {
    Avatar, Box, Button, Chip, Dialog, DialogContent, DialogTitle,
    Divider, IconButton, Stack, Typography, CircularProgress, Alert as MuiAlert
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PsychologyIcon from "@mui/icons-material/Psychology";
import { PsyAnswerDTO } from "../../types/alertType";
import { askPsyRecommendations, getPsychoAnswerByAthlete } from "../../services/coach/alerts/alertsService";


const colorPositive = (v?: number | null) =>
    v == null ? "text.secondary" : v <= 2 ? "error.main" : v === 3 ? "warning.main" : "success.main";
const colorNegative = (v?: number | null) =>
    v == null ? "text.secondary" : v >= 4 ? "error.main" : v === 3 ? "warning.main" : "success.main";

type Props = {
    open: boolean;
    onClose: () => void;
    sessionId: number;
    athleteId: number;
};

export default function PsychoAnswerDialog({ open, onClose, sessionId, athleteId }: Props) {
    const [loading, setLoading] = useState(false);
    const [answer, setAnswer] = useState<PsyAnswerDTO | null>(null);
    const [error, setError] = useState<string | null>(null);

    const [recoLoading, setRecoLoading] = useState(false);
    const [recoError, setRecoError] = useState<string | null>(null);
    const [recoText, setRecoText] = useState<string | null>(null);

    useEffect(() => {
        if (!open) return;
        (async () => {
            try {
                setLoading(true);
                setError(null);
                setRecoText(null);
                const data = await getPsychoAnswerByAthlete(sessionId, athleteId);
                if (!data) {
                    setError("Nenhuma resposta encontrada para este atleta nesta sessão.");
                    setAnswer(null);
                } else {
                    setAnswer(data);
                }
            } catch (e: any) {
                setError(e?.response?.data?.message ?? "Falha ao carregar a resposta.");
                setAnswer(null);
            } finally {
                setLoading(false);
            }
        })();
    }, [open, sessionId, athleteId]);

    const handleAskReco = async () => {
        if (!answer) return;
        setRecoError(null);
        setRecoText(null);
        try {
            setRecoLoading(true);
            const resp = await askPsyRecommendations({
                sessionId,
                athleteId,
                srpe: Number(answer.srpe ?? 0),
                fatigue: Number(answer.fatigue ?? 0),
                soreness: Number(answer.soreness ?? 0),
                mood: Number(answer.mood ?? 0),
                energy: Number(answer.energy ?? 0),
            });
            setRecoText(resp?.recommendations ?? "Any recommendations at the moment.");
        } catch (e: any) {
            setRecoError(e?.response?.data?.message ?? "Error loading recommendations.");
        } finally {
            setRecoLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle
                component="div"
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
                <Stack direction="row" alignItems="center" spacing={1} sx={{ width: "100%" }}>
                    <PsychologyIcon fontSize="small" />
                    Psychoemocional — Athletes Answers
                    <Box sx={{ flex: 1 }} />
                    <IconButton onClick={onClose}><CloseIcon /></IconButton>
                </Stack>
            </DialogTitle>
            <DialogContent dividers>
                {loading ? (
                    <Stack alignItems="center" sx={{ py: 6 }}><CircularProgress /></Stack>
                ) : error ? (
                    <MuiAlert severity="error" variant="outlined">{error}</MuiAlert>
                ) : !answer ? (
                    <Typography color="text.secondary" sx={{ textAlign: "center", py: 4 }}>
                        Nenhuma informação disponível.
                    </Typography>
                ) : (
                    <>
                        {/* Header atleta */}
                        <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems={{ xs: "flex-start", md: "center" }}>
                            <Stack direction="row" spacing={1.5} alignItems="center">
                                <Avatar src={answer.athletePhoto || undefined} alt={answer.athleteName} sx={{ width: 56, height: 56 }}>
                                    {answer.athleteName?.[0]?.toUpperCase()}
                                </Avatar>
                                <Box>
                                    <Typography variant="h6" fontWeight={800} sx={{ lineHeight: 1.1 }}>
                                        {answer.athleteName}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {answer.athleteEmail} {answer.athletePosition ? `• ${answer.athletePosition}` : ""}
                                    </Typography>
                                </Box>
                            </Stack>

                            <Box sx={{ flex: 1 }} />

                            <Stack direction="row" spacing={1} alignItems="center">
                                <Typography variant="body2" color="text.secondary">Enviado em:</Typography>
                                <Chip size="small" variant="outlined" label={answer.submittedAt ? new Date(answer.submittedAt).toLocaleString() : "—"} />
                            </Stack>
                        </Stack>

                        <Divider sx={{ my: 2 }} />

                        {/* Métricas */}
                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: { xs: "repeat(2, minmax(120px, 1fr))", sm: "repeat(3, minmax(140px, 1fr))", md: "repeat(5, minmax(160px, 1fr))" },
                                columnGap: 1.25,
                                rowGap: 1.25,
                            }}
                        >
                            <Metric label="sRPE" value={answer.srpe} color={colorNegative(answer.srpe)} />
                            <Metric label="Fatigue" value={answer.fatigue} color={colorNegative(answer.fatigue)} />
                            <Metric label="Soreness" value={answer.soreness} color={colorNegative(answer.soreness)} />
                            <Metric label="Mood" value={answer.mood} color={colorPositive(answer.mood)} />
                            <Metric label="Energy" value={answer.energy} color={colorPositive(answer.energy)} />
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        {/* Pedir recomendações */}
                        <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems={{ xs: "stretch", md: "center" }}>
                            <Button
                                color="success"
                                variant="contained"
                                onClick={handleAskReco}
                                disabled={recoLoading}
                                sx={{color: "white"}}
                            >
                                {recoLoading ? "Asking advice..." : "Ask AI advice"}
                            </Button>

                            {recoError && <MuiAlert severity="error" variant="outlined" sx={{ flex: 1 }}>{recoError}</MuiAlert>}
                        </Stack>

                        {recoText && (
                            <Box sx={{ mt: 2, p: 2, bgcolor: "background.paper", borderRadius: 2, border: theme => `1px solid ${theme.palette.divider}` }}>
                                <Typography variant="subtitle2" gutterBottom>Recomendations</Typography>
                                <Typography variant="body2" whiteSpace="pre-wrap">{recoText}</Typography>
                            </Box>
                        )}
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}

function Metric({ label, value, color }: { label: string; value?: number | null; color: string }) {
    return (
        <Box sx={{ p: 1.25, borderRadius: 2, border: theme => `1px solid ${theme.palette.divider}` }}>
            <Stack spacing={0.5} alignItems="center">
                <Typography variant="caption" color="text.secondary">{label}</Typography>
                <Typography variant="h6" sx={{ color, fontWeight: 800, lineHeight: 1 }}>
                    {value ?? "—"}
                </Typography>
            </Stack>
        </Box>
    );
}
