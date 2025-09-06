import { Popover, ToggleButton, ToggleButtonGroup, Typography, Box } from "@mui/material";
import { POSITIONS, STATUS, PositionFilter, InjuryFilter } from "../../../hooks/useAthletesList";

type Props = {
    open: boolean;
    anchorEl: HTMLElement | null;
    onClose: () => void;

    valuePosition: PositionFilter;
    onChangePosition: (p: PositionFilter) => void;

    valueInjury: InjuryFilter;
    onChangeInjury: (s: InjuryFilter) => void;
};

export default function AthleteFilterPopover({
    open, anchorEl, onClose,
    valuePosition, onChangePosition,
    valueInjury, onChangeInjury,
}: Props) {
    return (
        <Popover
            open={open}
            color="inherit"
            anchorEl={anchorEl}
            onClose={onClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            transformOrigin={{ vertical: "top", horizontal: "left" }}
            PaperProps={{ sx: { p: 2, borderRadius: 2 } }}
        >
            <Box sx={{ display: "grid", rowGap: 2 }}>
                <Box>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>Position</Typography>
                    <ToggleButtonGroup
                        size="small"
                        value={valuePosition}
                        exclusive
                        onChange={(_, v: PositionFilter | null) => v && onChangePosition(v)}
                    >
                        {POSITIONS.map((p) => (
                            <ToggleButton key={p} value={p}>{p}</ToggleButton>
                        ))}
                    </ToggleButtonGroup>
                </Box>

                <Box>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>Status</Typography>
                    <ToggleButtonGroup
                        size="small"
                        value={valueInjury}
                        exclusive
                        onChange={(_, v: InjuryFilter | null) => v && onChangeInjury(v)}
                    >
                        {STATUS.map((s) => (
                            <ToggleButton key={s} value={s}>{s}</ToggleButton>
                        ))}
                    </ToggleButtonGroup>
                </Box>
            </Box>
        </Popover>
    );
}
