import * as React from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
} from "@mui/material";

type ConfirmDialogProps = {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;

    entity?: string;         
    itemName?: string;         
    title?: string;               
    description?: React.ReactNode;
    warningNote?: React.ReactNode;  
    confirmLabel?: string;     
    cancelLabel?: string;     
    loading?: boolean;    
};

export default function ConfirmDeleteDialog({
    open,
    onClose,
    onConfirm,
    entity = "item",
    itemName,
    title,
    description,
    warningNote,
    confirmLabel,
    cancelLabel = "Cancel",
    loading = false,
}: ConfirmDialogProps) {
    const autoTitle = title ?? `Remove ${entity}`;
    const autoDescription =
        description ?? (
            <Typography variant="body2">
                Are you sure you want to remove the {entity}{" "}
                {itemName ? <b>{itemName}</b> : "selected"}?
            </Typography>
        );

    return (
        <Dialog open={open} onClose={() => !loading && onClose()} maxWidth="xs" fullWidth>
            <DialogTitle>{autoTitle}</DialogTitle>
            <DialogContent dividers>
                {autoDescription}
                {warningNote && (
                    <Typography
                        variant="caption"
                        color="warning.main"
                        sx={{ mt: 1, display: "block" }}
                    >
                        {warningNote}
                    </Typography>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={loading} color="inherit">
                    {cancelLabel}
                </Button>
                <Button
                    color="error"
                    variant="contained"
                    onClick={onConfirm}
                    disabled={loading}
                >
                    {loading ? "Removing..." : confirmLabel ?? "Remove"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
