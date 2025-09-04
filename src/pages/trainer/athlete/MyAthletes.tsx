import React, { useState } from "react";
import { Alert, Box, IconButton, Paper, Snackbar, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import HeaderHomeTrainer from "../../../components/header/HeaderHomeTrainer";
import { SwitchLightDarkMode } from "../../../components/common";
import { useUserContext } from "../../../contexts/UserContext";
import { useAthletesList } from "../../../hooks/useAthletesList";
import { AthleteRow, EmptyOrError, ListHeader, AthleteFilterPopover } from "../../../components/trainer/athletesTrainer";
import AthletesToolbar from "../../../components/trainer/athletesTrainer/AthletsToolBar";
import InviteDialog from "../../../components/dialog/InviteDialog";
import { inviteAthlete } from "../../../services/trainer/athletes/inviteService";

export default function MyAthletes() {
    const theme = useTheme();
    const { user } = useUserContext();

    const [filterAnchor, setFilterAnchor] = useState<HTMLElement | null>(null);
    const [inviteOpen, setInviteOpen] = useState(false);

    const {
        list, loading, error,
        search, setSearch,
        position, setPosition, remove,
        injury, setInjury,
        formatDate,
    } = useAthletesList(user?.id);

    const skeletons = Array.from({ length: 8 }).map((_, i) => (
        <AthleteRow
            key={`sk-${i}`}
            formatDate={formatDate}
            onDelete={async () => { }}
        />
    ));

    const [snack, setSnack] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
        open: false,
        message: "",
        severity: "success",
    });


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
                        <IconButton size="small"
                            sx={{ bgcolor: "rgba(255,255,255,0.15)", color: "#fff", "&:hover": { bgcolor: "rgba(255,255,255,0.25)" } }}
                            onClick={() => setInviteOpen(true)}
                        >
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

                    <AthleteFilterPopover
                        open={Boolean(filterAnchor)}
                        anchorEl={filterAnchor}
                        onClose={() => setFilterAnchor(null)}
                        valuePosition={position}
                        onChangePosition={setPosition}
                        valueInjury={injury}
                        onChangeInjury={setInjury}
                    />

                    <ListHeader />

                    <EmptyOrError error={error} empty={!loading && !error && list.length === 0} />

                    {loading
                        ? skeletons
                        : list.map((a) => <AthleteRow key={a.id} athlete={a} formatDate={formatDate}
                            onDelete={async (id) => {
                                try {
                                    await remove(id);
                                    setSnack({ open: true, message: "Athlete removed successfully.", severity: "success" });
                                } catch {
                                    setSnack({ open: true, message: "Faile removing athlete.", severity: "error" });
                                }
                            }} />)}
                </Paper>
            </Box>

            <InviteDialog
                open={inviteOpen}
                onClose={() => setInviteOpen(false)}
                onInvite={async (email) => {
                    if (!user?.id) return;
                    try {
                        await inviteAthlete(user.id, email);
                        setSnack({ open: true, message: "Invite sent successfully.", severity: "success" });
                    } catch (e: any) {
                        setSnack({ open: true, message: e?.response?.data?.message || "Failed to send invite.", severity: "error" });
                    }
                }}
            />

            <Snackbar
                open={snack.open}
                autoHideDuration={3500}
                onClose={() => setSnack((s) => ({ ...s, open: false }))}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <Alert severity={snack.severity} sx={{ width: "100%" }}>
                    {snack.message}
                </Alert>
            </Snackbar>

            <SwitchLightDarkMode />
        </Box>
    );
}
