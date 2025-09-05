import { useEffect, useState } from "react";
import { Avatar, Box, Chip, Paper, Typography, Skeleton, Alert as MuiAlert } from "@mui/material";
import PsychologyIcon from "@mui/icons-material/Psychology";
import type { SxProps } from "@mui/system";
import { getPsychoAlerts } from "../../../services/trainer/alerts/alertsService";
import type { PsychoAlert } from "../../../types/alertType";
import { useUserContext } from "../../../contexts/UserContext";

type Props = { days?: number; limit?: number; title?: string; sx?: SxProps };

// status/risk possível no alerta psico
type Risk = "LOW" | "CAUTION" | "HIGH";

const riskMeta: Record<
    Risk,
    { label: string; chipSx: SxProps; valueColor: "text.secondary" | "warning.main" | "error.main" }
> = {
    LOW: {
        label: "Low Risk",
        chipSx: { bgcolor: "success.main", color: "success.contrastText" },
        valueColor: "text.secondary",
    },
    CAUTION: {
        label: "Caution Required",
        chipSx: { bgcolor: "warning.main", color: "warning.contrastText" },
        valueColor: "warning.main",
    },
    HIGH: {
        label: "High Risk",
        chipSx: { bgcolor: "error.main", color: "error.contrastText" },
        valueColor: "error.main",
    },
};

function toRisk(status?: string | null): Risk {
    switch ((status ?? "").toUpperCase()) {
        case "LOW":
            return "LOW";
        case "HIGH":
            return "HIGH";
        case "CAUTION":
            return "CAUTION";
        default:
            return "CAUTION";
    }
}

export default function PsicoemocionalAlerts({
    days = 7,
    limit = 5,
    title = "Psicoemocional avaliation",
    sx,
}: Props) {
    const [items, setItems] = useState<PsychoAlert[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { user } = useUserContext();

    useEffect(() => {
        if (!user?.id) return;
        (async () => {
            try {
                setLoading(true);
                setError(null);
                const result = await getPsychoAlerts({ trainerId: user.id, days, limit });
                setItems(result);
            } catch (err: any) {
                console.error("Erro ao buscar psico alerts:", err);
                setError(err?.response?.data?.message ?? "Não foi possível carregar os alertas psicoemocionais.");
                setItems([]);
            } finally {
                setLoading(false);
            }
        })();
    }, [days, limit, user?.id]);

    return (
        <Paper
            elevation={4}
            sx={{
                p: 2.5,
                borderRadius: 3,
                position: "relative",
                bgcolor: "background.default",
                ...sx,
            }}
        >
            {/* Header */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
                <PsychologyIcon fontSize="small" />
                <Typography variant="subtitle1" fontWeight={700}>
                    {title}
                </Typography>
            </Box>

            {/* Conteúdo */}
            {loading ? (
                // skeletons
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
                    {[0, 1, 2].map((i) => (
                        <Box
                            key={i}
                            sx={{
                                p: 1.25,
                                borderRadius: 2,
                                bgcolor: "background.paper",
                                display: "flex",
                                alignItems: "center",
                                gap: 2,
                                height: 80,
                            }}
                        >
                            <Skeleton variant="circular" width={44} height={44} />
                            <Box sx={{ flex: 1 }}>
                                <Skeleton variant="text" width="40%" />
                                <Skeleton variant="text" width="60%" />
                            </Box>
                        </Box>
                    ))}
                </Box>
            ) : error ? (
                // erro
                <MuiAlert severity="error" variant="outlined">
                    {error}
                </MuiAlert>
            ) : items.length === 0 ? (
                // nenhum alerta
                <Typography color="text.secondary" sx={{ textAlign: "center", py: 4 }}>Nenhum alerta encontrado.</Typography>
            ) : (
                // lista de alertas
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
                    {items.map((a, i) => {
                        const risk = riskMeta[toRisk(a.status)];

                        return (
                            <Box
                                key={a.id ?? `${a.athleteName}-${i}`}
                                sx={{
                                    p: 1.25,
                                    borderRadius: 2,
                                    bgcolor: "background.paper",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 2,
                                }}
                            >
                                {/* Coluna esquerda */}
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 180 }}>
                                    <Avatar src={a.athletePhoto || undefined} alt={a.athleteName} sx={{ width: 44, height: 44 }} />
                                    <Box>
                                        <Typography variant="subtitle2" fontWeight={700}>
                                            {a.athleteName}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {a.date ? new Date(a.date).toLocaleDateString("pt-BR") : "—/—/—"}
                                        </Typography>
                                    </Box>
                                </Box>

                                {/* Coluna central */}
                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                    <Box sx={{ display: "grid", gridTemplateColumns: "120px 1fr", columnGap: 2, rowGap: 0.25 }}>
                                        <Typography variant="body2" color="text.secondary">
                                            Fatigued
                                        </Typography>
                                        <Typography variant="body2" color={risk.valueColor}>
                                            {a.fatigue ?? "—"}
                                        </Typography>

                                        <Typography variant="body2" color="text.secondary">
                                            Humor
                                        </Typography>
                                        <Typography variant="body2" color={risk.valueColor}>
                                            {a.mood ?? "—"}
                                        </Typography>

                                        <Typography variant="body2" color="text.secondary">
                                            Hours Slept
                                        </Typography>
                                        <Typography variant="body2" color={risk.valueColor}>
                                            {typeof a.hoursSlept === "number" ? `${a.hoursSlept} hours` : "—"}
                                        </Typography>
                                    </Box>
                                </Box>

                                {/* Coluna direita */}
                                <Box sx={{ minWidth: 120, display: "flex", justifyContent: "flex-end" }}>
                                    <Chip size="small" label={risk.label} sx={{ borderRadius: 999, px: 1.5, fontWeight: 700, ...risk.chipSx }} />
                                </Box>
                            </Box>
                        );
                    })}
                </Box>
            )}
        </Paper>
    );
}
