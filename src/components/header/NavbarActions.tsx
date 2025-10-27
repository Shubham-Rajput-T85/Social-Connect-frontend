import React, { useState } from "react";
import { Avatar, Box, Button, IconButton } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { useDispatch } from "react-redux";
import { authActions } from "../store/auth-slice";
import Notification from "./Notification";
import { getSocket } from "../../socket";
import { useSelector } from "react-redux";
import { BASE_URL } from "../../api/endpoints";
import { useNavigate } from "react-router-dom";
import ConfirmDialog from "../ui/ConfirmDialog";

const NavbarActions: React.FC = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.auth.user);
  const navigate = useNavigate();
  const [confirmLogout, setConfirmLogout] = useState(false);
  console.log("user from navbar", user);
  const logoutHandler = async () => {
    await fetch("http://localhost:8080/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    dispatch(authActions.logout());
    const socket = getSocket();
    socket.emit("logout");
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
        onClick={() => setConfirmLogout(true)}
        sx={{ textTransform: "none", borderRadius: "8px" }}
      >
        Logout
      </Button>

      {/* Profile Icon */}
      <IconButton sx={{ color: "primary.main" }} onClick={() => navigate("/profile/my-posts")}>
        {user &&
          <Avatar
            src={`${BASE_URL}${user.profileUrl}`}
            alt="User Avatar"
          />
        }
        {!user &&
          <AccountCircle fontSize="large" />
        }
      </IconButton>

      <ConfirmDialog
        open={confirmLogout}
        title="Logout?"
        description="Are you sure you want to log out of your account?"
        onConfirm={() => {
          setConfirmLogout(false);
          logoutHandler();
        }}
        onCancel={() => setConfirmLogout(false)}
        confirmText="Logout"
        color="error"
      />

    </Box>
  );
};

export default NavbarActions;

