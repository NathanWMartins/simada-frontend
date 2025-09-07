import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Skeleton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DownloadIcon from "@mui/icons-material/Download";
import PsychologyIcon from "@mui/icons-material/Psychology";
import {
  exportAnswersToCSV,
  getPsychoAnswersBySession,
  PsychoAnswerDTO,
} from "../../../services/coach/session/psychoEmocional/psyFormAnswersService";
import HeaderHomeCoach from "../../../components/header/HeaderHomeCoach";
import { SwitchLightDarkMode } from "../../../components/common";

function colorPositive(value?: number) {
  if (value == null) return "text.secondary";
  if (value <= 4) return "error.main";  
  if (value === 5) return "warning.main";
  return "success.main";
}

function colorNegative(value?: number) {
  if (value == null) return "text.secondary";
  if (value >= 7) return "error.main";
  if (value === 6) return "warning.main";
  return "success.main";
}
function average(ns: number[]) {
  const arr = ns.filter((n) => Number.isFinite(n));
  if (!arr.length) return 0;
  return +(arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(2);
}

export default function PsychoAnswersPage() {
  const { id } = useParams<{ id: string }>();
  const sessionId = Number(id);

  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<PsychoAnswerDTO[]>([]);
  const [error, setError] = useState<string | null>(null);

  // filtros
  const [q, setQ] = useState("");
  const [position, setPosition] = useState<string>("");

  useEffect(() => {
    if (!sessionId) return;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getPsychoAnswersBySession(sessionId);
        setRows(data);
      } catch (e: any) {
        setError(e?.response?.data?.message || "Failed loading answers.");
      } finally {
        setLoading(false);
      }
    })();
  }, [sessionId]);

  // opções de posição vindas do DTO (ex.: "Goalkeeper", "Defender", ...)
  const positions = useMemo(() => {
    const set = new Set<string>();
    rows.forEach((r) => r.athlete_position && set.add(r.athlete_position));
    return Array.from(set).sort();
  }, [rows]);

  // aplica busca + posição
  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return rows.filter((r) => {
      const textOk =
        !term ||
        r.athlete_name.toLowerCase().includes(term) ||
        r.athlete_email.toLowerCase().includes(term);
      const posOk = !position || r.athlete_position === position;
      return textOk && posOk;
    });
  }, [rows, q, position]);

  // cards resumidos calculam sobre 'filtered'
  const summary = useMemo(() => {
    return {
      count: filtered.length,
      avgsrpe: average(filtered.map((r) => r.srpe)),
      avgFatigue: average(filtered.map((r) => r.fatigue)),
      avgSoreness: average(filtered.map((r) => r.soreness)),
      avgMood: average(filtered.map((r) => r.mood)),
      avgEnergy: average(filtered.map((r) => r.energy)),
    };
  }, [filtered]);

  if (loading) {
    return (
      <>
        <HeaderHomeCoach />
        <Box sx={{ p: 3 }}>
          <Stack spacing={2}>
            <Skeleton variant="rounded" height={90} />
            <Skeleton variant="rounded" height={380} />
          </Stack>
        </Box>
      </>
    );
  }

  if (error) {
    return (
      <>
        <HeaderHomeCoach />
        <Box sx={{ p: 3 }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      </>
    );
  }

  return (
    <>
      <HeaderHomeCoach />
      <Box sx={{ p: { xs: 2, md: 3 }, display: "grid", gap: 2 }}>
        {/* Header */}
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" spacing={1}>
            <PsychologyIcon />
            <Typography variant="h6" fontWeight={700}>
              Psychoemocional — Sessions Answers #{sessionId}
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1}>
            <Button
              color="success"
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={() => exportAnswersToCSV(filtered)}
              disabled={!filtered.length}
            >
              Export CSV
            </Button>
          </Stack>
        </Stack>

        {/* Resumo */}
        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Typography variant="overline" color="text.secondary">Answers</Typography>
              <Typography variant="h5" fontWeight={700}>{summary.count}</Typography>
            </CardContent>
          </Card>
          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Typography variant="overline" color="text.secondary">sRPE</Typography>
              <Typography variant="h5" fontWeight={700} sx={{ color: colorNegative(summary.avgsrpe) }}>
                {summary.avgsrpe || "—"}
              </Typography>
            </CardContent>
          </Card>
          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Typography variant="overline" color="text.secondary">Fatigue</Typography>
              <Typography variant="h5" fontWeight={700} sx={{ color: colorNegative(summary.avgFatigue) }}>
                {summary.avgFatigue || "—"}
              </Typography>
            </CardContent>
          </Card>
          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Typography variant="overline" color="text.secondary">Soreness</Typography>
              <Typography variant="h5" fontWeight={700} sx={{ color: colorNegative(summary.avgSoreness) }}>
                {summary.avgSoreness || "—"}
              </Typography>
            </CardContent>
          </Card>
          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Typography variant="overline" color="text.secondary">Mood</Typography>
              <Typography variant="h5" fontWeight={700} sx={{ color: colorPositive(summary.avgMood) }}>
                {summary.avgMood || "—"}
              </Typography>
            </CardContent>
          </Card>
          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Typography variant="overline" color="text.secondary">Energy</Typography>
              <Typography variant="h5" fontWeight={700} sx={{ color: colorPositive(summary.avgEnergy) }}>
                {summary.avgEnergy || "—"}
              </Typography>
            </CardContent>
          </Card>
        </Stack>

        {/* Filtros (busca + posição) */}
        <Paper sx={{ p: 2, borderRadius: 3 }}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <TextField
              fullWidth
              placeholder="Search for name or email"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              select
              label="Position"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              sx={{ minWidth: 220 }}
            >
              <MenuItem value="">All positions</MenuItem>
              {positions.map((p) => (
                <MenuItem key={p} value={p}>{p}</MenuItem>
              ))}
            </TextField>
          </Stack>
        </Paper>

        {/* Tabela */}
        <Paper sx={{ p: 2, borderRadius: 3 }}>
          {!filtered.length ? (
            <Typography color="text.secondary" sx={{ textAlign: "center", py: 6 }}>
              Any answer finded using the filter.
            </Typography>
          ) : (
            <Box sx={{ overflowX: "auto" }}>
              <Box
                component="table"
                sx={{
                  borderCollapse: "separate",
                  borderSpacing: 0,
                  width: "100%",
                  "& th, & td": { p: 1.25, borderBottom: "1px solid", borderColor: "divider", whiteSpace: "nowrap" },
                  "& th": { fontSize: 12, textTransform: "uppercase", color: "text.secondary" },
                }}
              >
                <thead>
                  <tr>
                    <th>Athlete</th>
                    <th>Position</th>
                    <th>E-mail</th>
                    <th>Sended at</th>
                    <th>sRPE</th>
                    <th>Fatigue</th>
                    <th>Soreness</th>
                    <th>Mood</th>
                    <th>Energy</th>
                    <th>Token</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r) => (
                    <tr key={r.id}>
                      <td>
                        <Stack direction="row" spacing={1.25} alignItems="center">
                          <Avatar src={r.athlete_photo || undefined} sx={{ width: 32, height: 32 }}>
                            {r.athlete_name?.[0]?.toUpperCase()}
                          </Avatar>
                          <Typography variant="body2" fontWeight={600}>{r.athlete_name}</Typography>
                        </Stack>
                      </td>
                      <td><Typography variant="body2" color="text.secondary">{r.athlete_position || "—"}</Typography></td>
                      <td><Typography variant="body2" color="text.secondary">{r.athlete_email}</Typography></td>
                      <td><Typography variant="body2">{new Date(r.submitted_at).toLocaleString()}</Typography></td>
                      <td><Typography variant="body2" sx={{ color: colorNegative(r.srpe) }}>{r.srpe}</Typography></td>
                      <td><Typography variant="body2" sx={{ color: colorNegative(r.fatigue) }}>{r.fatigue}</Typography></td>
                      <td><Typography variant="body2" sx={{ color: colorNegative(r.soreness) }}>{r.soreness}</Typography></td>
                      <td><Typography variant="body2" sx={{ color: colorPositive(r.mood) }}>{r.mood}</Typography></td>
                      <td><Typography variant="body2" sx={{ color: colorPositive(r.energy) }}>{r.energy}</Typography></td>
                      <td>
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                          <Typography variant="caption" color="text.secondary">{r.token}</Typography>
                          <Tooltip title="Copiar token">
                            <IconButton size="small" onClick={() => navigator.clipboard.writeText(r.token)}>
                              <ContentCopyIcon fontSize="inherit" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Box>
            </Box>
          )}
        </Paper>

        <SwitchLightDarkMode />
      </Box>
    </>
  );
}
