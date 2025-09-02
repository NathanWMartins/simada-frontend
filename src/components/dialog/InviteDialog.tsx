import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from "@mui/material";
import { useState } from "react";

export default function InviteDialog({ open, onClose, onInvite }: {
    open: boolean;
    onClose: () => void;
    onInvite: (email: string) => Promise<void> | void;
}) {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const submit = async () => {
        setLoading(true);
        await onInvite(email.trim());
        setLoading(false);
        onClose();
        setEmail("");
    };

    return (
        <Dialog open={open} onClose={() => !loading && onClose()} maxWidth="xs" fullWidth>
            <DialogTitle>Invite athlete</DialogTitle>
            <DialogContent dividers>
                <TextField
                    autoFocus fullWidth label="Athlete e-mail"
                    type="email" value={email} onChange={e => setEmail(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={loading}>Cancel</Button>
                <Button onClick={submit} variant="contained" color="success" disabled={loading || !email}>Send invite</Button>
            </DialogActions>
        </Dialog>
    );
}
