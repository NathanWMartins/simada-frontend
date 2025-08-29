import { useEffect, useState } from "react";
import {
    Avatar, Box, Paper, Typography, useTheme, Skeleton, Alert as MuiAlert,
} from "@mui/material";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import { useUserContext } from "../../contexts/UserContext";
import { getPerformanceAlerts } from "../../services/trainer/alerts/alertsService";
import { PerformanceAlert } from "../../types/alertType";

type Props = {
    title?: string;
    rangeLabel?: string;
    days?: number;
    limit?: number;
};

export default function AlertsPanel({
    title = "AI Performance Alerts",
    rangeLabel = "Last 7 days",
    days = 7,
    limit = 10,
}: Props) {
    const theme = useTheme();
    const { user } = useUserContext();
    const [alerts, setAlerts] = useState<PerformanceAlert[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!user?.id) return;
        (async () => {
            try {
                setLoading(true);
                setError(null);
                const result = await getPerformanceAlerts({ trainerId: user.id, days, limit });
                setAlerts(result);
            } catch (e: any) {
                console.error("Erro ao buscar performance alerts:", e);
                setError(e?.response?.data?.message ?? "Não foi possível carregar os alertas.");
                setAlerts([]);
            } finally {
                setLoading(false);
            }
        })();
    }, [user?.id, days, limit]);

    const SkeletonRow = () => (
        <Box sx={{
            display: "flex", alignItems: "center", gap: 2, p: 1.5, borderRadius: 2,
            bgcolor: theme.palette.background.paper, height: 80
        }}>
            <Skeleton variant="circular" width={44} height={44} />
            <Box sx={{ minWidth: 160, flexShrink: 0 }}>
                <Skeleton variant="text" width={100} />
                <Skeleton variant="text" width={80} />
            </Box>
            <Box sx={{ flex: 1 }}>
                <Skeleton variant="text" width="30%" />
                <Skeleton variant="text" width="60%" />
            </Box>
            <Box sx={{ textAlign: "right", minWidth: 90 }}>
                <Skeleton variant="text" width={50} />
                <Skeleton variant="text" width={40} />
                <Skeleton variant="text" width={30} />
            </Box>
        </Box>
    );

    return (
        <Paper elevation={4} sx={{
            p: 2, borderRadius: 3, position: "relative", maxWidth: "100%", mx: 2,
            bgcolor: theme.palette.background.default
        }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <WarningAmberRoundedIcon fontSize="small" />
                    <Typography variant="subtitle1" fontWeight={700}>{title}</Typography>
                </Box>
                <Typography variant="caption" color="text.secondary">{rangeLabel}</Typography>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mt: 3 }}>
                {loading ? (
                    <>
                        <SkeletonRow />
                        <SkeletonRow />
                        <SkeletonRow />
                    </>
                ) : error ? (
                    <MuiAlert severity="error" variant="outlined">{error}</MuiAlert>
                ) : alerts.length === 0 ? (
                    <Typography color="text.secondary" sx={{ textAlign: "center", py: 4 }}>
                        Nenhum alerta encontrado.
                    </Typography>
                ) : (
                    alerts.map((a, i) => (
                        <Box
                            key={a.id ?? `${a.athleteName}-${i}`}
                            sx={{
                                display: "flex", alignItems: "center", gap: 2, p: 1.5, borderRadius: 2,
                                bgcolor: theme.palette.background.paper, height: 80
                            }}
                        >
                            {/* coluna: avatar + nome + data */}
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 160 }}>
                                <Avatar
                                    src={a.athletePhoto || undefined}
                                    alt={a.athleteName || "Atleta"}
                                    sx={{ width: 44, height: 44 }}
                                />
                                <Box>
                                    <Typography variant="subtitle2" fontWeight={700}>
                                        {a.athleteName || "Nome"}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {a.date ? new Date(a.date).toLocaleDateString("pt-BR") : "--/--/----"}
                                    </Typography>
                                </Box>
                            </Box>

                            {/* coluna: tipo + mensagem */}
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="body2" fontWeight={700} sx={{ mb: 0.25 }}>
                                    {a.type || "Tipo do alerta"}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {a.message || "Mensagem do alerta…"}
                                </Typography>
                            </Box>

                            {/* coluna: valores/variação */}
                            <Box sx={{ textAlign: "right", minWidth: 90 }}>
                                <Typography variant="caption" color="text.secondary">
                                    {a.unit ? (a.prevValue != null ? `${a.prevValue} ${a.unit}` : "—") : (a.prevValue ?? "")}
                                </Typography>
                                <Typography variant="body2">
                                    {a.unit ? (a.currValue != null ? `${a.currValue} ${a.unit}` : "—") : (a.currValue ?? "")}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    fontWeight={700}
                                    sx={{ mt: 0.5 }}
                                    color={
                                        typeof a.percent === "number"
                                            ? a.percent >= 0 ? "success.main" : "error.main"
                                            : "text.secondary"
                                    }
                                >
                                    {typeof a.percent === "number"
                                        ? `${a.percent > 0 ? "+" : ""}${a.percent}%`
                                        : "—"}
                                </Typography>
                            </Box>
                        </Box>
                    ))
                )}
            </Box>
        </Paper>
    );
}
