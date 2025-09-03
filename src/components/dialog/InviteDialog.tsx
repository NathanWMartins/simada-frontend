// components/athletes/InviteDialog.tsx
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from "@mui/material";
import { useState } from "react";

type Props = { open: boolean; onClose: () => void; onInvite: (email: string) => Promise<void> | void; };

export default function InviteDialog({ open, onClose, onInvite }: Props) {
    const [email, setEmail] = useState(""); const [loading, setLoading] = useState(false);
    const submit = async () => {
        if (!email.trim()) return;
        setLoading(true);
        try { await onInvite(email.trim()); onClose(); setEmail(""); } finally { setLoading(false); }
    };
    return (
        <Dialog open={open} onClose={() => !loading && onClose()} maxWidth="xs" fullWidth>
            <DialogTitle>Invite athlete</DialogTitle>
            <DialogContent dividers>
                <TextField autoFocus fullWidth label="Athlete e-mail" type="email" value={email} onChange={e => setEmail(e.target.value)} />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={loading}>Cancel</Button>
                <Button onClick={submit} variant="contained" color="success" disabled={loading || !email}>Send invite</Button>
            </DialogActions>
        </Dialog>
    );
}
