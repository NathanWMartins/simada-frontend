import { useEffect, useState } from "react";
import { Avatar, Box, Paper, Typography, useTheme } from "@mui/material";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import { Alert } from "../../services/types/types";
import { getAlerts } from "../../services/alerts/alertsService";

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
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                setError(null);
                const result = await getAlerts({ days, limit });
                setAlerts(result);
            } catch (e: any) {
                setError(e?.response?.data?.message ?? "Não foi possível carregar os alertas.");
                setAlerts([]);
            } finally {
                setLoading(false);
            }
        })();
    }, [days, limit]);

    return (
        <Paper elevation={4} sx={{
            p: 2, borderRadius: 3, position: "relative", maxWidth: 900, mx: 11,
            bgcolor: theme.palette.background.default
        }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <WarningAmberRoundedIcon fontSize="small" />
                    <Typography variant="subtitle1" fontWeight={700}>{title}</Typography>
                </Box>
                <Typography variant="caption" color="text.secondary">{rangeLabel}</Typography>
            </Box>

            <Box sx={{
                display: "flex", flexDirection: "column", gap: 1.5,
            }}>
                {(alerts.length ? alerts : Array(3 ).fill(null)).map((a, i) => (
                    <Box
                        key={a?.id ?? i}
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            p: 1.5,
                            borderRadius: 2,
                            bgcolor: theme.palette.background.paper,
                        }}
                    >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 160 }}>
                            <Avatar
                                src={a?.athletePhoto || undefined}
                                alt={a?.athleteName || "Atleta"}
                                sx={{ width: 44, height: 44 }}
                            />
                            <Box>
                                <Typography variant="subtitle2" fontWeight={700}>
                                    {a?.athleteName || "Nome"}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {a?.date ? new Date(a.date).toLocaleDateString("pt-BR") : "--/--/----"}
                                </Typography>
                            </Box>
                        </Box>

                        <Box sx={{ flex: 1 }}>
                            <Typography variant="body2" fontWeight={700} sx={{ mb: 0.25 }}>
                                {a?.type || "Tipo do alerta"}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {a?.message || "Mensagem do alerta…"}
                            </Typography>
                        </Box>

                        <Box sx={{ textAlign: "right", minWidth: 90 }}>
                            <Typography variant="caption" color="text.secondary">
                                {a?.unit ? `${a.prevValue ?? 0}${a.unit}` : a?.prevValue ?? ""}
                            </Typography>
                            <Typography variant="body2">
                                {a?.unit ? `${a?.currValue ?? 0}${a.unit}` : a?.currValue ?? ""}
                            </Typography>
                            <Typography
                                variant="body2"
                                fontWeight={700}
                                sx={{ mt: 0.5 }}
                                color={
                                    typeof a?.percent === "number"
                                        ? a!.percent! >= 0 ? "success.main" : "error.main"
                                        : "text.secondary"
                                }
                            >
                                {typeof a?.percent === "number" ? `${a.percent > 0 ? "+" : ""}${a.percent}%` : "0%"}
                            </Typography>
                        </Box>
                    </Box>
                ))}
            </Box>
        </Paper>
    );
}
