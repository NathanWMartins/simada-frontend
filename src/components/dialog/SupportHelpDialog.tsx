import React, { useState } from "react";
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, Typography, Stack, IconButton, Tooltip, Alert, Snackbar, Box, Divider
} from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

type Props = {
    open: boolean;
    onClose: () => void;
    supportEmail: string;
    appName?: string;    
    version?: string;    
};

const SupportHelpDialog: React.FC<Props> = ({ open, onClose, supportEmail, appName = "WIKO", version }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(supportEmail);
            setCopied(true);
        } catch {
            setCopied(false);
        }
    };

    const mailto = `mailto:${supportEmail}?subject=${encodeURIComponent(`[${appName}] Support request`)}`;

    return (
        <>
            <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <HelpOutlineIcon fontSize="small" />
                    Support & Help
                    {version && (
                        <Typography variant="caption" sx={{ ml: "auto" }} color="text.secondary">
                            {version}
                        </Typography>
                    )}
                </DialogTitle>

                <DialogContent dividers>
                    <Stack spacing={1.5}>
                        <Typography variant="body2">
                            Need help with <b>{appName}</b>? You can reach out to our support team via email and share the details of your issue.
                        </Typography>

                        <Box sx={{ p: 1.5, border: (t) => `1px solid ${t.palette.divider}`, borderRadius: 1 }}>
                            <Typography variant="overline" color="text.secondary">Contact</Typography>
                            <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 0.5 }}>
                                <MailOutlineIcon fontSize="small" />
                                <Typography variant="body2">{supportEmail}</Typography>
                                <Tooltip title="Copy email">
                                    <IconButton size="small" onClick={handleCopy}>
                                        <ContentCopyIcon fontSize="inherit" />
                                    </IconButton>
                                </Tooltip>
                            </Stack>
                        </Box>

                        <Divider />

                        <Typography variant="overline" color="text.secondary">To speed up support</Typography>
                        <Typography variant="body2">
                            When reporting a problem, please include:
                        </Typography>
                        <ul style={{ margin: 0, paddingLeft: 18 }}>
                            <li><Typography variant="body2">Steps to reproduce the issue</Typography></li>
                            <li><Typography variant="body2">Screenshots if possible</Typography></li>
                            <li><Typography variant="body2">Browser and operating system</Typography></li>
                        </ul>

                        <Alert variant="outlined" color="warning">
                            Your message may contain sensitive data (e.g. names). Only share what is necessary.
                        </Alert>
                    </Stack>
                </DialogContent>

                <DialogActions>
                    <Button onClick={onClose} color="inherit">Close</Button>
                    <Button variant="contained" startIcon={<MailOutlineIcon />} component="a" href={mailto}>
                        Send Email
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={copied}
                autoHideDuration={2200}
                onClose={() => setCopied(false)}
                message="Email copied to clipboard"
            />
        </>
    );
};

export default SupportHelpDialog;
