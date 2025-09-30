import { useEffect, useState, useMemo } from "react";
import {
    Avatar, Box, Chip, Paper, Typography, Skeleton, Alert as MuiAlert,
    Stack, Tooltip, ButtonBase,
    IconButton,
    Snackbar,
    Alert
} from "@mui/material";
import InsightsIcon from "@mui/icons-material/Insights";
import { useTheme, type SxProps } from "@mui/system";
import type { TrainingLoadAlert, TLLabel } from "../../../types/alertType";
import { useUserContext } from "../../../contexts/UserContext";
import { deleteTrainingLoadAlert, getTrainingLoadAlerts } from "../../../services/coach/alerts/performanceAlertService";
import PerformanceAlertDialog from "../../dialog/PerformanceAlertDialog";
import { DeleteOutline } from "@mui/icons-material";

type Props = { title?: string; sx?: SxProps; athleteId?: number };
type ChipColor = "default" | "success" | "warning" | "error" | "info";

const labelColor = (label?: TLLabel | null): ChipColor => {
    switch (label) {
        case "unavailable": return "default";
        case "low":
        case "optimal":
        case "healthy":
            return "success";
        case "stable":
            return "info";
        case "attention":
            return "warning";
        case "risk":
        case "high_risk":
        case "sharp_drop":
            return "error";
        default:
            return "default";
    }
};

const fmt = (v?: number | null, digits = 2) =>
    (v == null || Number.isNaN(v)) ? "—" : Number(v).toFixed(digits);

const datefmt = (iso?: string | null) => {
    if (!iso) return "—/—/—";
    const d = new Date(iso);
    return Number.isNaN(d.getTime()) ? "—/—/—" : d.toLocaleDateString();
};

export default function PerformanceAlerts({ title = "Training Load — Alerts", sx, athleteId }: Props) {
    const [items, setItems] = useState<TrainingLoadAlert[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { user } = useUserContext();
    const theme = useTheme();
    const [dlgOpen, setDlgOpen] = useState(false);
    const [dlgCtx, setDlgCtx] = useState<{ sessionId: number; athleteId: number } | null>(null);
    const [snackbar, setSnackbar] = useState<{ open: boolean; severity: "success" | "error"; message: string }>({
        open: false, severity: "success", message: ""
    });

    const chipBaseSx = {
        borderRadius: 999,
        height: 26,
        "& .MuiChip-label": { px: 1.25, fontWeight: 700, fontSize: 12 }
    } as const;

    useEffect(() => {
        if (!user?.id) return;
        (async () => {
            try {
                setLoading(true);
                setError(null);
                const result = await getTrainingLoadAlerts({
                    coachId: user.id,
                    athleteId,
                });
                setItems(result ?? []);
            } catch (err: any) {
                setError(err?.response?.data?.message ?? "Não foi possível carregar os alertas de performance.");
                setItems([]);
            } finally {
                setLoading(false);
            }
        })();
    }, [user?.id, athleteId]);

    const handleDeleteAlert = async (alertId?: number) => {
        if (!alertId) return;
        try {
            await deleteTrainingLoadAlert(alertId, user?.id || 0);
            setItems((prev) => prev.filter((item) => item.id !== alertId));
            setSnackbar({
                open: true, severity: "success",
                message: "Alert deleted successfully."
            });
        } catch (e) {
            console.error("Error deleting alert", e);
        }
    };

    const handleCloseSnackbar = () => setSnackbar(s => ({ ...s, open: false }));

    return (
        <Paper elevation={4} sx={{ p: { xs: 2, md: 2.5 }, borderRadius: 3, bgcolor: theme.palette.background.default, ...sx }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
                <InsightsIcon fontSize="small" />
                <Typography variant="subtitle1" fontWeight={700}>{title}</Typography>
            </Box>

            {loading ? (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
                    {[0, 1, 2].map(i => (
                        <Box key={i} sx={{ p: 1.25, borderRadius: 2, bgcolor: "background.paper", display: "flex", alignItems: "center", gap: 1.5, minHeight: 76 }}>
                            <Skeleton variant="circular" width={40} height={40} />
                            <Box sx={{ flex: 1 }}>
                                <Skeleton variant="text" width="40%" />
                                <Skeleton variant="text" width="60%" />
                            </Box>
                            <Skeleton variant="rounded" width={80} height={24} />
                        </Box>
                    ))}
                </Box>
            ) : error ? (
                <MuiAlert severity="error" variant="outlined">{error}</MuiAlert>
            ) : items.length === 0 ? (
                <Typography color="text.secondary" sx={{ textAlign: "center", py: 4 }}>Nenhum alerta encontrado.</Typography>
            ) : (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.0 }}>
                    {items.map((a) => {
                        const openDialog = (a: TrainingLoadAlert) => {
                            if (!a.athleteId || !a.sessionId) return;
                            setDlgCtx({ sessionId: Number(a.sessionId || 0), athleteId: a.athleteId });
                            setDlgOpen(true);
                        };

                        return (
                            <ButtonBase
                                key={a.id}
                                onClick={() => openDialog(a)}
                                sx={{
                                    textAlign: "left",
                                    width: "100%",
                                    borderRadius: 2,
                                    p: { xs: 1.0, md: 1.25 },
                                    bgcolor: "background.paper",
                                    "&:hover": { bgcolor: "action.hover" },
                                    alignItems: "stretch",
                                }}
                            >
                                <Stack
                                    direction={{ xs: "column", md: "row" }}
                                    spacing={{ xs: 1, md: 1.25 }}
                                    sx={{ width: "100%" }}
                                    alignItems={{ xs: "stretch", md: "center" }}
                                >
                                    {/* Esquerda: atleta + janela (qwStart) */}
                                    <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0 }}>
                                        <Avatar src={a.athletePhoto || undefined} alt={a.athleteName ?? String(a.athleteId)} sx={{ width: 40, height: 40 }}>
                                            {(a.athleteName ?? String(a.athleteId))?.[0]?.toUpperCase?.()}
                                        </Avatar>
                                        <Box sx={{ minWidth: 0 }}>
                                            <Typography variant="subtitle2" fontWeight={700} noWrap>
                                                {a.athleteName ?? `Athlete #${a.athleteId}`}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {a.qwStart ? `Week of ${datefmt(a.qwStart)}` : (a.createdAt ? datefmt(a.createdAt) : "—/—/—")}
                                            </Typography>
                                        </Box>
                                    </Stack>

                                    {/* Centro: métricas + chips de label */}
                                    <Box sx={{ flex: 1, minWidth: 0, pl: { md: 5 } }}>
                                        <Box
                                            sx={{
                                                display: "grid",
                                                gridTemplateColumns: {
                                                    xs: "repeat(2, minmax(120px, 1fr))",
                                                    sm: "repeat(4, minmax(130px, 1fr))",
                                                    md: "repeat(4, minmax(150px, 1fr))",
                                                },
                                                columnGap: 1,
                                                rowGap: 0.5,
                                            }}
                                        >
                                            <MetricWithChip
                                                label="ACWR"
                                                value={fmt(a.acwr)}
                                                chip={a.acwrLabel}
                                            />
                                            <MetricWithChip
                                                label="%↑ QW"
                                                value={fmt(a.pctQwUp, 1) + (a.pctQwUp != null ? "%" : "")}
                                                chip={a.pctQwUpLabel}
                                            />
                                            <MetricWithChip
                                                label="Monotony"
                                                value={fmt(a.monotony)}
                                                chip={a.monotonyLabel}
                                            />
                                            <MetricWithChip
                                                label="Strain"
                                                value={fmt(a.strain)}
                                                chip={a.strainLabel}
                                            />
                                        </Box>
                                    </Box>

                                    {/* Direita: destaque principal + botão de excluir */}
                                    <Stack
                                        direction="row"
                                        spacing={1}
                                        alignItems="center"
                                        sx={{ flexShrink: 0, minWidth: { md: 160 }, justifyContent: { xs: "flex-start", md: "flex-end" } }}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <MainRiskChip a={a} chipBaseSx={chipBaseSx} />

                                        <Tooltip title="Delete alert">
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() => handleDeleteAlert(a.id)}
                                            >
                                                <DeleteOutline fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </Stack>

                                </Stack>
                            </ButtonBase>
                        );
                    })}
                </Box>
            )}
            {dlgCtx && (
                <PerformanceAlertDialog
                    open={dlgOpen}
                    onClose={() => setDlgOpen(false)}
                    sessionId={dlgCtx.sessionId}
                    athleteId={dlgCtx.athleteId}
                />
            )}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%", whiteSpace: "pre-line" }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Paper>
    );
}

