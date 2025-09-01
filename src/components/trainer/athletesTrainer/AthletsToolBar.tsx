import { Box, Button, InputAdornment, TextField } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";

type Props = {
    search: string;
    onSearch: (v: string) => void;
    onOpenFilter: (e: React.MouseEvent<HTMLElement>) => void;
};

export default function AthletesToolbar({ search, onSearch, onOpenFilter }: Props) {
    return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <TextField
                fullWidth
                value={search}
                onChange={(e) => onSearch(e.target.value)}
                placeholder="Search athletes…"
                size="small"
                variant="outlined"
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon fontSize="small" />
                        </InputAdornment>
                    ),
                }}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />
            <Button
                variant="outlined"
                startIcon={<FilterListIcon />}
                size="small"
                onClick={onOpenFilter}
                sx={{ borderRadius: 2, textTransform: "none" }}
            >
                Filter
            </Button>
        </Box>
    );
}
