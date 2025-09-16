// pages/athlete/SessionAthleteMetricsPage.tsx
import React, { useEffect, useMemo, useState } from "react";
import { Box, Chip, CircularProgress, IconButton, Stack, Tooltip, Typography, useTheme } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useParams, useSearchParams } from "react-router-dom";
import { useUserContext } from "../../../contexts/UserContext";
import { MetricsRow } from "../../../types/sessionGraphsType";
import { getMetricsForAthlete } from "../../../services/coach/session/sessionsService";
import { mapAthlete } from "../../../types/mapper";
import { AthleteCharts } from "../../../components/coach/sessionGraphs/AthleteCharts";
import HeaderHomeAthlete from "../../../components/header/HeaderHomeAthlete";
import { SwitchLightDarkMode } from "../../../components/common";

const SessionAthleteMetricsPage: React.FC = () => {
    const theme = useTheme();
    const { user } = useUserContext();
    const { id } = useParams();
    const [qs] = useSearchParams();
    const sessionId = Number(id);
    const athleteId = Number(qs.get("athlete"));
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [rows, setRows] = useState<MetricsRow[]>([]);

    const load = async () => {
        if (!sessionId || !athleteId) return;
        setLoading(true); setError("");
        try {
            const r = await getMetricsForAthlete(sessionId, athleteId);
            setRows(r);
        } catch (e) {
            console.error(e);
            setError("Não foi possível carregar seus gráficos desta sessão.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, [sessionId, athleteId]);

    const data = useMemo(() => mapAthlete(rows?.[0]), [rows]);

    return (
        <>
        <HeaderHomeAthlete/>
            <Box sx={{ display: "flex", height: "100%", bgcolor: theme.palette.background.paper }}>
                <Box sx={{ flex: 1, p: 2, overflowY: "auto" }}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Typography variant="h6">Session #{sessionId} — <b>{user?.name}</b></Typography>
                            <Chip size="small" label="Individual" variant="outlined" />
                        </Stack>
                        <Tooltip title="Atualizar">
                            <IconButton onClick={load}><RefreshIcon /></IconButton>
                        </Tooltip>
                    </Stack>

                    {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}

                    {loading ? (
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: 360 }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <AthleteCharts
                            data={data}
                            athleteName={user?.name ?? undefined}
                        />
                    )}
                </Box>
                <SwitchLightDarkMode/>
            </Box>
        </>
    );
};

export default SessionAthleteMetricsPage;
