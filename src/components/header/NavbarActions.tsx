import React from "react";
import { Box, Button, IconButton, Badge } from "@mui/material";
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useDispatch } from "react-redux";
import { authActions } from "../store/auth-slice";

const NavbarActions: React.FC = () => {
  const dispatch = useDispatch();

  const logoutHandler = async () => {
    await fetch("http://localhost:8080/auth/logout", { method: "POST", credentials: "include" });
    dispatch(authActions.logout());
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
      <IconButton color="primary">
        <Badge badgeContent={3} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Button variant="contained" color="primary" startIcon={<LogoutIcon />} onClick={logoutHandler} sx={{ textTransform: 'none', borderRadius: '8px' }}>
        Logout
      </Button>
      <IconButton sx={{ color: 'primary.main' }}>
        <AccountCircle fontSize="large" />
      </IconButton>
    </Box>
  );
};

export default NavbarActions;
