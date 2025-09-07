import { useEffect, useState } from "react";
import {
    Avatar, Box, Chip, Paper, Typography, Skeleton, Alert as MuiAlert,
    Stack, Tooltip, ButtonBase
} from "@mui/material";
import PsychologyIcon from "@mui/icons-material/Psychology";
import type { SxProps } from "@mui/system";
import { getPsychoAlerts } from "../../../services/coach/alerts/alertsService";
import type { PsychoAlert } from "../../../types/alertType";
import { useUserContext } from "../../../contexts/UserContext";
import PsychoAnswerDialog from "../../dialog/PsychoAnswerDialog";

type Props = { title?: string; sx?: SxProps };
type Risk = "LOW" | "CAUTION" | "HIGH";

const riskMeta: Record<Risk, { label: string; chipSx: SxProps }> = {
    LOW: { label: "Low Risk", chipSx: { bgcolor: "success.main", color: "success.contrastText" } },
    CAUTION: { label: "Caution", chipSx: { bgcolor: "warning.main", color: "warning.contrastText" } },
    HIGH: { label: "High Risk", chipSx: { bgcolor: "error.main", color: "error.contrastText" } },
};

const toRisk = (r?: string | null): Risk =>
    (r ?? "").toUpperCase() === "LOW" ? "LOW" :
        (r ?? "").toUpperCase() === "HIGH" ? "HIGH" : "CAUTION";

const colorPositive = (v?: number) => v == null ? "text.secondary" : v <= 2 ? "error.main" : v === 3 ? "warning.main" : "success.main";
const colorNegative = (v?: number) => v == null ? "text.secondary" : v >= 4 ? "error.main" : v === 3 ? "warning.main" : "success.main";

export default function PsychoemocionalAlerts({ title = "Psychoemocional — Alerts", sx }: Props) {
    const [items, setItems] = useState<PsychoAlert[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selected, setSelected] = useState<{ sessionId: number; athleteId: number } | null>(null);
    const { user } = useUserContext();

    const chipBaseSx = {
        borderRadius: 999,
        height: 28,
        "& .MuiChip-label": { px: 1.25, fontWeight: 700 }
    };

    useEffect(() => {
        if (!user?.id) return;
        (async () => {
            try {
                setLoading(true);
                setError(null);
                const result = await getPsychoAlerts({ coachId: user.id });
                setItems(result ?? []);
            } catch (err: any) {
                setError(err?.response?.data?.message ?? "Não foi possível carregar os alertas psicoemocionais.");
                setItems([]);
            } finally {
                setLoading(false);
            }
        })();
    }, [user?.id]);

    return (
        <Paper elevation={4} sx={{ p: { xs: 2, md: 2.5 }, borderRadius: 3, bgcolor: "background.default", ...sx }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
                <PsychologyIcon fontSize="small" />
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
                        const risk = riskMeta[toRisk(a.risk)];
                        const openDialog = () => {
                            setSelected({ sessionId: a.sessionId, athleteId: a.athleteId });
                            setDialogOpen(true);
                        };

                        return (
                            <ButtonBase
                                key={a.alertId}
                                onClick={openDialog}
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
                                    {/* esquerda */}
                                    <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0 }}>
                                        <Avatar src={a.athletePhoto || undefined} alt={a.athleteName} sx={{ width: 40, height: 40 }}>
                                            {a.athleteName?.[0]?.toUpperCase()}
                                        </Avatar>
                                        <Box sx={{ minWidth: 0 }}>
                                            <Typography variant="subtitle2" fontWeight={700} noWrap>{a.athleteName}</Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {a.date ? new Date(a.date).toLocaleDateString() : "—/—/—"}
                                            </Typography>
                                        </Box>
                                    </Stack>

                                    {/* centro */}
                                    <Box sx={{ flex: 1, minWidth: 0, pl: 5 }}>
                                        <Box
                                            sx={{
                                                display: "grid",
                                                gridTemplateColumns: {
                                                    xs: "repeat(2, minmax(68px, 1fr))",
                                                    sm: "repeat(3, minmax(72px, 1fr))",
                                                    md: "repeat(5, minmax(78px, 1fr))",
                                                },
                                                columnGap: 1,
                                                rowGap: 0.25,
                                            }}
                                        >
                                            <Metric label="sRPE" value={a.srpe} color={colorNegative(a.srpe)} />
                                            <Metric label="Fatigue" value={a.fatigue} color={colorNegative(a.fatigue)} />
                                            <Metric label="Soreness" value={a.soreness} color={colorNegative(a.soreness)} />
                                            <Metric label="Mood" value={a.mood} color={colorPositive(a.mood)} />
                                            <Metric label="Energy" value={a.energy} color={colorPositive(a.energy)} />
                                        </Box>
                                    </Box>

                                    <Stack
                                        spacing={0.75}
                                        alignItems={{ xs: "flex-start", md: "flex-end" }}
                                        sx={{ flexShrink: 0, minWidth: { md: 140 } }}
                                    >
                                        <Chip
                                            size="small"
                                            label={risk.label}
                                            sx={{ ...chipBaseSx, ...risk.chipSx }}
                                        />
                                        <Tooltip title="Aggregated Score">
                                            <Chip
                                                size="small"
                                                variant="outlined"
                                                label={`Total: ${a.total}`}
                                                sx={{ ...chipBaseSx, color: "text.primary", borderColor: "divider" }}
                                            />
                                        </Tooltip>
                                    </Stack>
                                </Stack>
                            </ButtonBase>
                        );
                    })}
                    <PsychoAnswerDialog
                        open={dialogOpen}
                        onClose={() => setDialogOpen(false)}
                        sessionId={selected?.sessionId ?? 0}
                        athleteId={selected?.athleteId ?? 0}
                    />
                </Box>
            )}
        </Paper>
    );
}


function Metric({ label, value, color }: { label: string; value?: number; color: string }) {
    return (
        <Stack spacing={0.25} alignItems="center" sx={{ minWidth: 0 }}>
            <Typography variant="caption" color="text.secondary" noWrap>
                {label}
            </Typography>
            <Typography variant="body2" sx={{ color, fontWeight: 600 }}>
                {value ?? "—"}
            </Typography>
        </Stack>
    );
}