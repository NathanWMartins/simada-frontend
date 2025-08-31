import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";

type Props = {
    open: boolean; title?: string; hasMetrics?: boolean;
    loading?: boolean;
    onClose: () => void; onConfirm: () => void;
};
export default function ConfirmDeleteDialog({ open, title, hasMetrics, loading, onClose, onConfirm }: Props) {
    return (
        <Dialog open={open} onClose={() => !loading && onClose()} maxWidth="xs" fullWidth>
            <DialogTitle>Remove session</DialogTitle>
            <DialogContent dividers>
                <Typography variant="body2">Are you sure you want to remove the session <b>{title}</b>?</Typography>
                {hasMetrics && (
                    <Typography variant="caption" color="warning.main" sx={{ mt: 1, display: "block" }}>
                        Attention: this session has imported metrics.
                    </Typography>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={loading}>Cancel</Button>
                <Button color="error" variant="contained" onClick={onConfirm} disabled={loading}>
                    {loading ? "Removing..." : "Remove"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
