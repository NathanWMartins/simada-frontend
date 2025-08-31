import React, { useEffect, useMemo, useState } from "react";
import {
    Box, Paper, Typography, IconButton, TextField, Button, Avatar, InputAdornment,
    Popover, ToggleButtonGroup, ToggleButton, Tooltip,
    Dialog, DialogTitle, DialogContent, DialogActions,
    Snackbar, Alert,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import HeaderHomeTrainer from "../../../components/header/HeaderHomeTrainer";
import { getTrainerSessions, deleteSession } from "../../../services/trainer/session/sessionsService"; // ⬅️ novo import
import { SwitchLightDarkMode } from "../../../components/common";
import InfoIcon from '@mui/icons-material/Info';
import { useUserContext } from "../../../contexts/UserContext";
import { TrainerSession } from "../../../types/sessionType";
import { uploadSessionMetrics } from "../../../services/trainer/session/metricsService";

export default function SessionsTrainer() {
    const theme = useTheme();

    const { user } = useUserContext();
    const [sessions, setSessions] = useState<TrainerSession[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [search, setSearch] = useState("");
    const [filterType, setFilterType] = useState<"All" | "Training" | "Game">("All");
    const [filterAnchor, setFilterAnchor] = useState<HTMLElement | null>(null);
    const openFilter = Boolean(filterAnchor);

    // ---- Import CSV
    const [importOpen, setImportOpen] = useState(false);
    const [selectedSession, setSelectedSession] = useState<TrainerSession | null>(null);
    const [csvFile, setCsvFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

    // ---- Remover sessão
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [target, setTarget] = useState<TrainerSession | null>(null);
    const [deleting, setDeleting] = useState(false);

    const [snack, setSnack] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
        open: false,
        message: "",
        severity: "success",
    });

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
    const handleTypeChange = (_: any, val: "All" | "Training" | "Game" | null) => { if (val) setFilterType(val); };

    // editar / importar métricas
    const handleEditClick = (s: TrainerSession) => {
        if (s.has_metrics) {
            console.log("Editar sessão com métricas:", s.id);
        } else {
            setSelectedSession(s);
            setCsvFile(null);
            setUploadError(null);
            setImportOpen(true);
        }
    };

    // remover sessão (NOVO)
    const handleRemoveClick = (s: TrainerSession) => {
        setTarget(s);
        setConfirmOpen(true);
    };
    const handleConfirmDelete = async () => {
        if (!target) return;
        try {
            setDeleting(true);
            await deleteSession(target.id);
            setSessions(prev => prev.filter(x => x.id !== target.id)); // otimista
            setSnack({ open: true, message: "Sessão removida com sucesso.", severity: "success" });
        } catch (e: any) {
            setSnack({
                open: true,
                message: e?.response?.data?.message ?? "Falha ao remover sessão.",
                severity: "error",
            });
        } finally {
            setDeleting(false);
            setConfirmOpen(false);
            setTarget(null);
        }
    };

    // CSV
    const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        const file = e.target.files?.[0] ?? null;
        if (!file) return;
        const isCsv = file.name.toLowerCase().endsWith(".csv") || file.type === "text/csv";
        if (!isCsv) {
            setUploadError("Selecione um arquivo .csv");
            setCsvFile(null);
            return;
        }
        setUploadError(null);
        setCsvFile(file);
    };

    const handleImport = async () => {
        if (!selectedSession?.id) return;
        if (!csvFile) { setUploadError("Selecione um arquivo .csv"); return; }
        try {
            setUploading(true);
            setUploadError(null);
            await uploadSessionMetrics(selectedSession.id, csvFile);
            setSessions(prev => prev.map(s => (s.id === selectedSession.id ? { ...s, has_metrics: true } : s)));
            setSnack({ open: true, message: "Métricas importadas com sucesso.", severity: "success" });
            setImportOpen(false);
        } catch (e: any) {
            console.error(e);
            setUploadError(e?.response?.data?.message ?? "Falha ao importar CSV.");
            setSnack({ open: true, message: "Falha ao importar CSV.", severity: "error" });
        } finally {
            setUploading(false);
        }
    };

    const handleDownloadTemplate = () => {
        const headers = [
            "session", "task", "date", "position", "dorsal", "player", "time", "total_distance",
            "minute_distance", "distance_vrange1", "distance_vrange2", "distance_vrange3", "distance_vrange4",
            "distance_vrange5", "distance_vrange6", "max_speed", "average_speed", "num_dec_expl", "max_dec",
            "num_acc_expl", "max_acc", "player_load", "hmld", "hmld_count", "hmld_relative", "hmld_time",
            "hid_intervals", "num_hids", "hsr", "sprints", "num_hsr", "time_vrange4", "rpe",
        ].join(";");
        const example = [
            "Partida x Time A;Total;2025-05-24;defender;2;Joao da Silva;784;5861,65;118,219;884,694;1066,515;1025,47;722,241;135,751;209,159;32,154;6,171;53;-7,186;51;4,513;200;980,234;183;29,348;4,27;2,018;15;339,117;11;15;2,41;7",
            "Partida x Time A;Total;2025-05-24;forward;10;Carlinhos;784;5861,65;118,219;884,694;1066,515;1025,47;722,241;135,751;209,159;32,154;6,171;53;-7,186;51;4,513;200;980,234;183;29,348;4,27;2,018;15;339,117;11;15;2,41;7",
        ].join("\n");
        const content = headers + "\n" + example;
        const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `session_${selectedSession?.id ?? "metrics"}_template.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const filtered = useMemo(() => {
        const lower = search.trim().toLowerCase();
        return sessions.filter((s) => {
            const matchType = filterType === "All" ? true : filterType;
            const matchText =
                !lower ||
                s.title?.toLowerCase().includes(lower) ||
                (s.location ?? "").toLowerCase().includes(lower) ||
                (s.description ?? "").toLowerCase().includes(lower);
            return matchType && matchText;
        });
    }, [sessions, search, filterType]);

    // datas
    const formatDate = (iso: string) => {
        if (/^\d{4}-\d{2}-\d{2}$/.test(iso)) {
            const [y, m, d] = iso.split("-").map(Number);
            const dt = new Date(y, m - 1, d);
            return dt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
        }
        const dt = new Date(iso);
        return dt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    };

    const listToRender: ("skeleton" | TrainerSession)[] =
        loading ? Array.from({ length: 8 }, () => "skeleton") : (filtered.length ? filtered : []);

    return (
        <Box sx={{ bgcolor: theme.palette.background.paper, minHeight: "100vh" }}>
            <HeaderHomeTrainer />

            <Box sx={{ px: 8, pt: 4, pb: 8 }}>
                {/* barra */}
                <Paper elevation={4} sx={{ position: "relative", mb: 2, borderRadius: 3, overflow: "hidden", bgcolor: "transparent" }}>
                    <Box sx={{
                        px: 2.5, py: 1.5, display: "flex", alignItems: "center", justifyContent: "space-between",
                        background: "linear-gradient(90deg, #1db954 0%, #17a24a 50%, #12903f 100%)",
                    }}>
                        <Typography variant="h6" fontWeight={700} color="#fff">Sessions</Typography>
                        <IconButton aria-label="New Session" size="small" sx={{
                            bgcolor: "rgba(255,255,255,0.15)", color: "#fff",
                            "&:hover": { bgcolor: "rgba(255,255,255,0.25)" },
                        }}>
                            <AddIcon />
                        </IconButton>
                    </Box>
                </Paper>

                {/* lista */}
                <Paper elevation={4} sx={{ borderRadius: 3, p: 2, bgcolor: theme.palette.background.default }}>
                    {/* toolbar */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                        <TextField
                            fullWidth
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search sessions…"
                            size="small"
                            variant="outlined"
                            InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment>) }}
                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                        />
                        <Button variant="outlined" startIcon={<FilterListIcon />} size="small" onClick={handleOpenFilter} sx={{ borderRadius: 2, textTransform: "none" }}>
                            Filter
                        </Button>
                    </Box>

                    {/* filtro */}
                    <Popover open={openFilter} anchorEl={filterAnchor} onClose={handleCloseFilter}
                        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                        transformOrigin={{ vertical: "top", horizontal: "left" }}
                        PaperProps={{ sx: { p: 2, borderRadius: 2 } }}>
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>Type</Typography>
                        <ToggleButtonGroup size="small" value={filterType} exclusive onChange={handleTypeChange}>
                            <ToggleButton value="All">All</ToggleButton>
                            <ToggleButton value="Training">Training</ToggleButton>
                            <ToggleButton value="Game">Game</ToggleButton>
                        </ToggleButtonGroup>
                    </Popover>

                    {/* cabeçalho */}
                    <Box sx={(t) => ({
                        display: "flex", alignItems: "center", px: 1.5, py: 1, borderRadius: 2,
                        bgcolor: t.palette.background.paper, color: t.palette.text.secondary, fontSize: 13, fontWeight: 700,
                    })}>
                        <Box sx={{ flex: 0.9 }}>Task</Box>
                        <Box sx={{ flex: 2.2 }}>Title</Box>
                        <Box sx={{ flex: 1.3 }}>Athletes</Box>
                        <Box sx={{ flex: 0.9, textAlign: "center" }}>Score</Box>
                        <Box sx={{ flex: 1.2 }}>Date</Box>
                        <Box sx={{ flex: 1 }}>Owner</Box>
                        <Box sx={{ width: 120, textAlign: "right" }}>Actions</Box>
                    </Box>

                    {/* linhas */}
                    {listToRender.length === 0 && !loading && (
                        <Typography sx={{ mt: 3, textAlign: "center" }} color="text.secondary">No sessions found.</Typography>
                    )}

                    {listToRender.map((row, i) => {
                        const isSkeleton = row === "skeleton";
                        const r = row as TrainerSession;

                        return (
                            <Box key={isSkeleton ? `skeleton-${i}` : r.id}
                                sx={(t) => ({
                                    display: "flex", alignItems: "center", px: 1.5, py: 1.25, mt: 1,
                                    borderRadius: 2, bgcolor: t.palette.background.paper, border: `1px solid ${t.palette.divider}`,
                                })}
                            >
                                <Box sx={{ flex: 0.9, color: "text.secondary" }}>
                                    {isSkeleton ? "—" : r.type === "Game" ? `GM-${r.id}` : `TR-${r.id}`}
                                </Box>

                                <Box sx={{ flex: 2.2 }}>
                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                        {isSkeleton ? "—" : r.title}
                                    </Typography>
                                </Box>

                                <Box sx={{ flex: 1.3, color: "text.secondary" }}>
                                    {r.athleteCount === null ? "—" : r.athleteCount}
                                </Box>

                                <Box sx={{ flex: 0.9, textAlign: "center" }}>
                                    {isSkeleton ? "—" : r.type === "Game" ? (r.score ?? "—") : "—"}
                                </Box>

                                <Box sx={{ flex: 1.2, color: "text.secondary" }}>
                                    {isSkeleton ? "—" : formatDate(r.date)}
                                </Box>

                                <Box sx={{ flex: 1 }}>
                                    <Avatar sx={{ width: 26, height: 26 }} src={r.trainerPhoto || undefined} />
                                </Box>

                                <Box sx={{ width: 120, display: "flex", justifyContent: "flex-end", gap: 1 }}>
                                    <Tooltip title="Info">
                                        <IconButton size="small">
                                            <InfoIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>

                                    <Tooltip title="View">
                                        <IconButton size="small">
                                            <VisibilityIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>

                                    <Tooltip title={r.has_metrics ? "Editar sessão" : "Importar métricas"}>
                                        <IconButton size="small" onClick={() => handleEditClick(r)}
                                            sx={{ color: r.has_metrics ? "success.main" : "warning.main" }}>
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>

                                    <Tooltip title="Delete">
                                        <IconButton size="small" color="error" onClick={() => handleRemoveClick(r)}>
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

            {/* Import CSV dialog*/}
            <Dialog open={importOpen} onClose={() => setImportOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>Importar métricas do treino</DialogTitle>
                <DialogContent dividers>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                        A sessão <b>{selectedSession?.title}</b> ainda não possui métricas. Importe um arquivo CSV.
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
                        <Button color="success" variant="outlined" component="label" disabled={uploading}>
                            Selecionar CSV
                            <input hidden type="file" accept=".csv,text/csv" onChange={handleFileChange} />
                        </Button>
                        {csvFile && (
                            <Typography variant="caption" color="text.secondary">Arquivo: {csvFile.name}</Typography>
                        )}
                        <Button color="success" onClick={handleDownloadTemplate} size="small">
                            Baixar template CSV
                        </Button>
                    </Box>
                    {uploadError && (
                        <Typography variant="caption" color="error" sx={{ mt: 1, display: "block" }}>
                            {uploadError}
                        </Typography>
                    )}
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: "block" }}>
                        Dica: verifique se os cabeçalhos são compatíveis (ex.: <code>athlete_id,date,distance_m,...</code>).
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button color="inherit" onClick={() => setImportOpen(false)} disabled={uploading}>Cancelar</Button>
                    <Button color="success" variant="contained" onClick={handleImport} disabled={uploading || !csvFile}>
                        {uploading ? "Importando..." : "Importar"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Confirmação de remoção */}
            <Dialog open={confirmOpen} onClose={() => !deleting && setConfirmOpen(false)} maxWidth="xs" fullWidth>
                <DialogTitle>Remover sessão</DialogTitle>
                <DialogContent dividers>
                    <Typography variant="body2">
                        Tem certeza que deseja remover a sessão <b>{target?.title}</b>?
                    </Typography>
                    {target?.has_metrics && (
                        <Typography variant="caption" color="warning.main" sx={{ mt: 1, display: "block" }}>
                            Atenção: esta sessão possui métricas importadas.
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button color="inherit" onClick={() => setConfirmOpen(false)} disabled={deleting}>Cancelar</Button>
                    <Button color="error" variant="contained" onClick={handleConfirmDelete} disabled={deleting}>
                        {deleting ? "Removendo..." : "Remover"}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snack.open}
                autoHideDuration={3500}
                onClose={() => setSnack(s => ({ ...s, open: false }))}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <Alert onClose={() => setSnack(s => ({ ...s, open: false }))} severity={snack.severity} sx={{ width: "100%" }}>
                    {snack.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}
