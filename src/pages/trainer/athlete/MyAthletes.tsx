import React, { useState } from "react";
import { Box, IconButton, Paper, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import HeaderHomeTrainer from "../../../components/header/HeaderHomeTrainer";
import { SwitchLightDarkMode } from "../../../components/common";
import { useUserContext } from "../../../contexts/UserContext";
import { useAthletesList } from "../../../hooks/useAthletesList";
import { AthleteRow, EmptyOrError, ListHeader, PositionFilterPopover } from "../../../components/trainer/athletesTrainer";
import AthletesToolbar from "../../../components/trainer/athletesTrainer/AthletsToolBar";

export default function MyAthletes() {
    const theme = useTheme();
    const { user } = useUserContext();

    const { loading, error, list, search, setSearch, position, setPosition, formatDate } =
        useAthletesList(user?.id);

    const [filterAnchor, setFilterAnchor] = useState<HTMLElement | null>(null);

    const skeletons = Array.from({ length: 8 }).map((_, i) => <AthleteRow key={`sk-${i}`} formatDate={formatDate} />);

    return (
        <Box sx={{ bgcolor: theme.palette.background.paper, minHeight: "100vh" }}>
            <HeaderHomeTrainer />

            <Box sx={{ px: 8, pt: 4, pb: 8 }}>
                {/* Barra verde */}
                <Paper elevation={4} sx={{ position: "relative", mb: 2, borderRadius: 3, overflow: "hidden", bgcolor: "transparent" }}>
                    <Box
                        sx={{
                            px: 2.5,
                            py: 1.5,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            background: "linear-gradient(90deg, #1db954 0%, #17a24a 50%, #12903f 100%)",
                        }}
                    >
                        <Typography variant="h6" fontWeight={700} color="#fff">My Athletes</Typography>
                        <IconButton size="small" sx={{ bgcolor: "rgba(255,255,255,0.15)", color: "#fff", "&:hover": { bgcolor: "rgba(255,255,255,0.25)" } }}>
                            <AddIcon />
                        </IconButton>
                    </Box>
                </Paper>

                {/* Conteúdo */}
                <Paper elevation={4} sx={{ borderRadius: 3, p: 2, bgcolor: theme.palette.background.default }}>
                    <AthletesToolbar
                        search={search}
                        onSearch={setSearch}
                        onOpenFilter={(e) => setFilterAnchor(e.currentTarget)}
                    />

                    <PositionFilterPopover
                        open={!!filterAnchor}
                        anchorEl={filterAnchor}
                        onClose={() => setFilterAnchor(null)}
                        value={position}
                        onChange={setPosition}
                    />

                    <ListHeader />

                    <EmptyOrError error={error} empty={!loading && !error && list.length === 0} />

                    {loading
                        ? skeletons
                        : list.map((a) => <AthleteRow key={a.id} athlete={a} formatDate={formatDate} />)}
                </Paper>
            </Box>

            <SwitchLightDarkMode />
        </Box>
    );
}
