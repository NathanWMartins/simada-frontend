import React from "react";
import { Box, Stack } from "@mui/system";
import { Card, Skeleton, Typography, useTheme } from "@mui/material";

export default function StatCard({ title, value, unit, icon }: { title: string; value?: number; unit?: string; icon: React.ReactNode }) {
    const theme = useTheme();
    return (
        <Card sx={{
            p: 1.5,
            borderRadius: 2,
            boxShadow: theme.shadows[2],
            border: "1px solid",
            borderColor: "divider",
            bgcolor: theme.palette.background.paper,
        }}>
            <Stack spacing={0.5}>
                <Stack direction="row" alignItems="center" spacing={1}>
                    <Box sx={{ width: 20, height: 20, display: "grid", placeItems: "center" }}>{icon}</Box>
                    <Typography variant="caption" color="text.secondary">{title}</Typography>
                </Stack>
                {value === undefined ? (
                    <Skeleton width={80} height={36} />
                ) : (
                    <Stack direction="row" alignItems="baseline" spacing={0.5}>
                        <Typography variant="h4" fontWeight={800}>{value}</Typography>
                        {unit && <Typography variant="caption" color="text.secondary">{unit}</Typography>}
                    </Stack>
                )}
            </Stack>
        </Card>
    );
}