import React, { useState } from "react";
import { AppBar, Toolbar, Box, IconButton, Menu, MenuItem, Typography } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import NavbarLogo from "./NavbarLogo";
import NavbarSearch from "./NavbarSearch";
import NavbarActions from "./NavbarActions";
import { Search } from "@mui/icons-material";
import Notification from "./Notification";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { authActions } from "../store/auth-slice";
import { getSocket } from "../../socket";

const Navbar: React.FC = () => {
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const logoutHandler = async () => {
    try {
      await fetch("http://localhost:8080/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      dispatch(authActions.logout());
      const socket = getSocket();
      socket.emit("logout");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      handleMenuClose();
    }
  };

  const goToProfile = () => {
    navigate("/profile");
    handleMenuClose();
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#fff', color: 'text.primary', boxShadow: 2 }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <NavbarLogo />

        {/* Desktop Search */}
        <Box sx={{ flexGrow: 1, display: { xs: 'none', sm: 'none', md: 'flex' }, justifyContent: 'center' }}>
          <NavbarSearch onClose={function (): void {
          }} />
        </Box>

        <Box sx={{ display: "flex" }}>

          {/* Mobile Icons */}
          <Box sx={{ display: { xs: 'flex', sm: 'flex', md: 'none' } }}>
            <IconButton onClick={() => setSearchModalOpen(true)}>
              <Search />
            </IconButton>
          </Box>

          <Box sx={{ display: { xs: 'flex', sm: 'none' } }}>
            <Notification />
          </Box>

          {/* Actions */}
          <Box sx={{ display: { xs: 'none', sm: 'flex' } }}>
            <NavbarActions />
          </Box>

          {/* Mobile Icons */}
          <Box sx={{ display: { xs: "flex", sm: "none" } }}>
            <IconButton onClick={handleMenuOpen}>
              <MenuIcon />
            </IconButton>
          </Box>
        </Box>
      </Toolbar>

      {/* Mobile Dropdown Menu */}
      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleMenuClose}
        sx={{ borderRadius: "20px", mt: 1 }}
      >
        <MenuItem onClick={goToProfile}>
          <Typography>Profile</Typography>
        </MenuItem>
        <MenuItem onClick={logoutHandler}>
          <Typography>Logout</Typography>
        </MenuItem>
      </Menu>

      {/* Mobile Search */}
      <NavbarSearch onClose={function (): void { }} isMobile={true} openModal={searchModalOpen} onCloseModal={() => setSearchModalOpen(false)} />
    </AppBar>
  );
}

export default Navbar;
