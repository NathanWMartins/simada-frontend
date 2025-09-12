import { useEffect, useState, useMemo } from "react";
import {
    Avatar, Box, Button, Chip, Dialog, DialogContent, DialogTitle,
    Divider, IconButton, Stack, Typography, CircularProgress, Alert as MuiAlert
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import InsightsIcon from "@mui/icons-material/Insights";
import type { TLAnswerDTO, TLLabel } from "../../types/alertType";
import { askPerfRecommendations, getTrainingLoadAnswerByAthlete } from "../../services/coach/alerts/performanceAlertService";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type Props = {
    open: boolean;
    onClose: () => void;
    sessionId: number;
    athleteId: number;
};

const datefmt = (iso?: string | null) => {
    if (!iso) return "—";
    const d = new Date(iso);
    return Number.isNaN(d.getTime()) ? "—" : d.toLocaleString();
};

const prettyLabel = (label?: TLLabel | null) =>
    (label || "—").replaceAll("_", " ").replace(/^./, c => c.toUpperCase());

const chipColor = (label?: TLLabel | null):
    "default" | "success" | "warning" | "error" | "info" => {
    switch (label) {
        case "indisponível": return "default";
        case "baixo":
        case "ótimo":
        case "saudável":
            return "success";
        case "estável":
            return "info";
        case "atenção":
            return "warning";
        case "risco":
        case "alto_risco":
        case "queda_forte":
            return "error";
        default:
            return "default";
    }
};

export default function PerformanceAlertDialog({ open, onClose, sessionId, athleteId }: Props) {
    const [loading, setLoading] = useState(false);
    const [answer, setAnswer] = useState<TLAnswerDTO | null>(null);
    const [error, setError] = useState<string | null>(null);

    const [recoLoading, setRecoLoading] = useState(false);
    const [recoError, setRecoError] = useState<string | null>(null);
    const [recoText, setRecoText] = useState<string | null>(null);

    useEffect(() => {
        if (!open) return;
        (async () => {
            try {
                setLoading(true);
                setError(null);
                setRecoText(null);
                const data = await getTrainingLoadAnswerByAthlete(athleteId);
                if (!data) {
                    setError("Error.");
                    setAnswer(null);
                } else {
                    setAnswer(data);
                }
            } catch (e: any) {
                setError(e?.response?.data?.message ?? "Falha ao carregar os dados de performance.");
                setAnswer(null);
            } finally {
                setLoading(false);
            }
        })();
    }, [open, sessionId, athleteId]);

    const handleAskReco = async () => {
        if (!answer) return;
        setRecoError(null);
        setRecoText(null);
        try {
            setRecoLoading(true);
            const resp = await askPerfRecommendations({
                sessionId,
                athleteId,
                acwr: Number(answer.acwr || 0),
                monotony: Number(answer.monotony || 0),
                strain: Number(answer.strain || 0),
                pctQwUp: Number(answer.pctQwUp || 0),
            });
            setRecoText(resp.recommendations || "No recommendations at the moment.");
        } catch (e: any) {
            setRecoError(e?.response?.data?.message ?? "Error loading recommendations.");
        } finally {
            setRecoLoading(false);
        }
    };

    const labelColorHex = (label?: string | null) => {
        switch (label) {
            case "risco":
            case "alto_risco":
            case "queda_forte":
                return "#d32f2f";
            case "atenção":
                return "#ed6c02";
            case "saudável":
            case "ótimo":
            case "baixo":
                return "#2e7d32";
            case "estável":
                return "#0288d1";
            default:
                return "#6b7280";
        }
    };

    const human = (label?: string | null) =>
        (label ?? "—").replaceAll("_", " ").replace(/^./, c => c.toUpperCase());

    const THRESHOLDS = [
        {
            metric: "ACWR", rules: [
                { rule: "< 0.8", label: "baixo" },
                { rule: "0.8 – 1.3", label: "ótimo" },
                { rule: "1.31 – 1.5", label: "atenção" },
                { rule: "> 1.5", label: "risco" },
            ]
        },
        {
            metric: "%↑ QW", rules: [
                { rule: "< -10%", label: "queda_forte" },
                { rule: "-10% – 10%", label: "estável" },
                { rule: "10% – 20%", label: "atenção" },
                { rule: "> 20%", label: "risco" },
            ]
        },
        {
            metric: "Monotony", rules: [
                { rule: "< 1.0", label: "saudável" },
                { rule: "1.0 – 2.0", label: "atenção" },
                { rule: "> 2.0", label: "alto_risco" },
            ]
        },
        {
            metric: "Strain", rules: [
                { rule: "< 6000", label: "baixo" },
                { rule: "6000 – 8000", label: "atenção" },
                { rule: "> 8000", label: "alto_risco" },
            ]
        },
    ];

    const handleExportPdf = () => {
        if (!answer) return;

        const doc = new jsPDF({ unit: "pt", format: "a4" });
        const marginX = 48;
        let y = 56;

        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.text("Training Load Report", marginX, y);
        y += 10;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
        doc.setTextColor("#6b7280");
        doc.text(`Generated at ${new Date().toLocaleString()}`, marginX, y);
        doc.setTextColor("#111827");
        y += 24;

        doc.setFont("helvetica", "bold");
        doc.setFontSize(13);
        doc.text(answer.athleteName ?? `Athlete #${athleteId}`, marginX, y);
        y += 18;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
        const line2 = [
            answer.athleteEmail || "—",
            answer.athletePosition || null,
            answer.athleteNationality || null,
        ].filter(Boolean).join(" • ");
        doc.text(line2 || "—", marginX, y);

        const rightCol = [
            answer.qwStart ? `Week of ${new Date(answer.qwStart).toLocaleDateString()}` : null,
            answer.createdAt ? `Created at ${datefmt(answer.createdAt)}` : null,
        ].filter(Boolean);

        const rightX = doc.internal.pageSize.getWidth() - marginX;
        rightCol.forEach((txt, idx) => {
            doc.text(txt!, rightX, 56 + 18 * (idx + 2), { align: "right" });
        });

        y += 20;

        doc.setDrawColor("#e5e7eb");
        doc.line(marginX, y, rightX, y);
        y += 16;

        const rows = [
            ["ACWR", answer.acwr != null ? answer.acwr.toFixed(2) : "—", human(answer.acwrLabel)],
            ["%↑ QW", answer.pctQwUp != null ? `${answer.pctQwUp.toFixed(1)}%` : "—", human(answer.pctQwUpLabel)],
            ["Monotony", answer.monotony != null ? answer.monotony.toFixed(2) : "—", human(answer.monotonyLabel)],
            ["Strain", answer.strain != null ? answer.strain.toFixed(2) : "—", human(answer.strainLabel)],
        ];

        autoTable(doc, {
            startY: y,
            head: [["Metric", "Value", "Label"]],
            body: rows,
            styles: { font: "helvetica", fontSize: 11, cellPadding: 6 },
            headStyles: { fillColor: [23, 162, 74], textColor: 255 },
            columnStyles: {
                0: { cellWidth: 140 },
                1: { cellWidth: 140 },
                2: { cellWidth: "auto" },
            },
            didParseCell: (data: any) => {
                if (data.section === "body" && data.column.index === 2) {
                    const lbl = String(data.cell.raw || "");
                    const hex = labelColorHex(lbl.toLowerCase().replaceAll(" ", "_"));
                    data.cell.styles.textColor = hex as any;
                    data.cell.styles.fontStyle = "bold";
                }
            }
        });

        y = (doc as any).lastAutoTable.finalY + 24;

        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.text("Legend (thresholds per metric)", marginX, y);
        y += 12;

        const pageW = doc.internal.pageSize.getWidth();
        const pageH = doc.internal.pageSize.getHeight();
        const gutter = 24;
        const colW = (rightX - marginX - gutter) / 2;
        const bottom = pageH - 64;

        let yLeft = y;
        let yRight = y;

        const half = Math.ceil(THRESHOLDS.length / 2);
        const leftGroups = THRESHOLDS.slice(0, half);
        const rightGroups = THRESHOLDS.slice(half);

        const drawGroup = (x: number, yStart: number, group: any) => {
            let yCursor = yStart;

            doc.setFont("helvetica", "bold");
            doc.setFontSize(11);
            doc.text(group.metric, x, yCursor);
            yCursor += 14;

            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);

            group.rules.forEach((r: any) => {
                const color = labelColorHex(r.label);
                doc.setFillColor(color as any);
                // bolinha colorida
                doc.circle(x + 4, yCursor - 4, 3, "F");
                doc.setTextColor("#111827");
                doc.text(`${r.rule} — ${human(r.label)}`, x + 16, yCursor);
                yCursor += 14;
            });

            yCursor += 6;
            return yCursor;
        };

        for (const g of leftGroups) {
            if (yLeft > bottom) { doc.addPage(); yLeft = 56; yRight = 56; }
            yLeft = drawGroup(marginX, yLeft, g);
        }

        for (const g of rightGroups) {
            if (yRight > bottom) { doc.addPage(); yLeft = 56; yRight = 56; }
            yRight = drawGroup(marginX + colW + gutter, yRight, g);
        }

        y = Math.max(yLeft, yRight);

        if (recoText) {
            y += 6;
            doc.setDrawColor("#e5e7eb");
            doc.line(marginX, y, rightX, y);
            y += 16;

            doc.setFont("helvetica", "bold");
            doc.setFontSize(10);
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

        const pageH2 = doc.internal.pageSize.getHeight();
        doc.setFontSize(9);
        doc.setTextColor("#6b7280");
        doc.text("WIKO — Performance Report", marginX, pageH2 - 28);
        doc.text(String(new Date().toLocaleDateString()), rightX, pageH2 - 28, { align: "right" });

        const safeName = (answer.athleteName || `athlete_${athleteId}`)
            .replace(/[^a-z0-9]/gi, "_")
            .toLowerCase();

        doc.save(`report_athlete_${safeName}.pdf`);
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
            .replace(/^\s*\*\s+/gm, "• ");

        decoded = decoded.replace(
            /[\u{1F300}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu,
            ""
        );

        decoded = decoded
            .replace(/[\u2028\u2029\u200B\u200C\u200D\uFEFF]/g, "")
            .replace(/[^ -~\n\r\t\u00C0-\u017F]+/g, "");

        decoded = decoded.replace(/\s+\n/g, "\n").replace(/\n\s+/g, "\n");

        decoded = decoded
            .replace(/\u00A0/g, " ")
            .replace(/\r\n/g, "\n")
            .replace(/\r/g, "\n")
            .replace(/[ \t]+\n/g, "\n")
            .replace(/[ \t]{2,}/g, " ");

        return decoded.trim();
    }

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle
                component="div"
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
                <Stack direction="row" alignItems="center" spacing={1} sx={{ width: "100%" }}>
                    <InsightsIcon fontSize="small" />
                    Training Load — Athlete Detail
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
                        Any info.
                    </Typography>
                ) : (
                    <>
                        {/* Header do atleta */}
                        <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems={{ xs: "flex-start", md: "center" }}>
                            <Stack direction="row" spacing={1.5} alignItems="center">
                                <Avatar src={answer.athletePhoto || undefined} alt={answer.athleteName || ""} sx={{ width: 56, height: 56 }}>
                                    {answer.athleteName?.[0]?.toUpperCase?.()}
                                </Avatar>
                                <Box>
                                    <Typography variant="h6" fontWeight={800} sx={{ lineHeight: 1.1 }}>
                                        {answer.athleteName}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {answer.athleteEmail}
                                        {answer.athletePosition ? ` • ${answer.athletePosition}` : ""}
                                        {answer.athleteNationality ? ` • ${answer.athleteNationality}` : ""}
                                    </Typography>
                                </Box>
                            </Stack>

                            <Box sx={{ flex: 1 }} />

                            <Stack spacing={0.75} alignItems={{ xs: "flex-start", md: "flex-end" }}>
                                <Chip
                                    size="small"
                                    variant="outlined"
                                    label={answer.qwStart ? `Week of ${new Date(answer.qwStart).toLocaleDateString()}` : "—"}
                                />
                                <Chip
                                    size="small"
                                    variant="outlined"
                                    label={answer.createdAt ? `Created at ${datefmt(answer.createdAt)}` : "—"}
                                />
                            </Stack>
                        </Stack>

                        <Divider sx={{ my: 2 }} />

                        {/* Métricas + Labels */}
                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: { xs: "repeat(2, minmax(160px, 1fr))", md: "repeat(4, minmax(180px, 1fr))" },
                                gap: 1.25,
                            }}
                        >
                            <MetricWithLabel
                                title="ACWR"
                                value={answer.acwr}
                                label={answer.acwrLabel}
                            />
                            <MetricWithLabel
                                title="%↑ QW"
                                value={answer.pctQwUp}
                                valueSuffix={answer.pctQwUp != null ? "%" : ""}
                                label={answer.pctQwUpLabel}
                            />
                            <MetricWithLabel
                                title="Monotony"
                                value={answer.monotony}
                                label={answer.monotonyLabel}
                            />
                            <MetricWithLabel
                                title="Strain"
                                value={answer.strain}
                                label={answer.strainLabel}
                            />
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        {/* Ask AI recommendations */}
                        <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems={{ xs: "stretch", md: "center" }}>
                            <Button
                                color="success"
                                variant="contained"
                                onClick={handleAskReco}
                                disabled={recoLoading}
                                sx={{ color: "white" }}
                            >
                                {recoLoading ? "Asking recommendations..." : "Ask AI recommendations"}
                            </Button>

                            {recoError && <MuiAlert severity="error" variant="outlined" sx={{ flex: 1 }}>{recoError}</MuiAlert>}
                        </Stack>
                        {recoText && (
                            <Box sx={{ mt: 2, p: 2, bgcolor: "background.paper", borderRadius: 2, border: t => `1px solid ${t.palette.divider}` }}>
                                <Typography variant="subtitle2" gutterBottom>Recommendations</Typography>
                                <Typography variant="body2" whiteSpace="pre-wrap" sx={{ mb: 2 }}>
                                    {recoText}
                                </Typography>

                                <Button variant="outlined" color="primary" onClick={handleExportPdf}>
                                    Exportar Relatório (PDF)
                                </Button>
                            </Box>
                        )}
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}

function MetricWithLabel({
    title,
    value,
    valueSuffix = "",
    label,
}: {
    title: string;
    value?: number | null;
    valueSuffix?: string;
    label?: TLLabel | null;
}) {
    const color = chipColor(label);
    const displayVal = useMemo(() => {
        if (value == null || Number.isNaN(value as any)) return "—";
        const num = Number(value);
        const fixed = title === "%↑ QW" ? num.toFixed(1) : num.toFixed(2);
        return `${fixed}${valueSuffix}`;
    }, [value, valueSuffix, title]);

    return (
        <Box sx={{ p: 1.25, borderRadius: 2, border: theme => `1px solid ${theme.palette.divider}` }}>
            <Stack spacing={0.75} alignItems="flex-start">
                <Typography variant="caption" color="text.secondary">{title}</Typography>
                <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1 }}>{displayVal}</Typography>
                <Chip
                    size="small"
                    color={color === "default" ? undefined : color}
                    label={prettyLabel(label)}
                />
            </Stack>
        </Box>
    );
}
