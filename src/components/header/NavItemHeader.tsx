import { Typography, useTheme } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

interface NavItemProps {
  label: string;
  path: string;
  isActive: boolean;
}

const NavItemHeader: React.FC<NavItemProps> = ({ label, path, isActive }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Typography
      variant="body2"
      sx={{
        fontWeight: "bold",
        alignSelf: "center",
        textAlign: "center",
        pr: 3,
        cursor: "pointer",
        pb: 0.5,
        color: isActive ? theme.palette.text.primary : theme.palette.text.secondary,
        position: "relative",
        "&::after": isActive
          ? {
              content: '""',
              position: "absolute",
              bottom: 0,
              left: "32%",
              transform: "translateX(-50%)",
              height: "3px",
              width: "70%",
              background:
                theme.palette.mode === "dark"
                  ? "linear-gradient(to right, #2CAE4D, #fefefe)"
                  : "linear-gradient(to right, #2CAE4D, #000000)",
              borderRadius: "2px",
            }
          : {},
        transition: "0.3s",
        "&:hover": { color: theme.palette.text.primary },
      }}
      onClick={() => navigate(path)}
    >
      {label}
    </Typography>
  );
};

export default NavItemHeader;
