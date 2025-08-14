import React from 'react';
import {
    FormControl, IconButton, InputAdornment, InputLabel,
    OutlinedInput, useTheme
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

interface PasswordInputProps {
  label: string;
  id?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PasswordInput: React.FC<PasswordInputProps> = ({ label, id, value, onChange }) => {
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
      <InputLabel htmlFor={id || label}>{label}</InputLabel>
      <OutlinedInput
        id={id || label}
        type={showPassword ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        endAdornment={
          <InputAdornment position="end">
            <IconButton onClick={togglePassword} edge="end">
              {showPassword ? <Visibility fontSize="small" /> : <VisibilityOff fontSize="small" />}
            </IconButton>
          </InputAdornment>
        }
        label={label}
      />
    </FormControl>
  );
};

export default PasswordInput;