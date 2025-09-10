import { AppBar, Avatar, Box, IconButton, Toolbar } from '@mui/material';
import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import LogoLight from '../../assets/LogoWiKoLight.png';
import LogoDark from '../../assets/LogoWiKoDark.png';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUserContext } from '../../contexts/UserContext';
import { ExpandMore } from '@mui/icons-material';
import NavItemHeader from './NavItemHeader';
import UserMenuHeader from './UserMenuHeader';

export default function HeaderHomeAthlete() {
  const theme = useTheme();
  const logo = theme.palette.mode === 'dark' ? LogoDark : LogoLight;
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useUserContext();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const navItems = [
    { label: "Home", path: "/athlete-home" },
    { label: "My Sessions", path: "/athlete/sessions" },
    { label: "My Team", path: "/athlete/team" },
    { label: "Support/Help", path: "/support" }
  ];

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        sx={{
          backgroundColor: theme.palette.background.paper, color: theme.palette.text.primary,
        }}
        elevation={1}
      >
        <Toolbar>
          <Box component="img" src={logo} alt="SIMADA Logo"
            sx={{ height: 30, ml: 1, mr: 'auto' }}
          />
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return <NavItemHeader key={item.label} label={item.label} path={item.path} isActive={isActive} />;
          })}

          <Box display="flex" alignItems="center">
            <IconButton onClick={handleOpenMenu}>
              <Avatar
                src={user?.userPhoto || ""}
                alt={user?.name || "User"}
                sx={{ width: 40, height: 40 }}
              />
              <ExpandMore />
            </IconButton>

            <UserMenuHeader anchorEl={anchorEl} onClose={handleCloseMenu} user={"athlete"} />
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
