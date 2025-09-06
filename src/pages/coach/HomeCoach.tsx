import { useEffect, useMemo, useState } from "react";
import { Box, Divider, Paper, Typography, Skeleton, Alert as MuiAlert } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import HeaderHomeCoach from "../../components/header/HeaderHomeCoach";
import { SwitchLightDarkMode } from "../../components/common";
import StarIcon from "@mui/icons-material/Star";
import TopPerformerCard from "../../components/coach/homePageCoach/TopPerformerCard";
import type { TrainingStats, TopPerformer } from "../../types/types";
import { getCoachStats, getTopPerformers } from "../../services/coach/coachService";
import AlertsPanel from "../../components/coach/homePageCoach/AlertsPanel";
import { useUserContext } from "../../contexts/UserContext";
import PsychoemocionalAlerts from "../../components/coach/homePageCoach/PsychoemocionalAlerts";

export default function HomeCoach() {
    const theme = useTheme();
    const [stats, setStats] = useState<TrainingStats | null>(null);
    const { user } = useUserContext();
    const [topPerformers, setTopPerformers] = useState<TopPerformer[]>([]);
    const [loadingTop, setLoadingTop] = useState(false);
    const [errorTop, setErrorTop] = useState<string | null>(null);


    useEffect(() => {
        if (user) {
            getCoachStats(user.id)
                .then((data) => setStats(data))
                .catch((err) => console.error("Erro ao buscar estatísticas:", err));                
        }        
    }, [user]);

    useEffect(() => {
        fetchTopPerformers();
    }, []);

    async function fetchTopPerformers() {
        try {
            setLoadingTop(true);
            setErrorTop(null);
            const performers = await getTopPerformers(3);
            setTopPerformers(performers);
        } catch (err: any) {
            console.error("Erro ao buscar top performers:", err);
            setErrorTop(err?.response?.data?.message ?? "Não foi possível carregar os top performers.");
        } finally {
            setLoadingTop(false);
        }
    }

    const statsList = [
        { label: "Completed Training", value: stats?.completedTrainings ?? 0 },
        { label: "Training this Week", value: stats?.trainingsThisWeek ?? 0 },
        { label: "Matches Played", value: stats?.matchesPlayed ?? 0 },
        { label: "Matches this Month", value: stats?.matchesThisMonth ?? 0 },
        { label: "Total Sessions", value: stats?.totalSessions ?? 0 },
        { label: "Total Athletes", value: stats?.totalAthletes ?? 0 },
    ];

    const lastUpdated = useMemo(() => {
        const times = topPerformers
            .map(p => new Date(p.updatedAt).getTime())
            .filter(n => !Number.isNaN(n));
        if (!times.length) return "--/--/----";
        return new Date(Math.max(...times)).toLocaleDateString("pt-BR");
    }, [topPerformers]);

    return (
        <>
            <Box sx={{ backgroundColor: theme.palette.background.paper, height: '180vh' }}>

                <HeaderHomeCoach />

                <Typography
                    variant="h6"
                    fontWeight="light"
                    sx={{ mt: 2, ml: 10 }}
                >
                    Bem-vindo, {user?.name ?? "Usuário"}!
                </Typography>
                <Divider sx={{ my: 1, mx: 10 }} />

                <Box sx={{ display: "flex", gap: 3, px: 8 }}>
                    <Box
                        sx={{
                            display: "flex", flexDirection: "column", width: "50%", gap: 2,
                            px: 3, pt: 4
                        }}
                    >
                        {[0, 1].map((row) => (
                            <Box
                                key={row}
                                sx={{ display: "flex", justifyContent: "space-between", gap: 2, pt: 2, }}
                            >
                                {statsList.slice(row * 3, row * 3 + 3).map((item, index) => (
                                    <Paper
                                        key={index} elevation={4}
                                        sx={{
                                            flex: 1, p: 3, borderRadius: 3, textAlign: "center", display: "flex",
                                            flexDirection: "column", justifyContent: "center", height: 150, backgroundColor: '#2CAE4D'
                                        }}
                                    >
                                        <Typography variant="h5" fontWeight="bold" color="white">
                                            {item.value}
                                        </Typography>
                                        <Typography variant="subtitle1" color="white" sx={{ pt: 2 }}>
                                            {item.label}
                                        </Typography>
                                    </Paper>
                                ))}
                            </Box>
                        ))}
                    </Box>

                    <Box sx={{ width: "45%", mt: 6 }}>
                        <Paper elevation={4} sx={{
                            p: 3, borderRadius: 3, position: "relative",
                            bgcolor: theme.palette.background.default, height: 340
                        }}>
                            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
                                <StarIcon fontSize="medium" sx={{ verticalAlign: "middle", mb: "1px" }} />
                                Top Performers
                            </Typography>

                            <Typography
                                variant="body2"
                                sx={{
                                    position: "absolute",
                                    top: 32,
                                    right: 20,
                                    color: "text.secondary",
                                }}
                            >
                                {lastUpdated}
                            </Typography>

                            <Box sx={{
                                height: 240, display: "flex", alignItems: "center",
                                justifyContent: "center"
                            }}>
                                <Box
                                    sx={{
                                        height: 240,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    {loadingTop ? (
                                        <Box sx={{ display: "flex", gap: 2 }}>
                                            {[0, 1, 2].map((i) => (
                                                <Paper
                                                    key={i}
                                                    sx={{ height: 250, width: 130, borderRadius: 2, p: 2, bgcolor: "action.hover" }}
                                                >
                                                    <Skeleton variant="circular" width={60} height={60} sx={{ mx: "auto", mt: 1 }} />
                                                    <Skeleton variant="text" width="70%" sx={{ mx: "auto", mt: 2 }} />
                                                    <Skeleton variant="text" width="50%" sx={{ mx: "auto", mt: 1 }} />
                                                    <Skeleton variant="text" width="40%" sx={{ mx: "auto", mt: 1 }} />
                                                </Paper>
                                            ))}
                                        </Box>
                                    ) : errorTop ? (
                                        <Box sx={{ px: 2, width: "100%" }}>
                                            <MuiAlert severity="error" variant="outlined">{errorTop}</MuiAlert>
                                        </Box>
                                    ) : topPerformers.length === 0 ? (
                                        <Typography color="text.secondary">Nenhum performer encontrado.</Typography>
                                    ) : (
                                        <Box sx={{ display: "flex", flexDirection: "row", gap: 2, justifyContent: "center" }}>
                                            {topPerformers.map((p, idx) => (
                                                <TopPerformerCard
                                                    key={idx}
                                                    name={p.name}
                                                    avatarUrl={p.avatarUrl}
                                                    score={p.score}
                                                    delta={p.delta}
                                                />
                                            ))}
                                        </Box>
                                    )}
                                </Box>


                            </Box>
                        </Paper>
                    </Box>
                </Box>

                <Box sx={{ display: "flex", gap: 1, px: 8, mt: 10 }}>
                    <Box sx={{ width: "50%" }}>
                        <AlertsPanel days={7} limit={5} />
                    </Box>

                    <Box sx={{ width: "50%" }}>
                        <PsychoemocionalAlerts />
                    </Box>
                </Box>
                <SwitchLightDarkMode />
            </Box>
        </>
    );
}
