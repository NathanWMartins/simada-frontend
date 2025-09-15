import React, { useEffect, useMemo, useState } from "react";
import { Box, Chip, CircularProgress, IconButton, Stack, Tooltip, Typography, useTheme } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";

import { listAthletes, listMetricsForSession, getMetricsForAthlete } from "../../../services/coach/session/sessionsService";
import { mapAthlete, mapTeam } from "../../../types/mapper";
import { AthleteSidebar } from "../../../components/coach/sessionGraphs/AthleteSidebar";
import { TeamCharts } from "../../../components/coach/sessionGraphs/TeamCharts";
import { AthleteCharts } from "../../../components/coach/sessionGraphs/AthleteCharts";
import { Athlete, MetricsRow } from "../../../types/sessionGraphsType";
import HeaderHomeCoach from "../../../components/header/HeaderHomeCoach";
import { SwitchLightDarkMode } from "../../../components/common";

export type SessionInsightsPageProps = { sessionId: number };

const SessionInsightsPage: React.FC<SessionInsightsPageProps> = ({ sessionId }) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    const [athletes, setAthletes] = useState<Athlete[]>([]);
    const [selectedAthleteId, setSelectedAthleteId] = useState<number | null>(null);
    const [teamRows, setTeamRows] = useState<MetricsRow[]>([]);
    const [athleteRows, setAthleteRows] = useState<MetricsRow[]>([]);
    const theme = useTheme();

    const loadTeam = async () => {
        setLoading(true);
        setError("");
        try {
            const [as, rows] = await Promise.all([
                listAthletes(sessionId),
                listMetricsForSession(sessionId),
            ]);
            setAthletes(as);
            setTeamRows(rows);
            setAthleteRows([]);
        } catch (e) {
            console.error(e);
            setError("Wasn't possible loading session data.");
        } finally {
            setLoading(false);
        }
    };

    const loadAthlete = async (athleteId: number) => {
        setLoading(true);
        setError("");
        try {
            const [as, rows] = await Promise.all([
                listAthletes(sessionId),
                getMetricsForAthlete(sessionId, athleteId),
            ]);
            setAthletes(as);
            setAthleteRows(rows);
        } catch (e) {
            console.error(e);
            setError("Não foi possível carregar os dados do atleta.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTeam();
    }, [sessionId]);

    const onSelectAll = () => {
        setSelectedAthleteId(null);
        loadTeam();
    };

    const onSelectAthlete = (id: number) => {
        setSelectedAthleteId(id);
        loadAthlete(id);
    };

    const scope: "team" | "athlete" = selectedAthleteId ? "athlete" : "team";
    const currentAthlete = useMemo(
        () => athletes.find((a) => a.id === selectedAthleteId) || null,
        [athletes, selectedAthleteId]
    );

    const teamData = useMemo(() => mapTeam(teamRows, athletes), [teamRows, athletes]);
    const athleteData = useMemo(() => mapAthlete(athleteRows?.[0]), [athleteRows]);

    return (
        <>
            <HeaderHomeCoach />
            <Box sx={{ display: "flex", height: "100%", backgroundColor: theme.palette.background.paper }}>
                <AthleteSidebar
                    athletes={athletes}
                    selectedAthleteId={selectedAthleteId}
                    onSelectAll={onSelectAll}
                    onSelectAthlete={onSelectAthlete}
                />

                <Box sx={{ flex: 1, p: 2, overflowY: "auto" }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Typography variant="h6">
                                Session #{sessionId} — {scope === "team" ? "Full Team" : `Athlete: ${currentAthlete?.name || "--"}`}
                            </Typography>
                            <Chip size="small" label={scope === "team" ? "Comparative" : "Individual"} variant="outlined" />
                        </Stack>
                        <Tooltip title="Atualize">
                            <IconButton
                                onClick={() => (scope === "team" ? loadTeam() : selectedAthleteId && loadAthlete(selectedAthleteId))}
                            >
                                <RefreshIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>

                    {error && (
                        <Box sx={{ mb: 2 }}>
                            <Typography color="error">{error}</Typography>
                        </Box>
                    )}

                    {loading ? (
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: 360 }}>
                            <CircularProgress />
                        </Box>
                    ) : scope === "team" ? (
                        <TeamCharts data={teamData} />
                    ) : (
                        <AthleteCharts data={athleteData} athleteName={currentAthlete?.name} />
                    )}
                </Box>

                <SwitchLightDarkMode />
            </Box>
        </>
    );
};

export default SessionInsightsPage;
