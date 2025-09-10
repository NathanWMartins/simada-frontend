import React, { useMemo, useState } from "react";
import {
    Alert,
    Box,
    MenuItem,
    Paper,
    Select,
    Snackbar,
    TextField,
    Typography,
    InputAdornment,
    CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../../contexts/UserContext";
import { SwitchLightDarkMode } from "../../../components/common";
import HeaderHomeAthlete from "../../../components/header/HeaderHomeAthlete";
import { useAthleteSessionsList, AthleteFilterType } from "../../../hooks/useAthleteSessionsList";
import { AthleteSession } from "../../../services/athlete/sessionsService";
import AthleteSessionRow from "../../../components/athlete/RowAthlete";

export default function SessionsAthlete() {
    const theme = useTheme();
    const { user } = useUserContext();
    const navigate = useNavigate();

    const { sessions, loading, error, formatDate } = useAthleteSessionsList(user?.id);

    const [search, setSearch] = useState("");
    const [filterType, setFilterType] = useState<AthleteFilterType>("All");

    const filtered = useMemo(() => {
        const lower = search.trim().toLowerCase();
        return sessions.filter((s) => {
            const typeOk = filterType === "All" ? true : s.type === filterType;
            const textOk =
                !lower ||
                s.title.toLowerCase().includes(lower) ||
                (s.location ?? "").toLowerCase().includes(lower) ||
                (s.description ?? "").toLowerCase().includes(lower) ||
                (s.coachPhoto ?? "").toLowerCase().includes(lower);
            return typeOk && textOk;
        });
    }, [sessions, search, filterType]);

    const [snack, setSnack] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
        open: false,
        message: "",
        severity: "success",
    });

    const onInfo = (s: AthleteSession) => {
        setSnack({
            open: true,
            message: s.description ?? "Sem descrição para esta sessão.",
            severity: "success",
        });
    };

    const onOpenMetrics = (s: AthleteSession) => {
        // navigate(`/athlete/sessions/${s.id}/metrics`);
        navigate(`/`);
    };

    const onNoMetrics = () => {
        setSnack({
            open: true,
            message: "Esta sessão não possui métricas para visualizar.",
            severity: "error",
        });
    };

    return (
        <Box sx={{ bgcolor: theme.palette.background.paper, minHeight: "100vh" }}>
            <HeaderHomeAthlete />

            <Box sx={{ px: 8, pt: 4, pb: 8 }}>
                {/* Barra topo */}
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
                            My Sessions
                        </Typography>
                    </Box>
                </Paper>

                <Paper elevation={4} sx={{ borderRadius: 3, p: 2, mb: 2, bgcolor: theme.palette.background.default }}>
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: { xs: "1fr", md: "1fr 240px" }, // lado a lado >= md
                            gap: 2,
                            alignItems: "center",
                        }}
                    >
                        <TextField
                            placeholder="Search for title, local..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon fontSize="small" />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{ width: "100%" }}
                        />

                        <Select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value as any)}
                            sx={{ width: { xs: "100%", md: 240 } }}
                        >
                            <MenuItem value="All">All</MenuItem>
                            <MenuItem value="Training">Training</MenuItem>
                            <MenuItem value="Game">Game</MenuItem>
                        </Select>
                    </Box>
                </Paper>

                {/* Cabeçalho da tabela */}
                <Paper elevation={4} sx={{ borderRadius: 3, p: 2, bgcolor: theme.palette.background.default }}>
                    <Box
                        sx={(t) => ({
                            display: "grid",
                            gridTemplateColumns: "2.5fr 1.2fr 1fr 0.8fr 1fr 1fr 100px",
                            columnGap: 16,
                            alignItems: "center",
                            px: 1.5,
                            py: 1,
                            borderRadius: 2,
                            bgcolor: t.palette.background.paper,
                            color: t.palette.text.secondary,
                            fontSize: 13,
                            fontWeight: 700,
                        })}
                    >
                        <Box>Title</Box>
                        <Box>Type</Box>
                        <Box>Local</Box>
                        <Box sx={{ textAlign: "center" }}>Score</Box>
                        <Box>Date</Box>
                        <Box>Coach</Box>
                        <Box sx={{ textAlign: "right" }}>Actions</Box>
                    </Box>

                    {/* Loading */}
                    {loading && (
                        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                            <CircularProgress size={24} />
                        </Box>
                    )}

                    {/* Erro */}
                    {!loading && error && (
                        <Typography sx={{ mt: 3, textAlign: "center" }} color="error">
                            {error}
                        </Typography>
                    )}

                    {/* Vazio */}
                    {!loading && !error && filtered.length === 0 && (
                        <Typography sx={{ mt: 3, textAlign: "center" }} color="text.secondary">
                            Nenhuma sessão encontrada.
                        </Typography>
                    )}

                    {/* Linhas */}
                    {filtered.map((s) => (
                        <AthleteSessionRow
                            key={s.id}
                            s={s}
                            formatDate={formatDate}
                            onInfo={onInfo}
                            onOpenMetrics={onOpenMetrics}
                            onNoMetrics={onNoMetrics}
                        />
                    ))}
                </Paper>
            </Box>

            {/* Snackbar */}
            <Snackbar
                open={snack.open}
                autoHideDuration={3500}
                onClose={() => setSnack((s) => ({ ...s, open: false }))}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <Alert severity={snack.severity} sx={{ width: "100%" }}>
                    {snack.message}
                </Alert>
            </Snackbar>

            <SwitchLightDarkMode />
        </Box>
    );
}
