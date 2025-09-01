import { Popover, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { PositionFilter, POSITIONS } from "../../../hooks/useAthletesList";

type Props = {
    open: boolean;
    anchorEl: HTMLElement | null;
    onClose: () => void;
    value: PositionFilter;
    onChange: (p: PositionFilter) => void;
};

export default function PositionFilterPopover({ open, anchorEl, onClose, value, onChange }: Props) {
    return (
        <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={onClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            transformOrigin={{ vertical: "top", horizontal: "left" }}
            PaperProps={{ sx: { p: 2, borderRadius: 2 } }}
        >
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Position
            </Typography>
            <ToggleButtonGroup
                size="small"
                value={value}
                exclusive
                onChange={(_, v: PositionFilter | null) => v && onChange(v)}
            >
                {POSITIONS.map((p) => (
                    <ToggleButton key={p} value={p}>
                        {p}
                    </ToggleButton>
                ))}
            </ToggleButtonGroup>
        </Popover>
    );
}
