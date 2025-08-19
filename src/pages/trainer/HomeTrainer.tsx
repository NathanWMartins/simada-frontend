import { useEffect, useState } from "react";
import { Box, Paper, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import axios from "axios";
import HeaderHomeTrainer from "../../components/header/HeaderHomeTrainer";
import { SwitchLightDarkMode } from "../../components/common";

interface TrainerStats {
    completedTraining: number;
    trainingThisWeek: number;
    matchesPlayed: number;
    matchesThisMonth: number;
    totalSessions: number;
    totalAthletes: number;
}

export default function HomeTrainer() {
    const theme = useTheme();
    const [stats, setStats] = useState<TrainerStats | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get<TrainerStats>("/api/trainer/stats");
                setStats(response.data);
            } catch (error) {
                console.error("Erro ao buscar estatísticas:", error);
            }
        };
        fetchStats();
    }, []);

    const statsList = [
        { label: "Completed Training", value: stats?.completedTraining ?? 0 },
        { label: "Training this Week", value: stats?.trainingThisWeek ?? 0 },
        { label: "Matches Played", value: stats?.matchesPlayed ?? 0 },
        { label: "Matches this Month", value: stats?.matchesThisMonth ?? 0 },
        { label: "Total Sessions", value: stats?.totalSessions ?? 0 },
        { label: "Total Athletes", value: stats?.totalAthletes ?? 0 },
    ];

    return (
        <>
            <Box sx={{ backgroundColor: theme.palette.background.paper, height: '100vh' }}>


                <HeaderHomeTrainer />
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
                                        flexDirection: "column", justifyContent: "center", height: 120, backgroundColor: '#2CAE4D'
                                    }}
                                >
                                    <Typography variant="h5" fontWeight="bold" color="white">
                                        {item.value}
                                    </Typography>
                                    <Typography variant="subtitle1" color="white">
                                        {item.label}
                                    </Typography>
                                </Paper>
                            ))}
                        </Box>
                    ))}
                </Box>
                <SwitchLightDarkMode />
            </Box>
        </>
    );
}
