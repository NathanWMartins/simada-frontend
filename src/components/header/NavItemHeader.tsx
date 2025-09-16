import { Typography, useTheme } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

interface NavItemProps {
  label: string;
  path?: string;
  onClick?: () => void;
  isActive: boolean;
}

const NavItemHeader: React.FC<NavItemProps> = ({ label, path, onClick, isActive }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (path) {
      navigate(path);
    }
  };

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
      onClick={handleClick}
    >
      {label}
    </Typography>
  );
};

export default NavItemHeader;
