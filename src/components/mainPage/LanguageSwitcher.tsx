import React, { useState } from 'react';
import { IconButton, Menu, MenuItem, Tooltip, Box } from '@mui/material';
import { Public } from '@mui/icons-material';
import { useI18n } from '../../i18n/I18nProvider';

const Flag: React.FC<{ code: 'pt' | 'en' }> = ({ code }) => (
    <span style={{ fontSize: 16 }}>
        {code === 'pt' ? '🇧🇷' : '🇺🇸'}
    </span>
);

export default function LanguageSwitcher() {
    const { lang, setLang } = useI18n();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLanguageChange = (newLang: 'pt' | 'en') => {
        setLang(newLang);
        handleClose();
    };

    return (
        <Box>
            <Tooltip title="Change language">
                <IconButton
                    onClick={handleClick}
                    sx={{
                        color: 'text.primary',
                        '&:hover': {
                            backgroundColor: 'action.hover',
                        },
                    }}
                >
                    <Public />
                </IconButton>
            </Tooltip>

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                sx={{
                    '& .MuiPaper-root': {
                        minWidth: 140,
                    },
                }}
            >
                <MenuItem
                    selected={lang === 'pt'}
                    onClick={() => handleLanguageChange('pt')}
                >
                    <Flag code="pt" />
                    <Box sx={{ ml: 1.5 }}>Português</Box>
                </MenuItem>

                <MenuItem
                    selected={lang === 'en'}
                    onClick={() => handleLanguageChange('en')}
                >
                    <Flag code="en" />
                    <Box sx={{ ml: 1.5 }}>English</Box>
                </MenuItem>
            </Menu>
        </Box>
    );
}