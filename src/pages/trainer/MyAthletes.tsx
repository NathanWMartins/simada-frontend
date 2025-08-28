import React, { useEffect, useMemo, useState } from "react";
import {
    Box, Paper, Typography, IconButton, TextField, Button, Avatar, InputAdornment,
    Popover, ToggleButtonGroup, ToggleButton, Tooltip, Skeleton, Alert as MuiAlert,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import HeaderHomeTrainer from "../../components/header/HeaderHomeTrainer";
import { SwitchLightDarkMode } from "../../components/common";
import { getAthletes } from "../../services/trainer/athletes/athletesService";
import { TrainerAthletes } from "../../services/types/types";
import { useUserContext } from "../../contexts/UserContext";

export default function MyAthletes() {
    const theme = useTheme();

    const {user} = useUserContext();
    const [athletes, setAthletes] = useState<TrainerAthletes[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState<"all" | "active" | "injured" | "inactive">("all");
    const [filterAnchor, setFilterAnchor] = useState<HTMLElement | null>(null);
    const openFilter = Boolean(filterAnchor);

    useEffect(() => {
        (async () => {
            try {
                if(!user) return
                setLoading(true);
                setError(null);
                const data = await getAthletes(user.id, { q: "jo", status: "active", page: 2, limit: 20 });
                setAthletes(data ?? []);
            } catch (e: any) {
                console.error(e);
                setError("Falha ao carregar atletas.");
                setAthletes([]);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const handleOpenFilter = (e: React.MouseEvent<HTMLElement>) => setFilterAnchor(e.currentTarget);
    const handleCloseFilter = () => setFilterAnchor(null);
    const handleStatusChange = (_: any, val: "all" | "active" | "injured" | "inactive" | null) => {
        if (val) setFilterStatus(val);
    };

    const filtered = useMemo(() => {
        const lower = search.trim().toLowerCase();
        return athletes.filter((a) => {
            const matchStatus = filterStatus === "all" ? true : (a.status ?? "active") === filterStatus;
            const matchText =
                !lower ||
                a.name.toLowerCase().includes(lower) ||
                (a.email ?? "").toLowerCase().includes(lower) ||
                (a.phone ?? "").toLowerCase().includes(lower);
            return matchStatus && matchText;
        });
    }, [athletes, search, filterStatus]);

    const listToRender: ("skeleton" | TrainerAthletes)[] =
        loading ? Array.from({ length: 8 }, () => "skeleton") : (filtered.length ? filtered : []);

    const formatDate = (iso: string) =>
        new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

    return (
        <Box sx={{ bgcolor: theme.palette.background.paper, minHeight: "100vh" }}>
            <HeaderHomeTrainer />

            <Box sx={{ px: 8, pt: 4, pb: 8 }}>
                {/* Barra verde: My Athletes */}
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
                            My Athletes
                        </Typography>

                        <IconButton
                            aria-label="New Athlete"
                            size="small"
                            sx={{
                                bgcolor: "rgba(255,255,255,0.15)",
                                color: "#fff",
                                "&:hover": { bgcolor: "rgba(255,255,255,0.25)" },
                            }}
                        // onClick={() => navigate("/athletes/new")}
                        >
                            <AddIcon />
                        </IconButton>
                    </Box>
                </Paper>

                {/* Conteúdo */}
                <Paper elevation={4} sx={{ borderRadius: 3, p: 2, bgcolor: theme.palette.background.default }}>
                    {/* Toolbar */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                        <TextField
                            fullWidth
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search athletes…"
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
                            Status
                        </Typography>
                        <ToggleButtonGroup size="small" value={filterStatus} exclusive onChange={handleStatusChange}>
                            <ToggleButton value="all">All</ToggleButton>
                            <ToggleButton value="active">Active</ToggleButton>
                            <ToggleButton value="injured">Injured</ToggleButton>
                            <ToggleButton value="inactive">Inactive</ToggleButton>
                        </ToggleButtonGroup>
                    </Popover>

                    {/* Header da lista */}
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
                        <Box sx={{ flex: 2 }}>Name</Box>
                        <Box sx={{ flex: 2 }}>Email</Box>
                        <Box sx={{ flex: 1.3 }}>Birth</Box>
                        <Box sx={{ flex: 1.3 }}>Phone</Box>
                        <Box sx={{ width: 120, textAlign: "right" }}>Actions</Box>
                    </Box>

                    {/* Empty/Error */}
                    {!loading && error && (
                        <MuiAlert severity="error" variant="outlined" sx={{ mt: 2 }}>
                            {error}
                        </MuiAlert>
                    )}
                    {listToRender.length === 0 && !loading && !error && (
                        <Typography sx={{ mt: 3, textAlign: "center" }} color="text.secondary">
                            No athletes found.
                        </Typography>
                    )}

                    {/* Linhas */}
                    {listToRender.map((row, i) => {
                        const isSkeleton = row === "skeleton";
                        const a = row as TrainerAthletes;

                        return (
                            <Box
                                key={isSkeleton ? `skeleton-${i}` : a.id}
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
                                {/* Name (avatar + nome) */}
                                <Box sx={{ flex: 2, display: "flex", alignItems: "center", gap: 1.25 }}>
                                    {isSkeleton ? (
                                        <>
                                            <Skeleton variant="circular" width={28} height={28} />
                                            <Skeleton variant="text" width={140} />
                                        </>
                                    ) : (
                                        <>
                                            <Avatar src={a.avatarUrl ?? undefined} sx={{ width: 28, height: 28 }} />
                                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                {a.name}
                                            </Typography>
                                        </>
                                    )}
                                </Box>

                                {/* Email */}
                                <Box sx={{ flex: 2, color: "text.secondary" }}>
                                    {isSkeleton ? <Skeleton variant="text" width={180} /> : a.email}
                                </Box>

                                {/* Birth */}
                                <Box sx={{ flex: 1.3, color: "text.secondary" }}>
                                    {isSkeleton ? <Skeleton variant="text" width={90} /> : formatDate(a.birth)}
                                </Box>

                                {/* Phone */}
                                <Box sx={{ flex: 1.3, color: "text.secondary" }}>
                                    {isSkeleton ? <Skeleton variant="text" width={110} /> : (a.phone || "—")}
                                </Box>

                                {/* Actions */}
                                <Box sx={{ width: 120, display: "flex", justifyContent: "flex-end", gap: 1 }}>
                                    {isSkeleton ? (
                                        <>
                                            <Skeleton variant="circular" width={28} height={28} />
                                            <Skeleton variant="circular" width={28} height={28} />
                                            <Skeleton variant="circular" width={28} height={28} />
                                        </>
                                    ) : (
                                        <>
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
                                        </>
                                    )}
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
