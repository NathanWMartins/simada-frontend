import React from 'react';
import {
    FormControl, IconButton, InputAdornment, InputLabel,
    OutlinedInput, useTheme
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const PasswordInput = () => {
    const theme = useTheme();
    const [showPassword, setShowPassword] = React.useState(false);

    const togglePassword = () => setShowPassword((prev) => !prev);

    return (
        <FormControl
            sx={{
                m: 1,
                width: '80%',
                backgroundColor: theme.palette.background.default,
                input: { color: theme.palette.text.primary },
                label: { color: theme.palette.text.secondary },
            }}
            variant="outlined"
            size="small"
            color="success"
        >
            <InputLabel htmlFor="password">Password</InputLabel>
            <OutlinedInput
                id="password"
                type={showPassword ? 'text' : 'password'}
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                            onClick={togglePassword}
                            edge="end"
                        >
                            {showPassword ? <Visibility fontSize="small" /> : <VisibilityOff fontSize="small" />}
                        </IconButton>
                    </InputAdornment>
                }
                label="Password"
            />
        </FormControl>
    );
};

export default PasswordInput;
