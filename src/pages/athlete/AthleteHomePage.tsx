import { useEffect, useMemo, useState } from "react";
import {
    Avatar, Box, Button, Card, Divider, Paper, Skeleton, Stack, Typography,
    useTheme, Alert
} from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import SportsScoreIcon from "@mui/icons-material/SportsScore";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import BarChartIcon from "@mui/icons-material/BarChart";
import { useNavigate } from "react-router-dom";
import StatCard from "../../components/athlete/StatCard";
import DetailsList from "../../components/athlete/DetailList";
import MiniCalendar from "../../components/athlete/MiniCalendar";
import {
    getAthleteSummary, getAthletePerformance, getAthleteRecent, getAthleteNextMatch, getAthleteCalendar,
    type PerfHighlight, type MatchInfo, type CalendarEvent
} from "../../services/athlete/athleteHomeService";
import { useUserContext } from "../../contexts/UserContext";
import type { Athletes } from "../../types/athleteType";
import HeaderHomeAthlete from "../../components/header/HeaderHomeAthlete";
import { SwitchLightDarkMode } from "../../components/common";
import GroupsIcon from '@mui/icons-material/Groups';
import { AccountBox } from "@mui/icons-material";

export default function AthleteHomePage() {
    const theme = useTheme();
    const navigate = useNavigate();
    const { user } = useUserContext();
    const athleteId = useMemo(() => Number(user?.id ?? 0), [user?.id]);

    const [profile, setProfile] = useState<Athletes | null>(null);
    const [perf, setPerf] = useState<PerfHighlight | null>(null);
    const [recent, setRecent] = useState<MatchInfo | null>(null);
    const [nextMatch, setNextMatch] = useState<MatchInfo | null>(null);
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [refDate] = useState(new Date());

    useEffect(() => {
        (async () => {
            if (!athleteId) {
                setError("Athlete not identified.");
                setLoading(false);
                return;
            }
            setLoading(true);
            setError(null);
            try {
                const [p, ph, r, n, ev] = await Promise.all([
                    getAthleteSummary(athleteId),
                    getAthletePerformance(athleteId),
                    getAthleteRecent(athleteId),
                    getAthleteNextMatch(athleteId),
                    getAthleteCalendar(athleteId, refDate.getFullYear(), refDate.getMonth()),
                ]);
                setProfile(p as unknown as Athletes);
                setPerf(ph);
                setRecent(r);
                setNextMatch(n);
                setEvents(ev);
            } catch (e: any) {
                const msg = e?.response?.data?.message || e?.message || "Could not load athlete home data.";
                setError(msg);
            } finally {
                setLoading(false);
            }
        })();
    }, [athleteId, refDate]);

    const greenGrad = "linear-gradient(90deg, #1db954 0%, #17a24a 50%, #12903f 100%)";

    const compactCard = {
        p: 1.5,
        borderRadius: 2,
        boxShadow: theme.shadows[2],
        border: "1px solid",
        borderColor: "divider",
        bgcolor: theme.palette.background.paper,
    } as const;

    const innerBlock = {
        p: 1,
        borderRadius: 1.5,
        border: "1px solid",
        borderColor: "divider",
    } as const;

    return (
        <>
            <HeaderHomeAthlete />
            <Box sx={{ minHeight: "100vh", bgcolor: theme.palette.background.default }}>

                {/* Barra verde de boas-vindas */}
                <Box sx={{ px: { xs: 2, md: 6 }, pt: 3 }}>
                    <Paper elevation={4} sx={{ borderRadius: 3, overflow: "hidden", mb: 2 }}>
                        <Box sx={{ p: 2, background: greenGrad, color: "#fff" }}>
                            <Typography variant="subtitle2">
                                {new Date().toLocaleDateString(undefined, { weekday: "short", day: "2-digit", month: "long", year: "numeric" })}
                            </Typography>
                            <Typography variant="h6" fontWeight={800}>
                                Hello, {profile?.name ?? (loading ? "…" : "Athlete")}
                            </Typography>
                        </Box>
                    </Paper>
                </Box>

                <Box sx={{ px: { xs: 2, md: 6 }, pb: 6 }}>
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    {!error && (
                        <Stack direction={{ xs: "column", lg: "row" }} spacing={2} alignItems="stretch">
                            {/* Coluna esquerda — Perfil */}
                            <Stack sx={{ flexBasis: { lg: "20%" }, flexGrow: 1 }} spacing={2}>
                                <Card sx={compactCard}>
                                    <Stack spacing={2}>
                                        <Stack direction="row" spacing={2} alignItems="center">
                                            {loading ? (
                                                <Skeleton variant="circular" width={72} height={72} />
                                            ) : (
                                                <Avatar src={user?.userPhoto || undefined} sx={{ width: 72, height: 72 }}>
                                                    {profile?.name?.[0]?.toUpperCase()}
                                                </Avatar>
                                            )}
                                            <Box>
                                                <Typography variant="h6" fontWeight={700}>
                                                    {loading ? <Skeleton width={140} /> : profile?.name}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {loading ? <Skeleton width={180} /> : (profile?.email || "—")}
                                                </Typography>
                                            </Box>
                                        </Stack>

                                        <Divider />

                                        <SectionTitle title="Personal Details" />
                                        {loading ? (
                                            <Stack spacing={1.2}>
                                                {Array.from({ length: 6 }).map((_, i) => (
                                                    <Skeleton key={i} variant="rounded" height={22} />
                                                ))}
                                            </Stack>
                                        ) : (
                                            <DetailsList
                                                items={[
                                                    ["Height", profile?.extra?.height_cm?.toString() ?? "—"],
                                                    ["Weight", profile?.extra?.weight_kg?.toString() ?? "—"],
                                                    ["Lean mass", profile?.extra?.lean_mass_kg?.toString() ?? "—"],
                                                    ["Fat mass", profile?.extra?.fat_mass_kg?.toString() ?? "—"],
                                                    ["Body fat", profile?.extra?.body_fat_pct?.toString() ?? "—"],
                                                    ["Birth", profile?.birth ?? "—"],
                                                    ["Injury status", profile?.extra?.injury_status ?? "—"],
                                                    ["Nationalty", profile?.extra?.nationality ?? "—"]
                                                ]}
                                            />
                                        )}
                                    </Stack>
                                </Card>
                            </Stack>

                            {/* Coluna centro — métricas em row; os demais em coluna full-width */}
                            <Stack sx={{ flexBasis: { lg: "20%" }, flexGrow: 1 }} spacing={3}>
                                {/* Linha superior: performance e posição (row) */}
                                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                                    <StatCard
                                        title="Your Performance"
                                        value={loading ? undefined : perf?.points}
                                        unit="points"
                                        icon={<TrendingUpIcon />}
                                    />
                                    <StatCard
                                        title=" Position Rank"
                                        value={loading ? undefined : perf?.rank}
                                        unit="º"
                                        icon={<SportsScoreIcon />}
                                    />
                                </Stack>

                                {/* Recent Performance */}
                                <Card sx={{ ...compactCard }}>
                                    <Stack spacing={1}>
                                        <SectionTitle title="Recent Performance" icon={<BarChartIcon />} />
                                        {loading ? (
                                            <Skeleton variant="rounded" height={48} />
                                        ) : (
                                            <Box sx={{ ...innerBlock, display: "flex", alignItems: "center", gap: 1 }}>
                                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                                    <Typography variant="body2" noWrap title={recent?.title}>
                                                        {recent?.title || "—"}
                                                    </Typography>
                                                </Box>
                                                {recent && recent.title !== "No recent game" && (
                                                    <Button
                                                        variant="contained"
                                                        size="small"
                                                        startIcon={<PlayCircleOutlineIcon />}
                                                        sx={{
                                                            borderRadius: 1.5,
                                                            px: 1.5,
                                                            backgroundColor: "#2CAE4D",
                                                            "&:hover": { backgroundColor: "#17a24a" },
                                                        }}
                                                        onClick={() =>
                                                            navigate(`/sessions/${recent.id}/metrics?athlete=${user?.id}`)
                                                        }
                                                    >
                                                        Visualize
                                                    </Button>
                                                )}
                                            </Box>
                                        )}
                                    </Stack>
                                </Card>

                                {/* Next Match — full width */}
                                <Card sx={{ ...compactCard }}>
                                    <Stack spacing={1}>
                                        <SectionTitle title="Next Match" icon={<SportsScoreIcon />} />
                                        {loading ? (
                                            <Skeleton variant="rounded" height={48} />
                                        ) : (
                                            <Box sx={{ ...innerBlock }}>
                                                <Typography variant="body2" noWrap title={nextMatch?.title}>
                                                    {nextMatch?.title || "—"}
                                                </Typography>
                                            </Box>
                                        )}
                                    </Stack>
                                </Card>
                            </Stack>


                            {/* Coluna direita — Calendário + ações */}
                            <Stack sx={{ flexBasis: { lg: "28%" }, flexGrow: 1 }} spacing={2}>
                                <Card sx={compactCard}>
                                    <SectionTitle title={new Date().toLocaleString("en-US", { month: "long", year: "numeric" })} icon={<CalendarMonthIcon />} />
                                    <Box sx={{ mt: 1 }}>
                                        <MiniCalendar markers={events} />
                                    </Box>
                                    <Divider sx={{ my: 1.5 }} />
                                    <Typography variant="caption" color="text.secondary">
                                        Hover the highlighted days to see details.
                                    </Typography>
                                </Card>
                            </Stack>

                            <Stack sx={{ flexBasis: { lg: "15%" }, flexGrow: 1 }} spacing={2}>
                                <Card
                                    onClick={() => navigate("/athlete/sessions")}
                                    sx={{
                                        borderRadius: 2,
                                        p: 3,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        cursor: "pointer",
                                        bgcolor: theme.palette.background.paper,
                                        "&:hover": { opacity: 0.9 },
                                    }}
                                >
                                    <Stack direction="column" alignItems="center" spacing={1}>
                                        <CalendarMonthIcon fontSize="large" sx={{ color: "#2CAE4D" }} />
                                        <Typography fontWeight={600}>My Sessions</Typography>
                                    </Stack>
                                </Card>

                                <Card
                                    onClick={() => navigate("/athlete/team")}
                                    sx={{
                                        borderRadius: 2,
                                        p: 3,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        cursor: "pointer",
                                        bgcolor: theme.palette.background.paper,
                                        "&:hover": { opacity: 0.9 },
                                    }}
                                >
                                    <Stack direction="column" alignItems="center" spacing={1}>
                                        <GroupsIcon fontSize="large" sx={{ color: "#2CAE4D" }} />
                                        <Typography fontWeight={600}>Team</Typography>
                                    </Stack>
                                </Card>

                                <Card
                                    onClick={() => navigate("/athlete/profile")}
                                    sx={{
                                        borderRadius: 2,
                                        p: 3,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        cursor: "pointer",
                                        bgcolor: theme.palette.background.paper,
                                        "&:hover": { opacity: 0.9 },
                                    }}
                                >
                                    <Stack direction="column" alignItems="center" spacing={1}>
                                        <AccountBox fontSize="large" sx={{ color: "#2CAE4D" }} />
                                        <Typography fontWeight={600}>Profile</Typography>
                                    </Stack>
                                </Card>
                            </Stack>

                        </Stack>
                    )}
                </Box>
                <SwitchLightDarkMode />
            </Box>
        </>
    );
}

function SectionTitle({ title, icon }: { title: string; icon?: React.ReactNode }) {
    return (
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
            {icon && <Box sx={{ display: "grid", placeItems: "center", width: 22, height: 22, justifyContent: "center" }}>{icon}</Box>}
            <Typography variant="subtitle1" fontWeight={700}>{title}</Typography>
        </Stack>
    );
}
