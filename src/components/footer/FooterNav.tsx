import React from "react";
import { Avatar, BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";
import { Home as HomeIcon, Person as PersonIcon, Message as MessageIcon } from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { BASE_URL } from "../../api/endpoints";

const FooterNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state: any) => state.auth.user);

  const links = [
    { label: "Home", path: "/", icon: <HomeIcon /> },
    {
      label: "Profile", path: "/profile",
      icon:
        user ? (
          <Avatar
            src={`${BASE_URL}${user.profileUrl}`}
            alt="User Avatar"
            sx={{
              width: 32,      // match icon size
              height: 32,
              fontSize: 14,   // optional, for initials if image not loaded
              mt: "4px",      // minor top margin to center vertically
            }}
          />
        ) : (
          <PersonIcon />
        )
    }
    ,
    { label: "Messages", path: "/message", icon: <MessageIcon /> },
  ];

  // Determine which tab should be active
  const getActivePath = () => {
    if (location.pathname.startsWith("/profile")) return "/profile";
    return location.pathname;
  };

  return (
<Paper
  sx={{
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    display: { xs: "block", sm: "none" },
    zIndex: 1000,
    height: 64,          // increase height
  }}
  elevation={3}
>
  <BottomNavigation
    sx={{ height: "100%" }} // make BottomNavigation fill the Paper height
    value={getActivePath()}
    onChange={(_, newValue) => navigate(newValue)}
    showLabels
  >
    {links.map(({ label, path, icon }) => (
      <BottomNavigationAction
        key={path}
        label={label}
        value={path}
        icon={icon}
        sx={{
          "&.Mui-selected": {
            color: "secondary.main",
          },
          minHeight: "64px", // match Paper height
        }}
      />
    ))}
  </BottomNavigation>
</Paper>

  );
};

export default FooterNav;
