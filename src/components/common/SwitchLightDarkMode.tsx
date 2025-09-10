import { Fab, useTheme } from '@mui/material'
import React from 'react'
import { useThemeMode } from '../../contexts/ThemeContext';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

export default function SwitchLightDarkMode() {
    const theme = useTheme();
    const { mode, toggleTheme } = useThemeMode();
    return (
        <>
            <Fab
                size="medium" onClick={toggleTheme} sx={{
                    position: 'fixed', bottom: 24, right: 24, zIndex: 1300,
                    backgroundColor: theme.palette.background.paper, color: theme.palette.text.primary,
                    boxShadow: 4, '&:hover': { backgroundColor: mode === 'light' ? '#e0e0e0' : '#555', },
                }}
            >
                {mode === 'light' ? <Brightness7Icon /> : <Brightness4Icon />}
            </Fab>
        </>
    )
}