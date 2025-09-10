import { Avatar, Box, IconButton, Tooltip, Typography } from "@mui/material";
import InfoIcon from "@mui/icons-material/InfoOutlined";
import { PeerAthlete } from "../../services/athlete/peersService";

type Props = {
    p: PeerAthlete;
    onInfo: (p: PeerAthlete) => void;
};

export default function PeerRow({ p, onInfo }: Props) {
    return (
        <Box
            sx={(t) => ({
                display: "grid",
                gridTemplateColumns:
                    "minmax(0,3fr) minmax(0,1fr) minmax(0,0.6fr) minmax(200px,2fr) minmax(0,1.2fr) minmax(0,0.8fr) 88px",
                columnGap: 12,
                alignItems: "center",
                px: 1.5,
                py: 1.1,
                mt: 1,
                borderRadius: 2,
                bgcolor: t.palette.background.paper,
                border: `1px solid ${t.palette.divider}`,
                "&:hover": { boxShadow: t.shadows[2] },
                overflow: "hidden", // proteção
            })}
        >
            {/* Name */}
            <Box sx={{ minWidth: 0, display: "flex", alignItems: "center", gap: 1.25 }}>
                <Avatar src={p.avatar || undefined} sx={{ width: 30, height: 30, flex: "0 0 auto" }} />
                <Typography
                    title={p.name}
                    sx={{
                        fontWeight: 700,
                        lineHeight: 1.25,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        minWidth: 0,
                    }}
                >
                    {p.name}
                </Typography>
            </Box>

            {/* Position */}
            <Box sx={{ minWidth: 0 }}>
                <Typography variant="body2">{p.position ?? "—"}</Typography>
            </Box>

            {/* # */}
            <Box sx={{ minWidth: 0 }}>
                <Typography variant="body2">{p.jersey ?? "—"}</Typography>
            </Box>

            {/* Email */}
            <Box sx={{ minWidth: 0 }}>
                <Typography
                    title={p.email ?? ""}
                    noWrap
                    sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        display: "block",
                        fontSize: 14,
                        minWidth: 0,
                    }}
                >
                    {p.email ?? "—"}
                </Typography>
            </Box>

            {/* Nationality */}
            <Box sx={{ minWidth: 0 }}>
                <Typography variant="body2">{p.nationality ?? "—"}</Typography>
            </Box>

            {/* Points */}
            <Box sx={{ minWidth: 0 }}>
                <Typography variant="body2">{p.points ?? "—"}</Typography>
            </Box>

            {/* Actions */}
            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 0.5 }}>
                <Tooltip title="Info">
                    <IconButton size="small" onClick={() => onInfo(p)}>
                        <InfoIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            </Box>
        </Box>

    );
}
