import * as React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Box,
    Tabs,
    Tab,
    Typography,
    Divider,
    IconButton,
    useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ShieldIcon from "@mui/icons-material/Security";
import { useI18n } from "../../i18n/I18nProvider";

type PrivacyPolicyDialogProps = {
    open: boolean;
    onClose: () => void;
};

export default function PrivacyPolicyDialog({ open, onClose }: PrivacyPolicyDialogProps) {
    const [tab, setTab] = React.useState(0);
    const theme = useTheme();
    const { t } = useI18n();

    const sections = [
        {
            key: "data",
            label: t('data_collection_label'),
            content: (
                <>
                    <Typography variant="h6" gutterBottom>
                        {t('data_collection_title')}
                    </Typography>
                    <Typography paragraph dangerouslySetInnerHTML={{ __html: t('data_collection_text') }} />
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle1">{t("data_collection_sensitive_subtitle")}</Typography>
                    <Typography paragraph dangerouslySetInnerHTML={{ __html: t('data_collection_sensitive_text') }} />
                </>
            ),
        },
        {
            key: "usage",
            label: t('use_data_label'),
            content: (
                <>
                    <Typography variant="h6" gutterBottom>
                        {t('use_data_title')}
                    </Typography>
                    <Typography component="ul" sx={{ pl: 3 }}>
                        <li>
                            <Typography>
                                {t('use_data_item_1')}
                            </Typography>
                        </li>
                        <li>
                            <Typography paragraph dangerouslySetInnerHTML={{ __html: t('use_data_item_2') }} />
                        </li>
                        <li>
                            <Typography>
                                {t('use_data_item_3')}
                            </Typography>
                        </li>
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle1">{t('use_data_sharing_title')}</Typography>
                    <Typography paragraph dangerouslySetInnerHTML={{ __html: t('use_data_sharing_text') }} />
                </>
            ),
        },
        {
            key: "security",
            label: t('security_label'),
            content: (
                <>
                    <Typography variant="h6" gutterBottom>
                        {t('security_title')}
                    </Typography>
                    <Typography component="ul" sx={{ pl: 3 }}>
                        <li>
                            <Typography>
                                {t('security_item_1')}
                            </Typography>
                        </li>
                        <li>
                            <Typography>
                                {t('security_item_2')}
                            </Typography>
                        </li>
                        <li>
                            <Typography paragraph dangerouslySetInnerHTML={{ __html: t('security_item_3') }} />
                        </li>
                    </Typography>
                </>
            ),
        },
        {
            key: "rights",
            label: t('rigths_label'),
            content: (
                <>
                    <Typography variant="h6" gutterBottom>
                        {t('rigths_title')}
                    </Typography>
                    <Typography component="ul" sx={{ pl: 3 }}>
                        <li>
                            <Typography>{t('rights_item_1')}</Typography>
                        </li>
                        <li>
                            <Typography>
                                {t('rights_item_2')}
                            </Typography>
                        </li>
                        <li>
                            <Typography>
                                {t('rights_item_3')}
                            </Typography>
                        </li>
                    </Typography>
                </>
            ),
        },
    ];

    return (
        <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth
            PaperProps={{
                sx: {
                    bgcolor: theme.palette.background.paper,
                    backgroundImage: 'none',
                },
            }}>
            <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1, bgcolor: '#2CAE4D', color: 'white' }}>
                <ShieldIcon /> {t('policy_title')}
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
