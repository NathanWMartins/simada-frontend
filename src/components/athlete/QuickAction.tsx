import { Button, Paper } from "@mui/material";
import React from "react";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

export default function QuickAction({ label, onClick }: { label: string; onClick: () => void }) {
    return (
        <Paper elevation={4} sx={{ p: 1.25, borderRadius: 2 }}>
            <Button fullWidth endIcon={<ArrowForwardIosIcon fontSize="small" />} onClick={onClick} sx={{ justifyContent: "space-between", textTransform: "none" }}>
                {label}
            </Button>
        </Paper>
    );
}