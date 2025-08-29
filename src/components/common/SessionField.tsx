// src/components/form/SessionField.tsx
import { TextField, useTheme, type TextFieldProps } from "@mui/material";
import React, { useState } from "react";

type Restriction = "onlyLetters" | "onlyNumbers" | "none";

export interface SessionFieldProps extends Omit<TextFieldProps, "onChange"> {
    restriction?: Restriction;
    tall?: boolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export default function SessionField({
    restriction = "none",
    value: propValue,
    onChange: propOnChange,
    sx,
    tall = true,
    multiline,
    rows,
    ...rest
}: SessionFieldProps) {
    const theme = useTheme();
    const [localValue, setLocalValue] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

    const tallInputSX = tall && !multiline
        ? {
            height: 20,  
            padding: "14px 16px",
        }
        : {};

    const tallTextareaSX = tall && multiline
        ? {
            padding: "14px 16px",
            lineHeight: 1.5,
        }
        : {};

    return (
        <TextField
            variant="outlined"
            fullWidth
            size="small"
            value={propValue ?? localValue}
            onChange={handleChange}
            multiline={multiline}
            rows={rows}
            sx={{
                "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    bgcolor: theme.palette.background.paper,
                    "& .MuiInputBase-input": tallInputSX,            
                    "& .MuiInputBase-inputMultiline": tallTextareaSX,
                },
                mt: 1,
                mb: 1,
                ...sx,
            }}
            {...rest}
        />
    );
}
