import { Typography } from '@mui/material';
import { Stack } from '@mui/system';
import React from 'react'

export default function DetailsList({ items }: { items: [string, string][] }) {
    return (
        <Stack spacing={1}>
            {items.map(([k, v]) => (
                <Stack key={k} direction="row" justifyContent="space-between" sx={{ fontSize: 13 }}>
                    <Typography variant="caption" color="text.secondary">{k}</Typography>
                    <Typography variant="caption">{v}</Typography>
                </Stack>
            ))}
        </Stack>
    );
}