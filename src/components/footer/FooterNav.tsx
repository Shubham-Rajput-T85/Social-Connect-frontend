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
    { label: "Profile", path: "/profile",
       icon: user ?
       <Avatar
       src={`${BASE_URL}${user.profileUrl}`}
       alt="User Avatar"
     />:
       <PersonIcon /> },
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
        display: { xs: "block", sm: "none" }, // Only visible on mobile
        zIndex: 1000,
      }}
      elevation={3}
    >
      <BottomNavigation
        value={getActivePath()} // Use computed active path
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
                color: "secondary.main", // Highlight active tab
              },
            }}
          />
        ))}
      </BottomNavigation>
    </Paper>
  );
};

export default FooterNav;
