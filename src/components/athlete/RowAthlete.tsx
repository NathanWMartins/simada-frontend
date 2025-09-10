import { Avatar, Box, Button, IconButton, Tooltip, Typography } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import InfoIcon from "@mui/icons-material/Info";
import { AthleteSession } from "../../services/athlete/sessionsService";
import { useNavigate } from "react-router-dom";

type Props = {
    s: AthleteSession;
    formatDate: (iso: string) => string;
    onInfo: (s: AthleteSession) => void;
    onOpenMetrics: (s: AthleteSession) => void;
    onNoMetrics: (s: AthleteSession) => void;
};

export default function AthleteSessionRow({ s, formatDate, onInfo, onOpenMetrics, onNoMetrics }: Props) {
    const navigate = useNavigate();

    const handleView = () => {
        if (s.has_metrics) {
            navigate(`/sessions/${s.id}/metrics`);
        } else {
            if (onNoMetrics) onNoMetrics(s);
            else alert("This session don't have imported metrics.");
        }
    };

    return (
        <Box
            sx={(t) => ({
                display: "grid",
                gridTemplateColumns: "2.5fr 1.2fr 1fr 0.8fr 1fr 1fr 100px",
                columnGap: 16,
                alignItems: "center",
                px: 1.5,
                py: 1.25,
                mt: 1,
                borderRadius: 2,
                bgcolor: t.palette.background.paper,
                border: `1px solid ${t.palette.divider}`,
                "&:hover": { boxShadow: t.shadows[2] },
            })}
        >
            {/* Title */}
            <Box sx={{ minWidth: 0 }}>
                <Typography noWrap fontWeight={700} sx={{ lineHeight: 1.25 }}>
                    {s.title}
                </Typography>
                {s.description && (
                    <Typography noWrap variant="body2" color="text.secondary">
                        {s.description}
                    </Typography>
                )}
            </Box>

            <Box>
                <Typography variant="body2">{s.type}</Typography>
            </Box>

            <Box>
                <Typography variant="body2">{s.location ?? "—"}</Typography>
            </Box>

            <Box sx={{ textAlign: "center" }}>
                <Typography variant="body2">{s.score ?? "—"}</Typography>
            </Box>

            <Box>
                <Typography variant="body2">{formatDate(s.date)}</Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Avatar sx={{ width: 26, height: 26 }} src={s.coachPhoto || undefined} />
            </Box>

            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 0.5 }}>
                <Tooltip title="View">
                    <IconButton size="small" onClick={handleView}>
                        <VisibilityIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            </Box>
        </Box>
    );
}
