import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { NavLink } from 'react-router-dom';
import { authActions } from "../store/auth-slice";
import { useSelector, useDispatch } from "react-redux";

import MenuIcon from '@mui/icons-material/Menu';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import LoginIcon from '@mui/icons-material/Login';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';

export default function Navbar() {
  const user = useSelector((state: any) => state.auth.user);
  const dispatch = useDispatch();

  const logoutHandler = () => {
    localStorage.removeItem("user");
    dispatch(authActions.logout());
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <div style={{ color: "white", fontFamily: "algerian" }}>Learn React</div>
          </Typography>
          {!user &&
            <>
              <Button color="inherit" component={NavLink} to="/login" ><LoginIcon sx={{ mr: 1 }} /> Login</Button>
              <Button color="inherit" component={NavLink} to="/signup" ><HowToRegIcon sx={{ mr: 1 }} /> Sign up</Button>
            </>
          }
          {user &&
            <>
              <Button color="inherit" component={NavLink} to="/dashboard" ><DashboardIcon sx={{ mr: 1 }} /> Dashboard</Button>
              <Button color="inherit" onClick={ logoutHandler } ><LogoutIcon sx={{ mr: 1 }} /> Logout</Button>
            </>
          }
        </Toolbar>
      </AppBar>
    </Box>
  );
}