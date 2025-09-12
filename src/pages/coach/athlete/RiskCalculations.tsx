import React, { useEffect, useMemo, useState } from "react";
import {
    Alert, Box, CircularProgress, Divider,
    Paper, Stack, Snackbar, Typography, useTheme, ToggleButtonGroup, ToggleButton
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/en";
import HeaderHomeCoach from "../../../components/header/HeaderHomeCoach";
import { SwitchLightDarkMode } from "../../../components/common";
import { useParams } from "react-router-dom";
import { useAthleteRisk } from "../../../hooks/useAthleteRisk";
import {
    Line, LineChart, ResponsiveContainer, Tooltip as RTooltip, XAxis, YAxis, Legend, CartesianGrid,
} from "recharts";
import { RiskMetricKey } from "../../../services/coach/athletes/athleteRiskService";
import { getAthleteProfile } from "../../../services/athlete/athleteService";
import { SnackbarState } from "../../../types/types";

dayjs.locale("en");

const metricLabels: Record<RiskMetricKey, string> = {
    acwr: "ACWR",
    monotony: "Monotony",
    strain: "Tension",
};

export default function RiskCalculationsCoach() {
    const theme = useTheme();
    const { athleteId } = useParams();
    const id = Number(athleteId);

    const [fromM, setFromM] = useState<Dayjs | null>(dayjs().subtract(2, "month").startOf("month"));
    const [toM, setToM] = useState<Dayjs | null>(dayjs().endOf("month"));
    const [selected, setSelected] = useState<RiskMetricKey[]>(["acwr", "monotony", "strain"]);
    const [athleteName, setAthleteName] = useState<string>("");

    const [snackbar, setSnackbar] = useState<SnackbarState>({
        open: false,
        message: "",
        severity: "error",
    });

    const handleCloseSnackbar = () => {
        setSnackbar((prev) => ({ ...prev, open: false }));
    };

    const fromStr = fromM?.format("YYYY-MM") ?? undefined;
    const toStr = toM?.format("YYYY-MM") ?? undefined;

    const { loading, error, points } = useAthleteRisk(id, fromStr, toStr, selected);

    useEffect(() => {
        if (!id) return;
        (async () => {
            try {
                const profile = await getAthleteProfile(id);
                setAthleteName(profile.name);
            } catch {
                setAthleteName("");
            }
        })();
    }, [id]);

    const chartData = useMemo(
        () => points.map(p => ({
            date: dayjs(p.date).format("DD/MM"),
            acwr: p.acwr ?? null,
            monotony: p.monotony ?? null,
            strain: p.strain ?? null,
        })),
        [points]
    );

    // estatísticas simples (média no período)
    const stats = useMemo(() => {
        const calc = (key: RiskMetricKey) => {
            const arr = points.map(p => p[key]).filter((v): v is number => typeof v === "number");
            if (!arr.length) return null;
            const sum = arr.reduce((a, b) => a + b, 0);
            return +(sum / arr.length).toFixed(2);
        };
        return {
            acwr: calc("acwr"),
            monotony: calc("monotony"),
            strain: calc("strain"),
        };
    }, [points]);

    return (
        <Box sx={{ bgcolor: theme.palette.background.paper, minHeight: "100vh" }}>
            <HeaderHomeCoach />

            <Box sx={{ px: 8, pt: 4, pb: 8 }}>
                {/* Banner */}
                <Paper elevation={4} sx={{ position: "relative", mb: 2, borderRadius: 3, overflow: "hidden", bgcolor: "transparent" }}>
                    <Box
                        sx={{
                            px: 2.5, py: 1.5, display: "flex", alignItems: "center", justifyContent: "space-between",
                            background: "linear-gradient(90deg, #1db954 0%, #17a24a 50%, #12903f 100%)",
                        }}
                    >
                        <Typography variant="h6" fontWeight={700} color="#fff">
                            Risk & Injury Calculations
                            {athleteName ? ` — ${athleteName}` : ""}
                        </Typography>
                    </Box>
                </Paper>

                {/* Filtros */}
                <Paper elevation={4} sx={{ borderRadius: 3, p: 2, mb: 2, bgcolor: theme.palette.background.default }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en">
                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: { xs: "1fr", md: "220px 220px 1fr" },
                                gap: 2,
                                alignItems: "center",
                            }}
                        >
                            <DatePicker
                                label="From (month)"
                                views={["year", "month"]}
                                value={fromM}
                                onChange={(v) => setFromM(v)}
                                slotProps={{ textField: { size: "small", fullWidth: true, InputLabelProps: { shrink: true } } }}
                            />
                            <DatePicker
                                label="To (month)"
                                views={["year", "month"]}
                                value={toM}
                                minDate={fromM ?? undefined}
                                onChange={(v) => setToM(v)}
                                slotProps={{ textField: { size: "small", fullWidth: true, InputLabelProps: { shrink: true } } }}
                            />

                            <Stack direction="row" spacing={1} sx={{ justifyContent: { xs: "flex-start", md: "flex-end" } }}>
                                <ToggleButtonGroup
                                    value={selected}
                                    onChange={(_, val) => val?.length && setSelected(val)}
                                    size="small"
                                >
                                    <ToggleButton value="acwr">ACWR</ToggleButton>
                                    <ToggleButton value="monotony">Monotony</ToggleButton>
                                    <ToggleButton value="strain">Tension</ToggleButton>
                                </ToggleButtonGroup>
                            </Stack>
                        </Box>
                    </LocalizationProvider>
                </Paper>

                {/* Conteúdo principal */}
                <Paper elevation={4} sx={{ borderRadius: 3, p: 3, bgcolor: theme.palette.background.default }}>
                    {loading ? (
                        <Stack alignItems="center" sx={{ py: 6 }}>
                            <CircularProgress />
                        </Stack>
                    ) : error ? (
                        <Alert severity="error">{error}</Alert>
                    ) : (
                        <>
                            {/* KPIs médios */}
                            <Box
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" },
                                    gap: 2,
                                    mb: 2,
                                }}
                            >
                                {(["acwr", "monotony", "strain"] as RiskMetricKey[])
                                    .filter(k => selected.includes(k))
                                    .map((k) => (
                                        <Paper key={k} elevation={1} sx={{ p: 2, borderRadius: 2 }}>
                                            <Typography variant="subtitle2" color="text.secondary">{metricLabels[k]} (avg)</Typography>
                                            <Typography variant="h5" fontWeight={800}>
                                                {stats[k] ?? "—"}
                                            </Typography>
                                            {/* Faixas (sugeridas, ajuste conforme sua régua científica) */}
                                            {k === "acwr" && (
                                                <Typography variant="caption" color="text.secondary">Safe: 0.8–1.3 • High: &gt;1.5</Typography>
                                            )}
                                            {k === "monotony" && (
                                                <Typography variant="caption" color="text.secondary">High Monotony: &gt;2.0</Typography>
                                            )}
                                            {k === "strain" && (
                                                <Typography variant="caption" color="text.secondary">Relative to weekly load</Typography>
                                            )}
                                        </Paper>
                                    ))}
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            {/* Gráfico */}
                            <Box sx={{ width: "100%", height: 340 }}>
                                <ResponsiveContainer>
                                    <LineChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" />
                                        <YAxis />
                                        <RTooltip />
                                        <Legend />
                                        {selected.includes("acwr") && <Line type="monotone" dataKey="acwr" dot strokeWidth={2} />}
                                        {selected.includes("monotony") && <Line type="monotone" dataKey="monotony" dot strokeWidth={2} />}
                                        {selected.includes("strain") && <Line type="monotone" dataKey="strain" dot strokeWidth={2} />}
                                    </LineChart>
                                </ResponsiveContainer>
                            </Box>

                            {/* Tabela simples (compacta) */}
                            <Box sx={{ mt: 2, overflowX: "auto" }}>
                                <Box
                                    sx={(t) => ({
                                        display: "grid",
                                        gridTemplateColumns: `120px ${selected.includes("acwr") ? "140px" : ""} ${selected.includes("monotony") ? "140px" : ""} ${selected.includes("strain") ? "140px" : ""}`.replace(/\s+/g, " ").trim(),
                                        columnGap: 12,
                                        alignItems: "center",
                                        px: 1,
                                        py: 0.5,
                                        borderRadius: 1.5,
                                        bgcolor: t.palette.background.paper,
                                        color: t.palette.text.secondary,
                                        fontWeight: 700,
                                        fontSize: 13,
                                    })}
                                >
                                    <Box>Date</Box>
                                    {selected.includes("acwr") && <Box>ACWR</Box>}
                                    {selected.includes("monotony") && <Box>Monotony</Box>}
                                    {selected.includes("strain") && <Box>Tension</Box>}
                                </Box>

                                {chartData.map((row, idx) => (
                                    <Box
                                        key={idx}
                                        sx={(t) => ({
                                            display: "grid",
                                            gridTemplateColumns: `120px ${selected.includes("acwr") ? "140px" : ""} ${selected.includes("monotony") ? "140px" : ""} ${selected.includes("strain") ? "140px" : ""}`.replace(/\s+/g, " ").trim(),
                                            columnGap: 12,
                                            alignItems: "center",
                                            px: 1,
                                            py: 0.75,
                                            mt: 1,
                                            borderRadius: 1.5,
                                            bgcolor: t.palette.background.paper,
                                            border: `1px solid ${t.palette.divider}`,
                                        })}
                                    >
                                        <Box>{row.date}</Box>
                                        {selected.includes("acwr") && <Box>{row.acwr ?? "—"}</Box>}
                                        {selected.includes("monotony") && <Box>{row.monotony ?? "—"}</Box>}
                                        {selected.includes("strain") && <Box>{row.strain ?? "—"}</Box>}
                                    </Box>
                                ))}
                            </Box>
                        </>
                    )}
                </Paper>
            </Box>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    sx={{ width: "100%", whiteSpace: "pre-line" }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
            <SwitchLightDarkMode />
        </Box>
    );
}
