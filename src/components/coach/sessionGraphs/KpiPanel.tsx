import React from "react";
import { Box, Card, CardContent, Chip, Divider, Stack, Typography } from "@mui/material";


type KpiRow = { metric: string; value: string; change?: number | null };


export const KpiPanel: React.FC<{ rows: KpiRow[] }> = ({ rows }) => (
    <Card sx={{ flex: 1, minWidth: 360 }}>
        <CardContent>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Session Metrics
            </Typography>
            <Divider sx={{ mb: 1 }} />
            <Stack spacing={1}>
                {rows.map((r) => (
                    <Box key={r.metric} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <Typography variant="body2" color="text.secondary">
                            {r.metric}
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Chip size="small" label={r.value} variant="outlined" />
                            {typeof r.change === "number" && (
                                <Chip
                                    size="small"
                                    label={`${r.change > 0 ? "+" : ""}${(r.change * 100).toFixed(1)}%`}
                                    color={r.change > 0 ? "success" : r.change < 0 ? "warning" : "default"}
                                />
                            )}
                        </Stack>
                    </Box>
                ))}
            </Stack>
        </CardContent>
    </Card>
);