import {
    Avatar, Box, IconButton, Tooltip, Typography, CircularProgress,
    Menu, MenuItem, ListItemIcon, ListItemText,
    Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import InfoIcon from "@mui/icons-material/Info";
import FeedIcon from "@mui/icons-material/Feed";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import type { CoachSession } from "../../../types/sessionType";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../../contexts/UserContext";
import { useState } from "react";
import PsyFormLinkDialog from "../../dialog/PsyFormLinkDialog";
import { createPsyFormInvite } from "../../../services/coach/session/psychoEmocional/psyFormType";

type Props = {
    s: CoachSession;
    formatDate: (iso: string) => string;
    onInfo: (s: CoachSession) => void;
    onEdit: (s: CoachSession) => void;
    onDelete: (s: CoachSession) => void;
    onNoMetrics?: (s: CoachSession) => void;
    onPsyCreated?: (sessionId: number, emails: string[]) => void;
    onImportMetrics?: (s: CoachSession) => void;
    onDeleteMetrics?: (s: CoachSession) => void | Promise<void>;
};

type CreateInviteRes = {
    token?: string;
    sentTo?: string[];
};

export default function SessionRow({
    s,
    formatDate,
    onInfo,
    onEdit,
    onDelete,
    onNoMetrics,
    onPsyCreated,
    onImportMetrics,
    onDeleteMetrics,
}: Props) {
    const navigate = useNavigate();
    const { user } = useUserContext();

    const [linkOpen, setLinkOpen] = useState(false);
    const [sentTo, setSentTo] = useState<string[]>([]);
    const [sending, setSending] = useState(false);

    // menu do lápis
    const [editMenuAnchor, setEditMenuAnchor] = useState<null | HTMLElement>(null);
    const editMenuOpen = Boolean(editMenuAnchor);

    const [confirmMetricsOpen, setConfirmMetricsOpen] = useState(false);
    const [metricsDeleting, setMetricsDeleting] = useState(false);

    const handleView = () => {
        if (s.has_metrics) {
            navigate(`/coach/sessions/${s.id}`);
        } else {
            if (onNoMetrics) onNoMetrics(s);
        }
    };

    const handlePsyAction = async () => {
        if (!s.has_metrics) return;
        if (s.has_psycho) {
            navigate(`/coach/psy-form/${s.id}/answers`);
            return;
        }
        if (!user?.id) return;

        try {
            setSending(true);
            const res: CreateInviteRes = await createPsyFormInvite(user.id, s.id);
            const emails = (res.sentTo ?? []).map((invite: any) => invite.email);
            setSentTo(emails);
            setLinkOpen(true);
            onPsyCreated?.(s.id, emails);
        } catch (e: any) {
            const msg = e?.response?.data?.message || e?.message || "Failed generating/sending form.";
            console.error(msg);
        } finally {
            setSending(false);
        }
    };

    const psyTooltip = sending
        ? "Sending invites..."
        : !s.has_metrics
            ? "Import data to generate form."
            : s.has_psycho
                ? "Visualize answers"
                : "Generate form";

    // lápis → menu
    const handleOpenEditMenu = (e: React.MouseEvent<HTMLElement>) => setEditMenuAnchor(e.currentTarget);
    const handleCloseEditMenu = () => setEditMenuAnchor(null);

    const handleEditSession = () => {
        handleCloseEditMenu();
        onEdit(s);
    };

    const handleImportMetrics = () => {
        handleCloseEditMenu();
        onImportMetrics ? onImportMetrics(s) : onNoMetrics?.(s);
    };

    const handleDeleteMetricsClick = () => {
        handleCloseEditMenu();
        setConfirmMetricsOpen(true);
    };

    const handleConfirmDeleteMetrics = async () => {
        if (!onDeleteMetrics) {
            setConfirmMetricsOpen(false);
            return;
        }
        try {
            setMetricsDeleting(true);
            await onDeleteMetrics(s);
            setConfirmMetricsOpen(false);
        } finally {
            setMetricsDeleting(false);
        }
    };

    return (
        <>
            <Box
                sx={(t) => ({
                    display: "flex",
                    alignItems: "center",
                    px: 1.5,
                    py: 1.25,
                    mt: 1,
                    borderRadius: 2,
                    bgcolor: t.palette.background.paper,
                    border: `1px solid ${t.palette.divider}`,
                })}
            >
                <Box sx={{ flex: 0.9, color: "text.secondary" }}>
                    {s.type === "Game" ? `GM-${s.id}` : `TR-${s.id}`}
                </Box>

                <Box sx={{ flex: 2.2 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {s.title}
                    </Typography>
                </Box>

                <Box sx={{ flex: 1.3, color: "text.secondary" }}>{s.athleteCount ?? "—"}</Box>

                <Box sx={{ flex: 0.9, textAlign: "center" }}>
                    {s.type === "Game" ? (s.score ?? "—") : "—"}
                </Box>

                <Box sx={{ flex: 1.2, color: "text.secondary" }}>{formatDate(s.date)}</Box>

                <Box sx={{ flex: 1 }}>
                    <Avatar sx={{ width: 26, height: 26 }} src={s.coachPhoto || undefined} />
                </Box>

                <Box sx={{ width: 260, display: "flex", justifyContent: "flex-end", gap: 1 }}>
                    <Tooltip title="Info">
                        <IconButton size="small" onClick={() => onInfo(s)}>
                            <InfoIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="View">
                        <IconButton size="small" onClick={handleView}>
                            <VisibilityIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title={psyTooltip}>
                        <span>
                            <IconButton
                                size="small"
                                onClick={handlePsyAction}
                                disabled={sending || !s.has_metrics}
                                sx={{
                                    color: s.has_psycho ? "success.main" : !s.has_metrics ? "warning.main" : "inherit",
                                    width: 32,
                                    height: 32,
                                }}
                                aria-busy={sending ? "true" : "false"}
                                aria-label={
                                    sending ? "Sending invites" :
                                        !s.has_metrics ? "Import metrics first" :
                                            s.has_psycho ? "View answers" : "Generate psycho-emotional form"
                                }
                            >
                                {sending ? <CircularProgress size={16} thickness={5} /> : <FeedIcon fontSize="small" />}
                            </IconButton>
                        </span>
                    </Tooltip>

                    {/* Lápis com menu contextual */}
                    <Tooltip title={s.has_metrics ? "Edit session / Delete metrics" : "Edit session / Import metrics"}>
                        <IconButton
                            size="small"
                            onClick={handleOpenEditMenu}
                            sx={{ color: s.has_metrics ? "success.main" : "warning.main" }}
                        >
                            <EditIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>

                    <Menu
                        anchorEl={editMenuAnchor}
                        open={editMenuOpen}
                        onClose={handleCloseEditMenu}
                        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                        transformOrigin={{ vertical: "top", horizontal: "right" }}
                        keepMounted
                    >
                        <MenuItem onClick={handleEditSession}>
                            <ListItemIcon><EditIcon fontSize="small" /></ListItemIcon>
                            <ListItemText>Edit session</ListItemText>
                        </MenuItem>

                        {!s.has_metrics ? (
                            <MenuItem onClick={handleImportMetrics}>
                                <ListItemIcon><CloudUploadIcon fontSize="small" /></ListItemIcon>
                                <ListItemText>Import data</ListItemText>
                            </MenuItem>
                        ) : (
                            <MenuItem onClick={handleDeleteMetricsClick}>
                                <ListItemIcon><DeleteSweepIcon fontSize="small" color="error"/></ListItemIcon>
                                <ListItemText>Delete data</ListItemText>
                            </MenuItem>
                        )}
                    </Menu>

                    <Tooltip title="Delete">
                        <IconButton size="small" color="error" onClick={() => onDelete(s)}>
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>

            {/* Dialog confirmar exclusão de métricas */}
            <Dialog
                open={confirmMetricsOpen}
                onClose={() => !metricsDeleting && setConfirmMetricsOpen(false)}
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle>Delete data</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ mb: 1.5 }}>
                        This action is <b>irreversible</b>. The data imported from this session will be permanently removed.
                        Do you wish to continue?
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={() => setConfirmMetricsOpen(false)} disabled={metricsDeleting}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleConfirmDeleteMetrics}
                        disabled={metricsDeleting}
                    >
                        {metricsDeleting ? "Deleting..." : "Confirm"}
                    </Button>
                </DialogActions>
            </Dialog>

            <PsyFormLinkDialog open={linkOpen} sentTo={sentTo} onClose={() => setLinkOpen(false)} />
        </>
    );
}
