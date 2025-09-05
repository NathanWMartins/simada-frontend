import {
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    List,
    ListItem,
    ListItemAvatar,
    Avatar,
    ListItemText,
    Typography,
    Alert,
    Stack,
    Divider,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useMemo } from "react";

type Props = {
    open: boolean;
    sentTo?: string[];
    onClose: () => void;
};

export default function PsyFormLinkDialog({ open, sentTo = [], onClose }: Props) {
    const count = sentTo.length;

    const displayItems = useMemo(
        () =>
            sentTo.map((email) => {
                const [name, domain] = email.split("@");
                return { email, name, domain };
            }),
        [sentTo]
    );

    const copyAll = async () => {
        try {
            await navigator.clipboard.writeText(sentTo.join(", "));
        } catch {
            window.prompt("Copie os e-mails:", sentTo.join(", "));
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            aria-labelledby="psy-form-dialog-title"
        >
            <DialogTitle id="psy-form-dialog-title" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CheckCircleIcon color="success" />
                Psicoemocional Form
            </DialogTitle>

            <DialogContent dividers>
                <Stack spacing={2}>
                    <Alert severity="success" variant="outlined">
                        Convites enviados com sucesso.
                    </Alert>

                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Typography variant="body2" fontWeight="bold">
                            E-mail sent to:
                        </Typography>
                        <Chip size="small" label={`${count}`} />
                    </Stack>

                    <Divider />

                    {count === 0 ? (
                        <Typography variant="body2" color="text.secondary">
                            Nenhum e-mail listado para esta sessão.
                        </Typography>
                    ) : (
                        <List dense disablePadding>
                            {displayItems.map(({ email, name, domain }) => (
                                <ListItem key={email} disableGutters sx={{ py: 0.5 }}>
                                    <ListItemAvatar>
                                        <Avatar sx={{ width: 28, height: 28 }}>{(name?.[0] || "?").toUpperCase()}</Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primaryTypographyProps={{ sx: { fontFamily: "ui-monospace, Menlo, monospace" } }}
                                        primary={email}
                                        secondary={domain ? `@${domain}` : undefined}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    )}
                </Stack>
            </DialogContent>

            <DialogActions sx={{ px: 3, py: 2 }}>
                <Button
                    onClick={copyAll}
                    startIcon={<ContentCopyIcon />}
                    disabled={count === 0}
                    variant="text"
                >
                    Copiar e-mails
                </Button>
                <Button onClick={onClose} variant="contained" color="inherit">
                    Fechar
                </Button>
            </DialogActions>
        </Dialog>
    );
}
