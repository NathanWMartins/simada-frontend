import React, { useEffect, useMemo, useState } from "react";
import {
    Alert, Box, CircularProgress, Divider, Paper, Stack, Snackbar,
    Typography, useTheme, ToggleButtonGroup, ToggleButton,
    Button
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
    Line, LineChart, ResponsiveContainer, Tooltip as RTooltip,
    XAxis, YAxis, Legend, CartesianGrid,
} from "recharts";
import { RiskMetricKey } from "../../../services/coach/athletes/athleteRiskService";
import { getAthleteProfile } from "../../../services/athlete/athleteService";
import { SnackbarState } from "../../../types/types";

dayjs.locale("en");

const metricLabels: Record<RiskMetricKey, string> = {
    ca: "CA",
    cc: "CC",
    pctqwup: "PCTQWUP",
    acwr: "ACWR",
    monotony: "Monotony",
    strain: "Tension",
};

export default function RiskCalculationsCoach() {
    const theme = useTheme();
    const { athleteId } = useParams();
    const id = Number(athleteId);

    const [fromD, setFromD] = useState<Dayjs | null>(dayjs().subtract(30, "day").startOf("day"));
    const [toD, setToD] = useState<Dayjs | null>(dayjs().endOf("day"));

    const [selected, setSelected] = useState<RiskMetricKey[]>(["acwr", "monotony", "strain"]);
    const [athleteName, setAthleteName] = useState<string>("");

    const [queryFrom, setQueryFrom] = useState<string | undefined>(fromD?.format("YYYY-MM-DD"));
    const [queryTo, setQueryTo] = useState<string | undefined>(toD?.format("YYYY-MM-DD"));
    const [queryMetrics, setQueryMetrics] = useState<RiskMetricKey[]>(["acwr", "monotony", "strain"]);

    const { loading, error, points } = useAthleteRisk(id, queryFrom, queryTo, queryMetrics);

    const handleFetch = () => {
        setQueryFrom(fromD?.format("YYYY-MM-DD"));
        setQueryTo(toD?.format("YYYY-MM-DD"));
        setQueryMetrics(selected);
    };

    const [snackbar, setSnackbar] = useState<SnackbarState>({
        open: false,
        message: "",
        severity: "error",
    });
    const handleCloseSnackbar = () => setSnackbar((prev) => ({ ...prev, open: false }));

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

    // mantém from <= to
    useEffect(() => {
        if (fromD && toD && fromD.isAfter(toD)) {
            setToD(fromD.endOf("day"));
        }
    }, [fromD, toD]);

    const chartData = useMemo(
        () =>
            points.map((p) => ({
                date: dayjs(p.date).format("DD/MM"),
                ca: p.ca ?? null,
                cc: p.cc ?? null,
                pctqwup: p.pctqwup ?? null,
                acwr: p.acwr ?? null,
                monotony: p.monotony ?? null,
                strain: p.strain ?? null,
            })),
        [points]
    );


    const stats = useMemo(() => {
        const calc = (key: RiskMetricKey) => {
            const arr = points.map((p) => p[key]).filter((v): v is number => typeof v === "number");
            if (!arr.length) return null;
            const sum = arr.reduce((a, b) => a + b, 0);
            return +(sum / arr.length).toFixed(2);
        };
        return {
            ca: calc("ca"),
            cc: calc("cc"),
            pctqwup: calc("pctqwup"),
            acwr: calc("acwr"),
            monotony: calc("monotony"),
            strain: calc("strain"),
        };
    }, [points]);

    const order: RiskMetricKey[] = ["ca", "cc", "pctqwup", "acwr", "monotony", "strain"];

    const colors: Record<RiskMetricKey, string> = {
        ca: "#6B7280",
        cc: "#8B5CF6",
        pctqwup: "#F59E0B",
        acwr: "#2563EB",
        monotony: "#10B981",
        strain: "#EF4444",
    };

    const formatCell = (k: RiskMetricKey, v: number | null | undefined) => {
        if (v == null) return "—";
        if (k === "pctqwup") return `${v.toFixed(1)}%`;
        if (k === "acwr" || k === "monotony") return v.toFixed(2);
        if (k === "strain") return v.toFixed(0); // ou 2, se preferir
        // ca, cc
        return v.toFixed(0);
    };


    return (
        <Box sx={{ bgcolor: theme.palette.background.paper, minHeight: "100vh" }}>
            <HeaderHomeCoach />

            <Box sx={{ px: 8, pt: 4, pb: 8 }}>
                {/* Banner */}
                <Paper elevation={4} sx={{ position: "relative", mb: 2, borderRadius: 3, overflow: "hidden", bgcolor: "transparent" }}>
                    <Box
                        sx={{
                            px: 2.5,
                            py: 1.5,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
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
                                label="From (date)"
                                value={fromD}
                                onChange={(v) => v && setFromD(v.startOf("day"))}
                                slotProps={{ textField: { size: "small", fullWidth: true, InputLabelProps: { shrink: true } } }}
                            />

                            <DatePicker
                                label="To (date)"
                                value={toD}
                                minDate={fromD ?? undefined}
                                onChange={(v) => v && setToD(v.endOf("day"))}
                                slotProps={{ textField: { size: "small", fullWidth: true, InputLabelProps: { shrink: true } } }}
                            />

                            {/* Coluna direita: Botão + Métricas */}
                            <Stack
                                direction="row"
                                spacing={1}
                                justifyContent={{ xs: "flex-start", md: "flex-end" }}
                                alignItems="center"
                                useFlexGap
                                flexWrap="wrap"
                            >
                                <Button
                                    variant="contained"
                                    color="success"
                                    onClick={handleFetch}
                                    sx={{ borderRadius: 2, px: 3, color: "white", ml: "auto" }}
                                >
                                    Search metrics
                                </Button>

                                {/* Wrapper com scroll horizontal para não “estourar” o card */}
                                <Box sx={{ overflowX: "auto", maxWidth: { xs: "100%", md: "100%" } }}>
                                    <ToggleButtonGroup
                                        value={selected}
                                        onChange={(_, val) => val?.length && setSelected(val)}
                                        size="small"
                                        sx={{
                                            whiteSpace: "nowrap",
                                            "& .MuiToggleButton-root": { fontWeight: 700 }
                                        }}
                                    >
                                        <ToggleButton value="ca">CA</ToggleButton>
                                        <ToggleButton value="cc">CC</ToggleButton>
                                        <ToggleButton value="acwr">ACWR</ToggleButton>
                                        <ToggleButton value="pctqwup">PCTQWUP</ToggleButton>
                                        <ToggleButton value="monotony">MONOTONY</ToggleButton>
                                        <ToggleButton value="strain">STRAIN</ToggleButton>
                                    </ToggleButtonGroup>
                                </Box>
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
                                {order
                                    .filter((k) => selected.includes(k))
                                    .map((k) => (
                                        <Paper key={k} elevation={1} sx={{ p: 2, borderRadius: 2 }}>
                                            <Typography variant="subtitle2" color="text.secondary">
                                                {metricLabels[k]} (avg)
                                            </Typography>
                                            <Typography variant="h5" fontWeight={800}>
                                                {stats[k] == null ? "—" : formatCell(k, stats[k]!)}
                                            </Typography>

                                            {/* notas por métrica */}
                                            {k === "acwr" && (
                                                <Typography variant="caption" color="text.secondary">
                                                    Safe: 0.8–1.3 • High: &gt;1.5
                                                </Typography>
                                            )}
                                            {k === "monotony" && (
                                                <Typography variant="caption" color="text.secondary">
                                                    High Monotony: &gt;2.0
                                                </Typography>
                                            )}
                                            {k === "pctqwup" && (
                                                <Typography variant="caption" color="text.secondary">
                                                    Stable: −10% ~ +10% • Risk: &gt;20%
                                                </Typography>
                                            )}
                                            {k === "strain" && (
                                                <Typography variant="caption" color="text.secondary">
                                                    Relative to weekly load
                                                </Typography>
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
                                        {order.filter(k => selected.includes(k)).map((k) => (
                                            <Line
                                                key={k}
                                                type="monotone"
                                                dataKey={k}
                                                name={metricLabels[k]}
                                                dot
                                                strokeWidth={2}
                                                stroke={colors[k]}
                                                isAnimationActive={false}
                                                connectNulls
                                            />
                                        ))}
                                    </LineChart>
                                </ResponsiveContainer>
                            </Box>

                            {/* Tabela compacta */}
                            <Box sx={{ mt: 2, overflowX: "auto" }}>
                                {/* Cabeçalho */}
                                <Box
                                    sx={(t) => ({
                                        display: "grid",
                                        gridTemplateColumns: `120px ${order
                                            .filter((k) => selected.includes(k))
                                            .map(() => "160px")
                                            .join(" ")}`.trim(),
                                        columnGap: 12,
                                        alignItems: "center",
                                        px: 1,
                                        py: 0.5,
                                        borderRadius: 1.5,
                                        bgcolor: t.palette.background.paper,
                                        color: t.palette.text.secondary,
                                        fontWeight: 700,
                                        fontSize: 13,
                                        minWidth: 120 + 160 * selected.length, // garante scroll
                                    })}
                                >
                                    <Box>Date</Box>
                                    {order.filter(k => selected.includes(k)).map((k) => (
                                        <Box key={k}>{metricLabels[k]}</Box>
                                    ))}
                                </Box>

                                {/* Linhas */}
                                {chartData.map((row, idx) => (
                                    <Box
                                        key={idx}
                                        sx={(t) => ({
                                            display: "grid",
                                            gridTemplateColumns: `120px ${order
                                                .filter((k) => selected.includes(k))
                                                .map(() => "160px")
                                                .join(" ")}`.trim(),
                                            columnGap: 12,
                                            alignItems: "center",
                                            px: 1,
                                            py: 0.75,
                                            mt: 1,
                                            borderRadius: 1.5,
                                            bgcolor: t.palette.background.paper,
                                            border: `1px solid ${t.palette.divider}`,
                                            minWidth: 120 + 160 * selected.length,
                                        })}
                                    >
                                        <Box>{row.date}</Box>
                                        {order.filter(k => selected.includes(k)).map((k) => (
                                            <Box key={k} sx={{ color: colors[k], fontVariantNumeric: "tabular-nums" }}>
                                                {formatCell(k, (row as any)[k])}
                                            </Box>
                                        ))}
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
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%", whiteSpace: "pre-line" }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
            <SwitchLightDarkMode />
        </Box>
    );
}
