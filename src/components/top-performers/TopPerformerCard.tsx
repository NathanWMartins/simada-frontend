import { Avatar, Box, Typography } from "@mui/material";
import { SxProps } from "@mui/system";

type Props = {
    name?: string;
    avatarUrl?: string;
    score?: number;
    delta?: number;
    sx?: SxProps;
};

export default function TopPerformerCard({ name, avatarUrl, score, delta, sx }: Props) {
    const color = typeof delta === "number" ? (delta >= 0 ? "success.main" : "error.main") : "text.secondary";
    const deltaText = typeof delta === "number" ? (delta >= 0 ? `+${delta}` : `${delta}`) : "0";

    return (
        <Box
            sx={{
                display: "flex", flexDirection: "column", height: 250, width: 130,
                alignItems: "center", p: 2, borderRadius: 2, border: "1px solid",
                borderColor: "divider", bgcolor: "background.paper", ...sx
            }}
        >
            <Avatar src={avatarUrl || undefined} alt={name || "User"} sx={{ width: 60, height: 60 }} />
            <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 1 }}>
                {name || "Nome"}
            </Typography>
            <Typography variant="h3" sx={{ color: "text.secondary", pt: 1 }}>
                {score ?? 0}
            </Typography>
            <Typography variant="h6" sx={{ pt: 1 }} color={color}>
                {deltaText}
            </Typography>
        </Box>
    );
}