function MetricWithChip({ label, value, chip }: { label: string; value: string; chip?: TLLabel | null }) {
    const color = labelColor(chip);
    const pretty = useMemo(() => {
        if (!chip) return "—";
        return chip.replaceAll("_", " ").replace(/^./, c => c.toUpperCase());
    }, [chip]);

    return (
        <Stack spacing={0.5} alignItems="flex-start" sx={{ minWidth: 0 }}>
            <Typography variant="caption" color="text.secondary" noWrap>{label}</Typography>
            <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="body2" sx={{ fontWeight: 700 }}>{value}</Typography>
                <Chip size="small" color={color === "default" ? undefined : color} label={pretty} />
            </Stack>
        </Stack>
    );
}

function MainRiskChip({ a, chipBaseSx }: { a: TrainingLoadAlert; chipBaseSx: SxProps }) {
    const labels = [a.acwrLabel, a.pctQwUpLabel, a.monotonyLabel, a.strainLabel].filter(Boolean) as TLLabel[];
    const hasHigh =
        labels.includes("risk") || labels.includes("high_risk") || labels.includes("sharp_drop");
    const hasWarn = labels.includes("attention");

    let color: "success" | "warning" | "error" | "default" | "info" = "default";
    if (hasHigh) color = "error";
    else if (hasWarn) color = "warning";
    else if (labels.some(l => l === "healthy" || l === "optimal" || l === "low")) color = "success";
    else if (labels.includes("stable")) color = "info";

    const label =
        color === "error" ? "High Risk" :
            color === "warning" ? "Attention" :
                color === "success" ? "Good" :
                    color === "info" ? "Stable" : "—";

    return (
        <Chip
            size="small"
            label={label}
            sx={{ ...chipBaseSx, ...(color === "default" ? {} : { bgcolor: `${color}.main`, color: `${color}.contrastText` }) }}
        />
    );
}
