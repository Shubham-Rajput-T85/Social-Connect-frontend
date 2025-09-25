import React from "react";
import { Box, Button, IconButton } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { useDispatch } from "react-redux";
import { authActions } from "../store/auth-slice";
import Notification from "./Notification";
import { getSocket } from "../../socket";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

const NavbarActions: React.FC = () => {
  const dispatch = useDispatch();
  const user = useSelector((state : any) => state.auth.user);

  const logoutHandler = async () => {
    await fetch("http://localhost:8080/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    dispatch(authActions.logout());
    const socket = getSocket();
    const currentUserId = user._id;
    socket.emit("logout", currentUserId);
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
      {/* Notification Component */}
      <Notification />

      {/* Logout Button */}
      <Button
        variant="contained"
        color="primary"
        startIcon={<LogoutIcon />}
        onClick={logoutHandler}
        sx={{ textTransform: "none", borderRadius: "8px" }}
      >
        Logout
      </Button>

      {/* Profile Icon */}
      <IconButton sx={{ color: "primary.main" }}>
        <AccountCircle fontSize="large" />
      </IconButton>
    </Box>
  );
};

export default NavbarActions;

