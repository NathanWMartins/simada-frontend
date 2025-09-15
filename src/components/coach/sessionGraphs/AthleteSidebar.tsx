import React from "react";
import PersonIcon from "@mui/icons-material/Person";
import { Box } from "@mui/system";
import { Avatar, Divider, List, ListItemAvatar, ListItemButton, ListItemText, Paper, Typography } from "@mui/material";
import { Athlete } from "../../../types/sessionGraphsType";
import { Group } from "@mui/icons-material";


export type AthleteSidebarProps = {
    athletes: Athlete[];
    selectedAthleteId: number | null;
    onSelectAll: () => void;
    onSelectAthlete: (id: number) => void;
};


export const AthleteSidebar: React.FC<AthleteSidebarProps> = ({ athletes, selectedAthleteId, onSelectAll, onSelectAthlete }) => (
    <Box component={Paper} elevation={0} sx={{ width: 300, borderRight: (t) => `1px solid ${t.palette.divider}`, overflowY: "auto" }}>
        <Box sx={{ p: 2 }}>
            <Typography variant="h6">Session Athletes</Typography>
        </Box>
        <Divider />
        <List disablePadding>
            <ListItemButton selected={selectedAthleteId === null} onClick={onSelectAll}>
                <ListItemAvatar>
                    <Avatar>
                        <Group />
                    </Avatar>
                </ListItemAvatar>
                <ListItemText primary="All Athletes" secondary="Comparative view" />
            </ListItemButton>
            <Divider component="li" />
            {athletes.map((a) => (
                <Box key={a.id}>
                    <ListItemButton selected={selectedAthleteId === a.id} onClick={() => onSelectAthlete(a.id)}>
                        <ListItemAvatar>
                            <Avatar src={a.avatarUrl || undefined} alt={a.name}>
                                <PersonIcon />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary={a.name}
                            secondary={a.position ? `${a.position} • #${a.jerseyNumber ?? "--"}` : `#${a.jerseyNumber ?? "--"}`}
                        />
                    </ListItemButton>
                    <Divider component="li" />
                </Box>
            ))}
        </List>
    </Box>
);