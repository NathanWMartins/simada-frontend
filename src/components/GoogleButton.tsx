import { Button, useTheme } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import { MouseEventHandler } from 'react';

type GoogleButtonProps = {
    onClick?: MouseEventHandler<HTMLButtonElement>;
};

const GoogleButton = ({ onClick }: GoogleButtonProps) => {
    const theme = useTheme();

    return (
        <Button
            variant="outlined" color="success" fullWidth startIcon={<GoogleIcon color="success" />}
            sx={{
                mt: 1, width: '80%', mx: 'auto', ustifyContent: 'center', backgroundColor: theme.palette.background.default,
                color: theme.palette.text.primary, borderColor: theme.palette.text.secondary,
                textTransform: 'none', fontSize: 14, height: 40, '&:hover': { backgroundColor: theme.palette.action.hover },
            }}
            onClick={onClick}
        >
            Entrar com Google
        </Button>
    );
};

export default GoogleButton;
