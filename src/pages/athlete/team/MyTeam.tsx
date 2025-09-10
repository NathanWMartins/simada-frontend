import React, { useMemo, useState } from "react";
import {
    Alert,
    Box,
    CircularProgress,
    InputAdornment,
    MenuItem,
    Paper,
    Select,
    Snackbar,
    TextField,
    Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import HeaderHomeAthlete from "../../../components/header/HeaderHomeAthlete";
import { SwitchLightDarkMode } from "../../../components/common";
import { useUserContext } from "../../../contexts/UserContext";
import { useAthletePeers } from "../../../hooks/useAthletePeers";
import { PeerAthlete } from "../../../services/athlete/peersService";
import PeerRow from "../../../components/athlete/PeerRow";
// import { useNavigate } from "react-router-dom";

export default function MyTeam() {
    const theme = useTheme();
    const { user } = useUserContext();
    // const navigate = useNavigate();

    const { peers, loading, error, positions } = useAthletePeers(user?.id);

    const [search, setSearch] = useState("");
    const [position, setPosition] = useState<string>("All");

    const filtered = useMemo(() => {
        const lower = search.trim().toLowerCase();
        return peers.filter((p) => {
            const posOk = position === "All" ? true : (p.position ?? "").toLowerCase() === position.toLowerCase();
            const textOk =
                !lower ||
                p.name.toLowerCase().includes(lower) ||
                (p.email ?? "").toLowerCase().includes(lower) ||
                (p.position ?? "").toLowerCase().includes(lower);
            return posOk && textOk;
        });
    }, [peers, search, position]);

    const [snack, setSnack] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
        open: false,
        message: "",
        severity: "success",
    });

    const onInfo = (p: PeerAthlete) => {
        const text = [
            p.position ? `Posição: ${p.position}` : null,
            p.jersey ? `Número: ${p.jersey}` : null,
            p.email ? `Email: ${p.email}` : null,
            p.points != null ? `Pontos: ${p.points}` : null,
        ]
            .filter(Boolean)
            .join(" • ");
        setSnack({ open: true, message: text || "Sem informações adicionais.", severity: "success" });
    };

    return (
        <Box sx={{ bgcolor: theme.palette.background.paper, minHeight: "100vh" }}>
            <HeaderHomeAthlete />

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
                            Meu Time
                        </Typography>
                    </Box>
                </Paper>

                {/* Filtros */}
                <Paper elevation={4} sx={{ borderRadius: 3, p: 2, mb: 2, bgcolor: theme.palette.background.default }}>
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: { xs: "1fr", md: "1fr 220px" },
                            gap: 2,
                            alignItems: "center",
                        }}
                    >
                        <TextField
                            placeholder="Buscar por nome, email, posição..."
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

                        <Select value={position} onChange={(e) => setPosition(e.target.value)} sx={{ width: { xs: "100%", md: 220 } }}>
                            <MenuItem value="All">All Positions</MenuItem>
                            {positions.map((pos) => (
                                <MenuItem key={pos} value={pos}>{pos}</MenuItem>
                            ))}
                        </Select>
                    </Box>
                </Paper>

                {/* Tabela */}
                <Paper elevation={4} sx={{ borderRadius: 3, p: 2.5, bgcolor: theme.palette.background.default }}>
                    {/* Header */}
                    <Box
                        sx={(t) => ({
                            display: "grid",
                            gridTemplateColumns:
                                "minmax(0,3fr) minmax(0,1fr) minmax(0,0.6fr) minmax(200px,2fr) minmax(0,1.2fr) minmax(0,0.8fr) 88px",
                            columnGap: 12,
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
                        <Box sx={{ minWidth: 0 }}>Name</Box>
                        <Box sx={{ minWidth: 0 }}>Position</Box>
                        <Box sx={{ minWidth: 0 }}>#</Box>
                        <Box sx={{ minWidth: 0 }}>Email</Box>
                        <Box sx={{ minWidth: 0 }}>Nationality</Box>
                        <Box sx={{ minWidth: 0 }}>Points</Box>
                        <Box sx={{ textAlign: "right" }}>Actions</Box>
                    </Box>


                    {/* Loading/Erro/Vazio */}
                    {loading && (
                        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                            <CircularProgress size={24} />
                        </Box>
                    )}
                    {!loading && error && (
                        <Typography sx={{ mt: 3, textAlign: "center" }} color="error">
                            {error}
                        </Typography>
                    )}
                    {!loading && !error && filtered.length === 0 && (
                        <Typography sx={{ mt: 3, textAlign: "center" }} color="text.secondary">
                            Nenhum atleta encontrado.
                        </Typography>
                    )}

                    {/* Linhas */}
                    {filtered.map((p) => (
                        <PeerRow key={p.id} p={p} onInfo={onInfo} />
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
