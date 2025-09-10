import { Button, Typography, useTheme } from '@mui/material';
import { Box } from '@mui/system';
import SettingsIcon from "@mui/icons-material/Settings";
import GroupsIcon from "@mui/icons-material/Groups";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import React from 'react'

export default function TopBar({ onSessions, onTeam, onSettings }: { onSessions: () => void; onTeam: () => void; onSettings: () => void; }) {
    const theme = useTheme();
    const softBorder = `1px solid ${theme.palette.divider}`;
    return (
        <Box sx={{ px: 3, py: 1.5, borderBottom: softBorder, display: "flex", alignItems: "center", gap: 2 }}>
            <Typography variant="h6" fontWeight={800}>WIKO</Typography>
            <Box sx={{ flex: 1 }} />
            <Button size="small" startIcon={<CalendarMonthIcon />} onClick={onSessions}>My Sessions</Button>
            <Button size="small" startIcon={<GroupsIcon />} onClick={onTeam}>Team</Button>
            <Button size="small" startIcon={<SettingsIcon />} onClick={onSettings}>Settings</Button>
        </Box>
    );
}