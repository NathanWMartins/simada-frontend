import { TextField, useTheme, type TextFieldProps } from "@mui/material";
import { useState } from "react";

type Restriction = "onlyLetters" | "onlyNumbers" | "none";

interface CustomTextFieldProps extends Omit<TextFieldProps, "onChange"> {
  restriction?: Restriction;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CustomTextField: React.FC<CustomTextFieldProps> = ({
  restriction = "none",
  value: propValue,
  onChange: propOnChange,
  sx,
  ...rest
}) => {
  const theme = useTheme();
  const [localValue, setLocalValue] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;

    if (restriction === "onlyLetters") {
      newValue = newValue.replace(/[^a-zA-ZÀ-ÿ\s]/g, "");
    }
    if (restriction === "onlyNumbers") {
      newValue = newValue.replace(/[^0-9]/g, "");
    }

    if (propOnChange) {
      propOnChange({ ...e, target: { ...e.target, value: newValue } });
    } else {
      setLocalValue(newValue);
    }
  };

  return (
    <TextField
      variant="outlined"
      size="small"
      value={propValue ?? localValue}
      onChange={handleChange}
      fullWidth
      sx={{
        mt: 1,
        mb: 1,
        width: "80%",
        backgroundColor: theme.palette.background.default,
        input: { color: theme.palette.text.primary },
        label: { color: theme.palette.text.secondary },
      }}
      {...rest}
    />
  );
};

export default CustomTextField;
