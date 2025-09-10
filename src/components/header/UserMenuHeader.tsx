import { Menu, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../contexts/UserContext";

interface UserMenuProps {
    anchorEl: null | HTMLElement;
    onClose: () => void;
    user: string;
}

const UserMenuHeader: React.FC<UserMenuProps> = ({ anchorEl, onClose, user }) => {
    const navigate = useNavigate();
    const { logout } = useUserContext();
    const open = Boolean(anchorEl);

    const handleMenuClick = (action: string) => {
        onClose();
        switch (action) {
            case "profile":
                if(user === "coach") navigate("/coach-profile");
                else navigate("/athlete/profile");
                break;
            case "logout":
                logout();
                navigate("/");
                break;
            default:
                break;
        }
    };

    return (
        <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={onClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
            <MenuItem onClick={() => handleMenuClick("profile")}>Profile</MenuItem>
            <MenuItem onClick={() => handleMenuClick("settings")}>Settings</MenuItem>
            <MenuItem onClick={() => handleMenuClick("logout")}
                sx={{ color: 'inherit', '&:hover': { color: '#ff6b6b' } }}>Logout</MenuItem>
        </Menu>
    );
};

export default UserMenuHeader;
