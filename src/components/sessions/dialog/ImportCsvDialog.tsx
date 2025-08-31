import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import { useState } from "react";

type Props = {
    open: boolean; title?: string; sessionId?: number;
    onClose: () => void;
    onImport: (file: File) => Promise<void>;
    onDownloadTemplate: () => void;
};

export default function ImportCsvDialog({ open, title, onClose, onImport, onDownloadTemplate }: Props) {
    const [file, setFile] = useState<File | null>(null);
    const [err, setErr] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const pick: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        const f = e.target.files?.[0] ?? null;
        if (!f) return;
        const ok = f.name.toLowerCase().endsWith(".csv") || f.type === "text/csv";
        if (!ok) { setErr("Select a .csv file"); setFile(null); return; }
        setErr(null); setFile(f);
    };

    const submit = async () => {
        if (!file) { setErr("Select a .csv file"); return; }
        setLoading(true);
        try { await onImport(file); onClose(); }
        catch (e) { setErr("Faile importing CSV."); }
        finally { setLoading(false); }
    };

    return (
        <Dialog open={open} onClose={() => !loading && onClose()} fullWidth maxWidth="sm">
            <DialogTitle>Import session metrics</DialogTitle>
            <DialogContent dividers>
                <Typography variant="body2" sx={{ mb: 2 }}>
                    The session <b>{title}</b> doesn't have metrics. Import a CSV file.
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
                    <Button color="success" variant="outlined" component="label" disabled={loading}>
                        Select CSV
                        <input hidden type="file" accept=".csv,text/csv" onChange={pick} />
                    </Button>
                    {file && <Typography variant="caption" color="text.secondary">Arquivo: {file.name}</Typography>}
                    <Button color="success" onClick={onDownloadTemplate} size="small">Download CSV template</Button>
                </Box>
                {err && <Alert severity="error" sx={{ mt: 2 }}>{err}</Alert>}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={loading}>Cancel</Button>
                <Button variant="contained" color="success" onClick={submit} disabled={loading || !file}>
                    {loading ? "Importing..." : "Import"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
