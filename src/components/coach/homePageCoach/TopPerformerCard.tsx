import { Avatar, Box, Typography, Skeleton, Alert as MuiAlert, Paper } from "@mui/material";
import { SxProps, useTheme } from "@mui/system";

type Props = {
    name?: string;
    avatarUrl?: string;
    score?: number;
    delta?: number;
    loading?: boolean;
    error?: string | null;
    sx?: SxProps;
};

export default function TopPerformerCard({
    name,
    avatarUrl,
    score,
    delta,
    loading = false,
    error = null,
    sx,
}: Props) {
    const theme = useTheme();

    // estados especiais
    if (error) {
        return (
            <Paper
                elevation={0}
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: 250,
                    width: 150,
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    bgcolor: "background.paper",
                    p: 1.5,
                    ...sx,
                }}
            >
                <MuiAlert severity="error" variant="outlined" sx={{ fontSize: 12, p: 1 }}>
                    {error}
                </MuiAlert>
            </Paper>
        );
    }

    if (loading) {
        return (
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    height: 250,
                    width: 150,
                    alignItems: "center",
                    p: 2,
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    bgcolor: "background.paper",
                    ...sx,
                }}
            >
                <Skeleton variant="circular" width={60} height={60} sx={{ mt: 1 }} />
                <Skeleton variant="text" width="70%" sx={{ mt: 2 }} />
                <Skeleton variant="text" width="40%" sx={{ mt: 1 }} />
                <Skeleton variant="text" width="30%" sx={{ mt: 1 }} />
            </Box>
        );
    }

    // estado normal
    const color =
        typeof delta === "number" ? (delta >= 0 ? "success.main" : "error.main") : "text.secondary";
    const deltaText = typeof delta === "number" ? (delta >= 0 ? `+${delta}` : `${delta}`) : "0";

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                height: 250,
                width: 150,
                alignItems: "center",
                p: 2,
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
                bgcolor: "background.paper",
                ...sx,
            }}
        >
            <Avatar src={avatarUrl || undefined} alt={name || "User"} sx={{ width: 60, height: 60 }} />
            <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 1 }}>
                {name || "Nome"}
            </Typography>
            <Typography variant="h3" sx={{ color: theme.palette.text.primary, pt: 1 }}>
                {typeof score === "number" ? score : 0}
            </Typography>
            <Typography variant="h6" sx={{ pt: 1 }} color={color}>
                {deltaText}
            </Typography>
        </Box>
    );
}
