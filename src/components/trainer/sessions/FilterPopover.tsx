import { Popover, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import type { FilterType } from "../../../hooks/useSessionsList";

type Props = {
    anchorEl: HTMLElement | null; open: boolean; onClose: () => void;
    value: FilterType; onChange: (v: FilterType) => void;
};
export default function FilterPopover({ anchorEl, open, onClose, value, onChange }: Props) {
    return (
        <Popover open={open} anchorEl={anchorEl} onClose={onClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            transformOrigin={{ vertical: "top", horizontal: "left" }}
            PaperProps={{ sx: { p: 2, borderRadius: 2 } }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>Type</Typography>
            <ToggleButtonGroup size="small" value={value} exclusive
                onChange={(_, v) => v && onChange(v)}>
                <ToggleButton value="All">All</ToggleButton>
                <ToggleButton value="Training">Training</ToggleButton>
                <ToggleButton value="Game">Game</ToggleButton>
            </ToggleButtonGroup>
        </Popover>
    );
}
