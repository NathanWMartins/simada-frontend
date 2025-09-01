import { Avatar, Box, IconButton, Tooltip, Typography } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import InfoIcon from "@mui/icons-material/Info";
import type { TrainerSession } from "../../../types/sessionType";

type Props = {
    s: TrainerSession; formatDate: (iso: string) => string;
    onInfo: (s: TrainerSession) => void;
    onEdit: (s: TrainerSession) => void;
    onDelete: (s: TrainerSession) => void;
};
export default function SessionRow({ s, formatDate, onInfo, onEdit, onDelete }: Props) {
    return (
        <Box sx={(t) => ({
            display: "flex", alignItems: "center", px: 1.5, py: 1.25, mt: 1,
            borderRadius: 2, bgcolor: t.palette.background.paper, border: `1px solid ${t.palette.divider}`,
        })}>
            <Box sx={{ flex: 0.9, color: "text.secondary" }}>{s.type === "Game" ? `GM-${s.id}` : `TR-${s.id}`}</Box>
            <Box sx={{ flex: 2.2 }}><Typography variant="body2" sx={{ fontWeight: 600 }}>{s.title}</Typography></Box>
            <Box sx={{ flex: 1.3, color: "text.secondary" }}>{s.athleteCount ?? "—"}</Box>
            <Box sx={{ flex: 0.9, textAlign: "center" }}>{s.type === "Game" ? (s.score ?? "—") : "—"}</Box>
            <Box sx={{ flex: 1.2, color: "text.secondary" }}>{formatDate(s.date)}</Box>
            <Box sx={{ flex: 1 }}><Avatar sx={{ width: 26, height: 26 }} src={s.trainerPhoto || undefined} /></Box>
            <Box sx={{ width: 120, display: "flex", justifyContent: "flex-end", gap: 1 }}>
                <Tooltip title="Info"><IconButton size="small" onClick={() => onInfo(s)}><InfoIcon fontSize="small" /></IconButton></Tooltip>
                <Tooltip title="View"><IconButton size="small"><VisibilityIcon fontSize="small" /></IconButton></Tooltip>
                <Tooltip title={s.has_metrics ? "Editar sessão" : "Importar métricas"}>
                    <IconButton size="small" onClick={() => onEdit(s)} sx={{ color: s.has_metrics ? "success.main" : "warning.main" }}>
                        <EditIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Delete"><IconButton size="small" color="error" onClick={() => onDelete(s)}><DeleteIcon fontSize="small" /></IconButton></Tooltip>
            </Box>
        </Box>
    );
}
