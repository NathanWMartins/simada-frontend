import { TextField, useTheme } from "@mui/material";
import React from "react";

interface CustomTextFieldProps {
  label: string;
  type?: string;
  color?: "primary" | "secondary" | "success" | "error" | "info" | "warning";
  size?: "small" | "medium";
}

const CustomTextField: React.FC<CustomTextFieldProps> = ({
  label,
  type = "text",
  color = "success",
  size = "small",
}) => {
  const theme = useTheme();

  return (
    <TextField
      label={label}
      type={type}
      variant="outlined"
      size={size}
      color={color}
      sx={{
        mt: 1, mb: 1, width: "80%", backgroundColor: theme.palette.background.default,
        input: { color: theme.palette.text.primary }, label: { color: theme.palette.text.secondary },
      }}
    />
  );
};

export default CustomTextField;
