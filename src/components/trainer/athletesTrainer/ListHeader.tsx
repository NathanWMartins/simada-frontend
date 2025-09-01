import { Box } from "@mui/material";

export default function ListHeader() {
    return (
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
            <Box sx={{ flex: 1.4 }}>Position</Box>
            <Box sx={{ flex: 2 }}>Email</Box>
            <Box sx={{ flex: 1.3 }}>Birth</Box>
            <Box sx={{ flex: 1.3 }}>Phone</Box>
            <Box sx={{ width: 120, textAlign: "right" }}>Actions</Box>
        </Box>
    );
}
