import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from "@mui/material";
import { useState, useEffect } from "react";

type Props = {
    open: boolean; title?: string; value?: string;
    loading?: boolean;
    onClose: () => void; onSave: (text: string) => Promise<void>;
};
export default function NotesDialog({ open, title, value, loading, onClose, onSave }: Props) {
    const [text, setText] = useState(value ?? "");
    useEffect(() => { setText(value ?? ""); }, [value, open]);
    return (
        <Dialog open={open} onClose={() => !loading && onClose()} fullWidth maxWidth="sm">
            <DialogTitle>Session Notes</DialogTitle>
            <DialogContent dividers>
                <Typography variant="body2" sx={{ mb: 1 }}>{title}</Typography>
                <TextField
                    label="Session Notes" value={text} onChange={(e) => setText(e.target.value)}
                    multiline rows={6} fullWidth color="success"
                    sx={(t) => ({ mt: 1, "& .MuiOutlinedInput-root": { borderRadius: 2, bgcolor: t.palette.background.paper } })}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={loading} color="inherit">Cancel</Button>
                <Button variant="contained" color="success" onClick={() => onSave(text)} disabled={loading}>
                    {loading ? "Saving..." : "Save"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
