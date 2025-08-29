import React, { useEffect, useMemo, useState } from "react";
import {
    Box, Paper, Typography, IconButton, TextField, Button, Avatar, InputAdornment,
    Popover, ToggleButtonGroup, ToggleButton, Tooltip,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import HeaderHomeTrainer from "../../components/header/HeaderHomeTrainer";
import { getTrainerSessions } from "../../services/trainer/session/sessionsService";
import { SwitchLightDarkMode } from "../../components/common";
import InfoIcon from '@mui/icons-material/Info';
import { useUserContext } from "../../contexts/UserContext";
import { TrainerSession } from "../../types/sessionType";

export default function SessionsTrainer() {
    const theme = useTheme();

    const { user } = useUserContext();
    const [sessions, setSessions] = useState<TrainerSession[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [search, setSearch] = useState("");
    const [filterType, setFilterType] = useState<"all" | "training" | "game">("all");
    const [filterAnchor, setFilterAnchor] = useState<HTMLElement | null>(null);
    const openFilter = Boolean(filterAnchor);

    useEffect(() => {
        (async () => {
            try {
                if (!user?.id) return;
                setLoading(true);
                setError(null);
                const data = await getTrainerSessions(user.id); 
                setSessions(data);                           
            } catch (e) {
                console.error(e);
                setError("Falha ao carregar sessões");
                setSessions([]);
            } finally {
                setLoading(false);
            }
        })();
    }, [user?.id]);

    const handleOpenFilter = (e: React.MouseEvent<HTMLElement>) => setFilterAnchor(e.currentTarget);
    const handleCloseFilter = () => setFilterAnchor(null);
    const handleTypeChange = (_: any, val: "all" | "training" | "game" | null) => {
        if (val) setFilterType(val);
    };

    // filtro local (texto + tipo)
    const filtered = useMemo(() => {
        const lower = search.trim().toLowerCase();
        return sessions.filter((s) => {
            const matchType = filterType === "all" ? true : s.type === filterType;
            const matchText =
                !lower ||
                s.title?.toLowerCase().includes(lower) ||
                (s.location ?? "").toLowerCase().includes(lower) ||
                (s.description ?? "").toLowerCase().includes(lower);
            return matchType && matchText;
        });
    }, [sessions, search, filterType]);

    // helpers UI
    const formatDate = (iso: string) =>
        new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

    // linhas para mostrar enquanto carrega / erro
    const listToRender: ("skeleton" | TrainerSession)[] =
        loading ? Array.from({ length: 8 }, () => "skeleton") : (filtered.length ? filtered : []);

    return (
        <Box sx={{ bgcolor: theme.palette.background.paper, minHeight: "100vh" }}>
            <HeaderHomeTrainer />

            {/* PAGE WRAPPER */}
            <Box sx={{ px: 8, pt: 4, pb: 8 }}>
                {/* Barra verde Sessions */}
                <Paper
                    elevation={4}
                    sx={{
                        position: "relative",
                        mb: 2,
                        borderRadius: 3,
                        overflow: "hidden",
                        bgcolor: "transparent",
                    }}
                >
                    <Box
                        sx={{
                            px: 2.5,
                            py: 1.5,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            background:
                                "linear-gradient(90deg, #1db954 0%, #17a24a 50%, #12903f 100%)",
                        }}
                    >
                        <Typography variant="h6" fontWeight={700} color="#fff">
                            Sessions
                        </Typography>

                        <IconButton
                            aria-label="New Session"
                            size="small"
                            sx={{
                                bgcolor: "rgba(255,255,255,0.15)",
                                color: "#fff",
                                "&:hover": { bgcolor: "rgba(255,255,255,0.25)" },
                            }}
                        // onClick={() => navigate("/sessions/new")} // quando tiver rota
                        >
                            <AddIcon />
                        </IconButton>
                    </Box>
                </Paper>

                {/* LIST CONTAINER */}
                <Paper
                    elevation={4}
                    sx={{
                        borderRadius: 3,
                        p: 2,
                        bgcolor: theme.palette.background.default,
                    }}
                >
                    {/* Toolbar: Search + Filter + Add */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                        <TextField
                            fullWidth
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search sessions…"
                            size="small"
                            variant="outlined"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon fontSize="small" />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                        />

                        <Button
                            variant="outlined"
                            startIcon={<FilterListIcon />}
                            size="small"
                            onClick={handleOpenFilter}
                            sx={{ borderRadius: 2, textTransform: "none" }}
                        >
                            Filter
                        </Button>
                    </Box>

                    {/* Popover de filtro */}
                    <Popover
                        open={openFilter}
                        anchorEl={filterAnchor}
                        onClose={handleCloseFilter}
                        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                        transformOrigin={{ vertical: "top", horizontal: "left" }}
                        PaperProps={{ sx: { p: 2, borderRadius: 2 } }}
                    >
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>
                            Type
                        </Typography>
                        <ToggleButtonGroup
                            size="small"
                            value={filterType}
                            exclusive
                            onChange={handleTypeChange}
                        >
                            <ToggleButton value="all">All</ToggleButton>
                            <ToggleButton value="training">Training</ToggleButton>
                            <ToggleButton value="game">Game</ToggleButton>
                        </ToggleButtonGroup>
                    </Popover>

                    {/* Cabeçalho da “tabela” */}
                    <Box
                        sx={(t) => ({
                            display: "flex",
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
                        <Box sx={{ flex: 0.9 }}>Task</Box>
                        <Box sx={{ flex: 2.2 }}>Title</Box>
                        <Box sx={{ flex: 1.3 }}>Athletes</Box>
                        <Box sx={{ flex: 0.9, textAlign: "center" }}>Score</Box>
                        <Box sx={{ flex: 1.2 }}>Date</Box>
                        <Box sx={{ flex: 1 }}>Owner</Box>
                        <Box sx={{ width: 120, textAlign: "right" }}>Actions</Box>
                    </Box>

                    {/* Linhas */}
                    {listToRender.length === 0 && !loading && (
                        <Typography sx={{ mt: 3, textAlign: "center" }} color="text.secondary">
                            No sessions found.
                        </Typography>
                    )}

                    {listToRender.map((row, i) => {
                        const isSkeleton = row === "skeleton";
                        const r = row as TrainerSession;

                        return (
                            <Box
                                key={isSkeleton ? `skeleton-${i}` : r.id}
                                sx={(t) => ({
                                    display: "flex",
                                    alignItems: "center",
                                    px: 1.5,
                                    py: 1.25,
                                    mt: 1,
                                    borderRadius: 2,
                                    bgcolor: t.palette.background.paper,
                                    border: `1px solid ${t.palette.divider}`,
                                })}
                            >
                                {/* Task / id */}
                                <Box sx={{ flex: 0.9, color: "text.secondary" }}>
                                    {isSkeleton ? "—" : r.type === "game" ? `GM-${r.id}` : `TR-${r.id}`}
                                </Box>

                                {/* Title */}
                                <Box sx={{ flex: 2.2 }}>
                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                        {isSkeleton
                                            ? "—"
                                            : r.title}
                                    </Typography>
                                </Box>

                                {/* Athletes (placeholder até integrar) */}
                                <Box sx={{ flex: 1.3, color: "text.secondary" }}>
                                    {isSkeleton
                                        ? "—"
                                        : r.athleteCount}
                                </Box>

                                {/* Score */}
                                <Box sx={{ flex: 0.9, textAlign: "center" }}>
                                    <Box
                                        sx={(t) => ({
                                            display: "inline-flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            minWidth: 36,
                                            height: 24,
                                            borderRadius: 1,
                                            border: `1px solid ${t.palette.divider}`,
                                            color: t.palette.text.primary,
                                            fontSize: 12,
                                        })}
                                    >
                                        {isSkeleton ? "—" : r.type === "game" ? (r.score ?? "—") : "—"}
                                    </Box>
                                </Box>

                                {/* Date */}
                                <Box sx={{ flex: 1.2, color: "text.secondary" }}>
                                    {isSkeleton ? "—" : formatDate(r.start)}
                                </Box>

                                {/* Owner */}
                                <Box sx={{ flex: 1 }}>
                                    <Avatar sx={{ width: 26, height: 26 }}
                                        src={r.trainerPhoto || undefined} />
                                </Box>

                                {/* Actions */}
                                <Box sx={{ width: 120, display: "flex", justifyContent: "flex-end", gap: 1 }}>
                                    <Tooltip title="Delete">
                                        <IconButton size="small">
                                            <InfoIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="View">
                                        <IconButton size="small">
                                            <VisibilityIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Edit">
                                        <IconButton size="small">
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Delete">
                                        <IconButton size="small" color="error">
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            </Box>
                        );
                    })}
                </Paper>
            </Box>
            <SwitchLightDarkMode />
        </Box>
    );
}
