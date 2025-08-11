import { TextField, useTheme } from "@mui/material";
import React, { useState } from "react";

interface CustomTextFieldProps {
  label: string;
  type?: string;
  color?: "primary" | "secondary" | "success" | "error" | "info" | "warning";
  restriction?: "onlyLetters" | "onlyNumbers" | "none";
}

const CustomTextField: React.FC<CustomTextFieldProps> = ({
  label,
  type = "text",
  color = "success",
  restriction = "none",
}) => {
  const theme = useTheme();
  const [value, setValue] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;

    if (restriction === "onlyLetters") {
      newValue = newValue.replace(/[^a-zA-ZÀ-ÿ\s]/g, "");
    }

    if (restriction === "onlyNumbers") {
      newValue = newValue.replace(/[^0-9]/g, "");
    }

    setValue(newValue);
  };

  return (
    <TextField
      label={label} type={type} variant="outlined" size='small' color={color} value={value} onChange={handleChange}
      sx={{
        mt: 1, mb: 1, width: "80%", backgroundColor: theme.palette.background.default,
        input: { color: theme.palette.text.primary }, label: { color: theme.palette.text.secondary },
      }}
    />
  );
};

export default CustomTextField;
