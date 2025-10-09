import * as React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Tabs,
    Tab,
    Typography,
    Divider,
    Checkbox,
    FormControlLabel,
    IconButton,
    useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ShieldIcon from "@mui/icons-material/Security";
import { useThemeMode } from "../../contexts/ThemeContext";

type PrivacyPolicyDialogProps = {
    open: boolean;
    onClose: () => void;
};

const sections = [
    {
        key: "data",
        label: "Data We Collect",
        content: (
            <>
                <Typography variant="h6" gutterBottom>
                    What We Collect
                </Typography>
                <Typography paragraph>
                    We collect registration details (name, email), profile information
                    (user role: coach or athlete), <br /> and operational data from the WIKO
                    platform such as training/game sessions, metrics<br /> (e.g., ACWR,
                    PlayerLoad, monotony, strain), and responses to psycho-emotional
                    questionnaires.<br /> Technical logs (e.g., access timestamps, approximate
                    IP addresses) may be collected for audit<br /> and security purposes.
                </Typography>
                <Typography variant="subtitle1">Sensitive Data</Typography>
                <Typography paragraph>
                    Psycho-emotional responses and training/health-related metrics are
                    treated as sensitive data<br /> and receive enhanced protection in
                    accordance with the LGPD (Brazilian Data Protection Law).
                </Typography>
            </>
        ),
    },
    {
        key: "usage",
        label: "How We Use Your Data",
        content: (
            <>
                <Typography variant="h6" gutterBottom>
                    Purpose of Use
                </Typography>
                <Typography component="ul" sx={{ pl: 3 }}>
                    <li>
                        <Typography>
                            To generate analytics, dashboards, and personalized
                            recommendations for athletes and coaches.
                        </Typography>
                    </li>
                    <li>
                        <Typography>
                            To improve user experience and ensure platform security (e.g.,
                            monitoring performance and preventing abuse).
                        </Typography>
                    </li>
                    <li>
                        <Typography>
                            To comply with legal obligations and respond to legitimate
                            authority requests when applicable.
                        </Typography>
                    </li>
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1">Data Sharing</Typography>
                <Typography paragraph>
                    We do not sell your data. Sharing only occurs with service providers
                    essential to platform operation (e.g.,<br /> hosting, database management)
                    and always under strict confidentiality and security agreements.
                </Typography>
            </>
        ),
    },
    {
        key: "security",
        label: "Security and Privacy",
        content: (
            <>
                <Typography variant="h6" gutterBottom>
                    How We Protect Your Data
                </Typography>
                <Typography component="ul" sx={{ pl: 3 }}>
                    <li>
                        <Typography>
                            Authentication via JWT and secure HTTPS connections between the
                            front-end and back-end.
                        </Typography>
                    </li>
                    <li>
                        <Typography>
                            Role-based access control and activity logging for accountability.
                        </Typography>
                    </li>
                    <li>
                        <Typography>
                            Infrastructure hosted on trusted providers (front-end on Vercel
                            and back-end on Render) with managed MySQL databases.
                        </Typography>
                    </li>
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1">Data Retention</Typography>
                <Typography paragraph>
                    We retain personal data only as long as necessary for the stated
                    purposes and to comply with legal obligations.<br /> You can request data
                    deletion at any time, subject to applicable laws and technical
                    limitations.
                </Typography>
            </>
        ),
    },
    {
        key: "rights",
        label: "Your Rights",
        content: (
            <>
                <Typography variant="h6" gutterBottom>
                    User Rights (LGPD)
                </Typography>
                <Typography component="ul" sx={{ pl: 3 }}>
                    <li>
                        <Typography>Access and correct your personal information.</Typography>
                    </li>
                    <li>
                        <Typography>
                            Request portability or deletion of your data where applicable.
                        </Typography>
                    </li>
                    <li>
                        <Typography>
                            Revoke consent and request information on how your data is used.
                        </Typography>
                    </li>
                </Typography>
                <Typography paragraph>
                    To exercise your rights, please contact us using the details below.
                </Typography>
            </>
        ),
    },
    {
        key: "contact",
        label: "Contact / Support",
        content: (
            <>
                <Typography variant="h6" gutterBottom>
                    How to Reach Us
                </Typography>
                <Typography paragraph>
                    Data Protection Officer (DPO) email: <b>tccnathankauan@gmail.com</b>
                </Typography>
                <Typography paragraph>
                    For any privacy-related questions, concerns, or requests, please
                    contact us and we’ll respond promptly.
                </Typography>
            </>
        ),
    },
];

export default function PrivacyPolicyDialog({ open, onClose }: PrivacyPolicyDialogProps) {
    const [tab, setTab] = React.useState(0);
    const theme = useTheme();

    return (
        <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth
            PaperProps={{
                sx: {
                    bgcolor: theme.palette.background.paper,
                    backgroundImage: 'none',
                },
            }}>
            <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1, bgcolor: '#2CAE4D', color: 'white' }}>
                <ShieldIcon /> Privacy Policy
                <IconButton aria-label="close" onClick={onClose} sx={{ ml: "auto" }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>
                <Box sx={{
                    display: "flex", height: 400,
                    ".MuiTab-root": {
                        color: theme.palette.text.secondary,
                    }, ".MuiTab-root.Mui-selected": {
                        color: theme.palette.text.primary,
                    },
                    ".MuiTabs-indicator": {
                        backgroundColor: "#249B45",
                    }
                }}>
                    <Tabs
                        orientation="vertical"
                        value={tab}
                        onChange={(e, v) => setTab(v)}
                        sx={{
                            borderRight: 1, borderColor: "divider", width: 250
                        }}
                    >
                        {sections.map((s, i) => (
                            <Tab key={s.key} label={s.label} />
                        ))}
                    </Tabs>
                    <Box sx={{ flexGrow: 1, px: 3, overflowY: "auto" }}>
                        {sections[tab].content}
                    </Box>
                </Box>
            </DialogContent>
        </Dialog>
    );
}
