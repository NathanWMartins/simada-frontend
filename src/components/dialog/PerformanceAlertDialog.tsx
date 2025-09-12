import { useEffect, useState, useMemo } from "react";
import {
    Avatar, Box, Button, Chip, Dialog, DialogContent, DialogTitle,
    Divider, IconButton, Stack, Typography, CircularProgress, Alert as MuiAlert
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import InsightsIcon from "@mui/icons-material/Insights";
import type { TLAnswerDTO, TLLabel } from "../../types/alertType";
import { askPerfRecommendations, getTrainingLoadAnswerByAthlete } from "../../services/coach/alerts/performanceAlertService";

type Props = {
    open: boolean;
    onClose: () => void;
    sessionId: number;
    athleteId: number;
};

const datefmt = (iso?: string | null) => {
    if (!iso) return "—";
    const d = new Date(iso);
    return Number.isNaN(d.getTime()) ? "—" : d.toLocaleString();
};

const prettyLabel = (label?: TLLabel | null) =>
    (label || "—").replaceAll("_", " ").replace(/^./, c => c.toUpperCase());

const chipColor = (label?: TLLabel | null):
    "default" | "success" | "warning" | "error" | "info" => {
    switch (label) {
        case "indisponível": return "default";
        case "baixo":
        case "ótimo":
        case "saudável":
            return "success";
        case "estável":
            return "info";
        case "atenção":
            return "warning";
        case "risco":
        case "alto_risco":
        case "queda_forte":
            return "error";
        default:
            return "default";
    }
};

export default function PerformanceAlertDialog({ open, onClose, sessionId, athleteId }: Props) {
    const [loading, setLoading] = useState(false);
    const [answer, setAnswer] = useState<TLAnswerDTO | null>(null);
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
                const data = await getTrainingLoadAnswerByAthlete(athleteId);
                if (!data) {
                    setError("Error.");
                    setAnswer(null);
                } else {
                    setAnswer(data);
                }
            } catch (e: any) {
                setError(e?.response?.data?.message ?? "Falha ao carregar os dados de performance.");
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
            const resp = await askPerfRecommendations({
                sessionId,
                athleteId,
                acwr: Number(answer.acwr || 0),
                monotony: Number(answer.monotony || 0),
                strain: Number(answer.strain || 0),
                pctQwUp: Number(answer.pctQwUp || 0),
            });
            setRecoText(resp.recommendations || "No recommendations at the moment.");
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
                    <InsightsIcon fontSize="small" />
                    Training Load — Athlete Detail
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
                        Any info.
                    </Typography>
                ) : (
                    <>
                        {/* Header do atleta */}
                        <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems={{ xs: "flex-start", md: "center" }}>
                            <Stack direction="row" spacing={1.5} alignItems="center">
                                <Avatar src={answer.athletePhoto || undefined} alt={answer.athleteName || ""} sx={{ width: 56, height: 56 }}>
                                    {answer.athleteName?.[0]?.toUpperCase?.()}
                                </Avatar>
                                <Box>
                                    <Typography variant="h6" fontWeight={800} sx={{ lineHeight: 1.1 }}>
                                        {answer.athleteName}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {answer.athleteEmail}
                                        {answer.athletePosition ? ` • ${answer.athletePosition}` : ""}
                                        {answer.athleteNationality ? ` • ${answer.athleteNationality}` : ""}
                                    </Typography>
                                </Box>
                            </Stack>

                            <Box sx={{ flex: 1 }} />

                            <Stack spacing={0.75} alignItems={{ xs: "flex-start", md: "flex-end" }}>
                                <Chip
                                    size="small"
                                    variant="outlined"
                                    label={answer.qwStart ? `Week of ${new Date(answer.qwStart).toLocaleDateString()}` : "—"}
                                />
                                <Chip
                                    size="small"
                                    variant="outlined"
                                    label={answer.createdAt ? `Created at ${datefmt(answer.createdAt)}` : "—"}
                                />
                            </Stack>
                        </Stack>

                        <Divider sx={{ my: 2 }} />

                        {/* Métricas + Labels */}
                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: { xs: "repeat(2, minmax(160px, 1fr))", md: "repeat(4, minmax(180px, 1fr))" },
                                gap: 1.25,
                            }}
                        >
                            <MetricWithLabel
                                title="ACWR"
                                value={answer.acwr}
                                label={answer.acwrLabel}
                            />
                            <MetricWithLabel
                                title="%↑ QW"
                                value={answer.pctQwUp}
                                valueSuffix={answer.pctQwUp != null ? "%" : ""}
                                label={answer.pctQwUpLabel}
                            />
                            <MetricWithLabel
                                title="Monotony"
                                value={answer.monotony}
                                label={answer.monotonyLabel}
                            />
                            <MetricWithLabel
                                title="Strain"
                                value={answer.strain}
                                label={answer.strainLabel}
                            />
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        {/* Ask AI recommendations */}
                        <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems={{ xs: "stretch", md: "center" }}>
                            <Button
                                color="success"
                                variant="contained"
                                onClick={handleAskReco}
                                disabled={recoLoading}
                                sx={{ color: "white" }}
                            >
                                {recoLoading ? "Asking recommendations..." : "Ask AI recommendations"}
                            </Button>

                            {/* Se quiser chamar outro Dialog (psicoAlertDialog), ele seria aberto aqui */}
                            {/* TODO: abrir psicoAlertDialog ou um dialog de performance detalhado com séries históricas */}
                            {recoError && <MuiAlert severity="error" variant="outlined" sx={{ flex: 1 }}>{recoError}</MuiAlert>}
                        </Stack>

                        {recoText && (
                            <Box sx={{ mt: 2, p: 2, bgcolor: "background.paper", borderRadius: 2, border: theme => `1px solid ${theme.palette.divider}` }}>
                                <Typography variant="subtitle2" gutterBottom>Recommendations</Typography>
                                <Typography variant="body2" whiteSpace="pre-wrap">{recoText}</Typography>
                            </Box>
                        )}
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}

function MetricWithLabel({
    title,
    value,
    valueSuffix = "",
    label,
}: {
    title: string;
    value?: number | null;
    valueSuffix?: string;
    label?: TLLabel | null;
}) {
    const color = chipColor(label);
    const displayVal = useMemo(() => {
        if (value == null || Number.isNaN(value as any)) return "—";
        const num = Number(value);
        const fixed = title === "%↑ QW" ? num.toFixed(1) : num.toFixed(2);
        return `${fixed}${valueSuffix}`;
    }, [value, valueSuffix, title]);

    return (
        <Box sx={{ p: 1.25, borderRadius: 2, border: theme => `1px solid ${theme.palette.divider}` }}>
            <Stack spacing={0.75} alignItems="flex-start">
                <Typography variant="caption" color="text.secondary">{title}</Typography>
                <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1 }}>{displayVal}</Typography>
                <Chip
                    size="small"
                    color={color === "default" ? undefined : color}
                    label={prettyLabel(label)}
                />
            </Stack>
        </Box>
    );
}
