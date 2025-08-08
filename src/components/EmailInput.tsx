import { TextField, useTheme } from '@mui/material';

const EmailInput = () => {
    const theme = useTheme();

    return (
        <TextField
            label="Email"
            variant="outlined"
            size="small"
            color="success"
            sx={{
                mt: 3,
                mb: 1,
                width: '80%',
                backgroundColor: theme.palette.background.default,
                input: { color: theme.palette.text.primary },
                label: { color: theme.palette.text.secondary },
            }}
        />
    );
};

export default EmailInput;
