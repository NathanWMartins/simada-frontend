import { useEffect, useMemo, useState } from "react";
import { Box, Paper, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import HeaderHomeTrainer from "../../components/header/HeaderHomeTrainer";
import { SwitchLightDarkMode } from "../../components/common";
import StarIcon from "@mui/icons-material/Star";
import TopPerformerCard from "../../components/top-performers/TopPerformerCard";
import type { TrainingStats, TopPerformer } from "../../services/types/types";
import { getTrainerStats, getTopPerformers } from "../../services/trainer/trainerService";

export default function HomeTrainer() {
    const theme = useTheme();
    const [stats, setStats] = useState<TrainingStats | null>(null);

    const [topPerformers, setTopPerformers] = useState<TopPerformer[]>([]);
    const [loadingTop, setLoadingTop] = useState(false);
    const [errorTop, setErrorTop] = useState<string | null>(null);


    useEffect(() => {
        (async () => {
            try {
                const data = await getTrainerStats();
                setStats(data);
            } catch (error) {
                console.error("Erro ao buscar estatísticas:", error);
            }
        })();
    }, []);

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
        { label: "Completed Training", value: stats?.completedTraining ?? 0 },
        { label: "Training this Week", value: stats?.trainingThisWeek ?? 0 },
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
            <Box sx={{ backgroundColor: theme.palette.background.paper, height: '100vh' }}>


                <HeaderHomeTrainer />
                <Box sx={{ display: "flex", gap: 3, px: 8, pt: 4 }}>
                    <Box
                        sx={{
                            display: "flex", flexDirection: "column", width: "50%", gap: 2,
                            px: 8, pt: 4
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

                    <Box sx={{ width: "35%", mt: 6 }}>
                        <Paper elevation={4} sx={{ p: 3, borderRadius: 3, position: "relative" }}>
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
                                <Box sx={{ display: "flex", flexDirection: "row", gap: 2, justifyContent: "center" }}>
                                    {(topPerformers.length > 0 ? topPerformers : Array(3).fill(null)).map((p, idx) => (
                                        <TopPerformerCard
                                            key={idx}
                                            name={p?.name}
                                            avatarUrl={p?.avatarUrl}
                                            score={p?.score}
                                            delta={p?.delta}
                                        />
                                    ))}
                                </Box>

                            </Box>
                        </Paper>
                    </Box>
                </Box>

                <SwitchLightDarkMode />
            </Box>
        </>
    );
}
