import { AppBar, Avatar, Box, Button, IconButton, Toolbar } from '@mui/material';
import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import LogoLight from '../../assets/LogoWiKoLight.png';
import LogoDark from '../../assets/LogoWiKoDark.png';
import { useLocation, useNavigate } from 'react-router-dom';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { useUserContext } from '../../contexts/UserContext';
import { ExpandMore } from '@mui/icons-material';
import NavItemHeader from './NavItemHeader';
import UserMenuHeader from './UserMenuHeader';

function HeaderHomeCoach() {
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
    { label: "Home", path: "/coach-home" },
    { label: "Sessions", path: "/coach-sessions" },
    { label: "My Athletes", path: "/coach-athletes" },
    { label: "Support/Help", path: "/support" }
  ];

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        sx={{
          backgroundColor: theme.palette.background.default, color: theme.palette.text.primary,
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

          <Button
            variant="contained"
            color="success"
            startIcon={<CalendarMonthIcon fontSize="small" />}
            onClick={() => navigate('/coach-new-session')}
            sx={{
              mr: 2, backgroundColor: '#2CAE4D', textTransform: 'none', color: '#fff',
              width: '150px', height: '30px', '&:hover': { backgroundColor: '#249B45' }
            }}
          >
            New Session
          </Button>

          <Box display="flex" alignItems="center">
            <IconButton onClick={handleOpenMenu}>
              <Avatar
                src={user?.userPhoto || ""}
                alt={user?.name || "User"}
                sx={{ width: 40, height: 40 }}
              />
              <ExpandMore />
            </IconButton>

            <UserMenuHeader anchorEl={anchorEl} onClose={handleCloseMenu} user={"coach"} />
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default HeaderHomeCoach;
