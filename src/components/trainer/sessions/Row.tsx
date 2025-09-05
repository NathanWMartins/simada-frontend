import { Avatar, Box, IconButton, Tooltip, Typography, CircularProgress } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import InfoIcon from "@mui/icons-material/Info";
import FeedIcon from "@mui/icons-material/Feed";
import type { TrainerSession } from "../../../types/sessionType";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../../contexts/UserContext";
import { useState } from "react";
import { createPsyFormInvite } from "../../../services/trainer/session/psyFormType";
import PsyFormLinkDialog from "../../dialog/PsyFormLinkDialog";

type Props = {
    s: TrainerSession;
    formatDate: (iso: string) => string;
    onInfo: (s: TrainerSession) => void;
    onEdit: (s: TrainerSession) => void;
    onDelete: (s: TrainerSession) => void;
    onNoMetrics?: (s: TrainerSession) => void;
    onPsyCreated?: (sessionId: number, emails: string[]) => void;
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
    onPsyCreated
}: Props) {
    const navigate = useNavigate();
    const { user } = useUserContext();

    const [linkOpen, setLinkOpen] = useState(false);
    const [sentTo, setSentTo] = useState<string[]>([]);
    const [sending, setSending] = useState(false);

    const handleView = () => {
        if (s.has_metrics) {
            navigate(`/sessions/${s.id}/metrics`);
        } else {
            if (onNoMetrics) onNoMetrics(s);
            else alert("Esta sessão ainda não possui métricas importadas.");
        }
    };

    const handlePsyAction = async () => {
        if (s.has_psico) {
            navigate(`/sessions/${s.id}/psy-form/answers`);
            return;
        }

        if (!s.has_metrics) {
            if (onNoMetrics) onNoMetrics(s);
            else alert("Para gerar o formulário, importe as métricas desta sessão primeiro.");
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
            const msg = e?.response?.data?.message || e?.message || "Falha ao gerar/enviar o formulário.";
            alert(msg);
        } finally {
            setSending(false);
        }
    };

    const psyTooltip = !s.has_metrics
        ? "Importe métricas para habilitar"
        : sending
            ? "Enviando convites..."
            : s.has_psico
                ? "Visualize respostas / reenviar link"
                : "Gerar formulário";

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

                <Box sx={{ flex: 1.3, color: "text.secondary" }}>
                    {s.athleteCount ?? "—"}
                </Box>

                <Box sx={{ flex: 0.9, textAlign: "center" }}>
                    {s.type === "Game" ? (s.score ?? "—") : "—"}
                </Box>

                <Box sx={{ flex: 1.2, color: "text.secondary" }}>
                    {formatDate(s.date)}
                </Box>

                <Box sx={{ flex: 1 }}>
                    <Avatar sx={{ width: 26, height: 26 }} src={s.trainerPhoto || undefined} />
                </Box>

                <Box sx={{ width: 200, display: "flex", justifyContent: "flex-end", gap: 1 }}>

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
                                disabled={sending || (!s.has_psico && !s.has_metrics)}
                                sx={{
                                    color: s.has_psico
                                        ? "success.main"
                                        : !s.has_metrics
                                            ? "text.disabled"
                                            : "inherit.main",
                                    width: 32,
                                    height: 32,
                                }}
                                aria-busy={sending ? "true" : "false"}
                                aria-label={s.has_psico ? "Visualizar respostas" : "Gerar formulário psicoemocional"}
                            >
                                {sending ? <CircularProgress size={16} thickness={5} /> : <FeedIcon fontSize="small" />}
                            </IconButton>
                        </span>
                    </Tooltip>

                    <Tooltip title={s.has_metrics ? "Edit Session" : "Import metrics"}>
                        <IconButton
                            size="small"
                            onClick={() => onEdit(s)}
                            sx={{ color: s.has_metrics ? "success.main" : "warning.main" }}
                        >
                            <EditIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Delete">
                        <IconButton size="small" color="error" onClick={() => onDelete(s)}>
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>

            <PsyFormLinkDialog
                open={linkOpen}
                sentTo={sentTo}
                onClose={() => setLinkOpen(false)}
            />
        </>
    );
}
