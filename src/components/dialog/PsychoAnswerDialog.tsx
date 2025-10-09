import { Dialog, DialogTitle, DialogContent, Stack, CircularProgress, Typography, Alert as MuiAlert, Box, Chip, Divider, Button, IconButton, Avatar } from "@mui/material";
import PsychologyIcon from "@mui/icons-material/Psychology";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useUserContext } from "../../contexts/UserContext";
import { askPsyRecommendations, getPsychoAnswerByAthlete } from "../../services/coach/alerts/psychoAlertsService";

type Props = {
    open: boolean;
    onClose: () => void;
    sessionId: number;
    athleteId: number;
};

type PsyAnswerDTO = {
    athleteName: string;
    athleteEmail?: string | null;
    athletePhoto?: string | null;
    athletePosition?: string | null;
    submittedAt?: string | null;
    srpe?: number | null;
    fatigue?: number | null;
    soreness?: number | null;
    mood?: number | null;
    energy?: number | null;
};

export default function PsychoAnswerDialog({ open, onClose, sessionId, athleteId }: Props) {
    const [loading, setLoading] = useState(false);
    const [answer, setAnswer] = useState<PsyAnswerDTO | null>(null);
    const [error, setError] = useState<string | null>(null);

    const [recoLoading, setRecoLoading] = useState(false);
    const [recoError, setRecoError] = useState<string | null>(null);
    const [recoText, setRecoText] = useState<string | null>(null);
    const { user } = useUserContext();

    useEffect(() => {
        if (!open) return;
        (async () => {
            try {
                setLoading(true);
                setError(null);
                setRecoText(null);
                const data = await getPsychoAnswerByAthlete(sessionId, athleteId);
                if (!data) {
                    setError("Nenhuma resposta encontrada para este atleta nesta sessão.");
                    setAnswer(null);
                } else {
                    setAnswer(data);
                }
            } catch (e: any) {
                setError(e?.response?.data?.message ?? "Falha ao carregar a resposta.");
                setAnswer(null);
            } finally {
                setLoading(false);
            }
        })();
    }, [open, sessionId, athleteId]);

    if (!user) return null;

    const handleAskReco = async () => {
        if (!answer) return;
        setRecoError(null);
        setRecoText(null);
        try {
            setRecoLoading(true);
            const resp = await askPsyRecommendations({
                coachId: user.id,
                sessionId,
                athleteId,
                srpe: Number(answer.srpe ?? 0),
                fatigue: Number(answer.fatigue ?? 0),
                soreness: Number(answer.soreness ?? 0),
                mood: Number(answer.mood ?? 0),
                energy: Number(answer.energy ?? 0),
            });
            setRecoText(resp?.recommendations ?? "Any recommendations at the moment.");
        } catch (e: any) {
            setRecoError(e?.response?.data?.message ?? "Error loading recommendations.");
        } finally {
            setRecoLoading(false);
        }
    };

    const datefmt = (iso?: string | null) => {
        if (!iso) return "—";
        const d = new Date(iso);
        return Number.isNaN(d.getTime()) ? "—" : d.toLocaleString();
    };

    function sanitizeRecoText(input: string): string {
        if (!input) return "";
        let decoded = input;
        try {
            const doc = new DOMParser().parseFromString(input, "text/html");
            decoded = doc.documentElement.textContent || input;
        } catch {
            decoded = input
                .replace(/&nbsp;/gi, " ")
                .replace(/&amp;/gi, "&")
                .replace(/&lt;/gi, "<")
                .replace(/&gt;/gi, ">");
        }
        decoded = decoded
            .replace(/#{1,6}\s*/g, "")
            .replace(/\*\*(.*?)\*\*/g, "$1")
            .replace(/__(.*?)__/g, "$1")
            .replace(/^\s*-\s+/gm, "• ")
            .replace(/^\s*\*\s+/gm, "• ")
            .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, "")
            .replace(/[\u2028\u2029\u200B\u200C\u200D\uFEFF]/g, "")
            .replace(/[^ -~\n\r\t\u00C0-\u017F]+/g, "")
            .replace(/\s+\n/g, "\n").replace(/\n\s+/g, "\n")
            .replace(/\u00A0/g, " ")
            .replace(/\r\n/g, "\n")
            .replace(/\r/g, "\n")
            .replace(/[ \t]+\n/g, "\n")
            .replace(/[ \t]{2,}/g, " ");
        return decoded.trim();
    }

    const handleExportPdf = () => {
        if (!answer) return;

        const doc = new jsPDF({ unit: "pt", format: "a4" });
        const marginX = 48;
        const rightX = doc.internal.pageSize.getWidth() - marginX;
        let y = 56;

        // Cabeçalho
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.text("Psycho-emotional Report", marginX, y);
        y += 10;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
        doc.setTextColor("#6b7280");
        doc.text(`Generated at ${new Date().toLocaleString()}`, marginX, y);
        doc.setTextColor("#111827");
        y += 24;

        // Atleta
        doc.setFont("helvetica", "bold");
        doc.setFontSize(13);
        doc.text(answer.athleteName ?? `Athlete #${athleteId}`, marginX, y);
        y += 18;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
        const leftLine = [
            answer.athleteEmail || "—",
            answer.athletePosition || null,
        ].filter(Boolean).join(" • ");
        doc.text(leftLine || "—", marginX, y);

        const rightCol: string[] = [];
        if (answer.submittedAt) rightCol.push(`Submitted at ${datefmt(answer.submittedAt)}`);
        rightCol.forEach((txt, idx) => doc.text(txt, rightX, 56 + 18 * (idx + 2), { align: "right" }));

        y += 20;

        doc.setDrawColor("#e5e7eb");
        doc.line(marginX, y, rightX, y);
        y += 16;

        // Tabela de Métricas
        const rows = [
            ["sRPE", answer.srpe != null ? String(answer.srpe) : "—"],
            ["Fatigue", answer.fatigue != null ? String(answer.fatigue) : "—"],
            ["Soreness", answer.soreness != null ? String(answer.soreness) : "—"],
            ["Mood", answer.mood != null ? String(answer.mood) : "—"],
            ["Energy", answer.energy != null ? String(answer.energy) : "—"],
        ];

        autoTable(doc, {
            startY: y,
            head: [["Metric", "Value (0–10)"]],
            body: rows,
            styles: { font: "helvetica", fontSize: 11, cellPadding: 6 },
            headStyles: { fillColor: [23, 162, 74], textColor: 255 },
            columnStyles: {
                0: { cellWidth: 180 },
                1: { cellWidth: "auto" },
            },
        });

        y = (doc as any).lastAutoTable.finalY + 24;

        // Recomendações (se houver)
        if (recoText) {
            doc.setDrawColor("#e5e7eb");
            doc.line(marginX, y, rightX, y);
            y += 16;

            doc.setFont("helvetica", "bold");
            doc.setFontSize(12);
            doc.text("AI Recommendations", marginX, y);
            y += 12;

            const safeReco = sanitizeRecoText(recoText);
            doc.setFont("helvetica", "normal");
            doc.setFontSize(11);
            const textWidth = rightX - marginX;
            const splitted = doc.splitTextToSize(safeReco, textWidth);
            doc.text(splitted, marginX, y);
            y += (splitted.length * 14);
        }

        // Rodapé
        const pageH = doc.internal.pageSize.getHeight();
        doc.setFontSize(9);
        doc.setTextColor("#6b7280");
        doc.text("WIKO — Psycho-emotional Report", marginX, pageH - 28);
        doc.text(String(new Date().toLocaleDateString()), rightX, pageH - 28, { align: "right" });

        const safeName = (answer.athleteName || `athlete_${athleteId}`)
            .replace(/[^a-z0-9]/gi, "_")
            .toLowerCase();

        doc.save(`psy_report_${safeName}.pdf`);
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle component="div" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ width: "100%" }}>
                    <PsychologyIcon fontSize="small" />
                    Psychoemocional — Athletes Answers
                    <Box sx={{ flex: 1 }} />
                    <IconButton onClick={onClose}><CloseIcon /></IconButton>
                </Stack>
            </DialogTitle>

            <DialogContent dividers>
                {loading ? (
                    <Stack alignItems="center" sx={{ py: 6 }}><CircularProgress /></Stack>
                ) : error ? (
                    <MuiAlert severity="error" variant="outlined">{error}</MuiAlert>
                ) : !answer ? (
                    <Typography color="text.secondary" sx={{ textAlign: "center", py: 4 }}>
                        Nenhuma informação disponível.
                    </Typography>
                ) : (
                    <>
                        {/* Header atleta */}
                        <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems={{ xs: "flex-start", md: "center" }}>
                            <Stack direction="row" spacing={1.5} alignItems="center">
                                <Avatar src={answer.athletePhoto || undefined} alt={answer.athleteName} sx={{ width: 56, height: 56 }}>
                                    {answer.athleteName?.[0]?.toUpperCase()}
                                </Avatar>
                                <Box>
                                    <Typography variant="h6" fontWeight={800} sx={{ lineHeight: 1.1 }}>
                                        {answer.athleteName}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {answer.athleteEmail} {answer.athletePosition ? `• ${answer.athletePosition}` : ""}
                                    </Typography>
                                </Box>
                            </Stack>

                            <Box sx={{ flex: 1 }} />

                            <Stack direction="row" spacing={1} alignItems="center">
                                <Typography variant="body2" color="text.secondary">Enviado em:</Typography>
                                <Chip size="small" variant="outlined" label={answer.submittedAt ? datefmt(answer.submittedAt) : "—"} />
                            </Stack>
                        </Stack>

                        <Divider sx={{ my: 2 }} />

                        {/* Métricas */}
                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: { xs: "repeat(2, minmax(120px, 1fr))", sm: "repeat(3, minmax(140px, 1fr))", md: "repeat(5, minmax(160px, 1fr))" },
                                columnGap: 1.25,
                                rowGap: 1.25,
                            }}
                        >
                            <Metric label="sRPE" value={answer.srpe} />
                            <Metric label="Fatigue" value={answer.fatigue} />
                            <Metric label="Soreness" value={answer.soreness} />
                            <Metric label="Mood" value={answer.mood} />
                            <Metric label="Energy" value={answer.energy} />
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        {/* Pedir recomendações */}
                        <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems={{ xs: "stretch", md: "center" }}>
                            <Button
                                color="success"
                                variant="contained"
                                onClick={handleAskReco}
                                disabled={recoLoading}
                                sx={{ color: "white" }}
                            >
                                {recoLoading ? "Asking recommendations..." : "Ask AI recomendations"}
                            </Button>

                            {recoError && <MuiAlert severity="error" variant="outlined" sx={{ flex: 1 }}>{recoError}</MuiAlert>}
                        </Stack>

                        {recoText && (
                            <Box sx={{ mt: 2, p: 2, bgcolor: "background.paper", borderRadius: 2, border: theme => `1px solid ${theme.palette.divider}` }}>
                                <Typography variant="subtitle2" gutterBottom>Recomendations</Typography>
                                <Typography variant="body2" whiteSpace="pre-wrap" sx={{ mb: 2 }}>
                                    {recoText}
                                </Typography>

                                {/* ⬇️ Botão de export igual ao de performance */}
                                <Button variant="outlined" color="primary" onClick={handleExportPdf}>
                                    Export Report (PDF)
                                </Button>
                            </Box>
                        )}
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}

function Metric({ label, value }: { label: string; value?: number | null }) {
    return (
        <Box sx={{ p: 1.25, borderRadius: 2, border: (theme) => `1px solid ${theme.palette.divider}` }}>
            <Stack spacing={0.5} alignItems="center">
                <Typography variant="caption" color="text.secondary">{label}</Typography>
                <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1 }}>
                    {value ?? "—"}
                </Typography>
            </Stack>
        </Box>
    );
}
