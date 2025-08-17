import React from "react";
import HeaderHomeTrainer from "../../components/header/HeaderHomeTrainer";
import { SwitchLightDarkMode } from "../../components/common";
import { Box, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";

function HomeTrainer() {
    const theme = useTheme();
    const navigate = useNavigate();
    return (
        <>
            <HeaderHomeTrainer />
            <Box sx={{
                width: '100vw', height: '100vh', backgroundColor: theme.palette.background.paper,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 8,
            }}>

            </Box>
            <SwitchLightDarkMode />
        </>
    )
}

export default HomeTrainer