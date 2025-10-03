import React from "react";
import {
  Box,
  Paper,
  Avatar,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  ListItemIcon,
} from "@mui/material";
import {
  Home as HomeIcon,
  Person as PersonIcon,
  Message as MessageIcon,
} from "@mui/icons-material";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { BASE_URL } from "../../api/endpoints";

interface SidebarLink {
  label: string;
  path: string;
  icon: React.ReactNode;
}

const Sidebar = () => {
  const user = useSelector((state: any) => state.auth.user);
  console.log("user from sidebar:", user);

  const links: SidebarLink[] = [
    { label: "Home", path: "/", icon: <HomeIcon /> },
    { label: "Profile", path: "/profile", icon: <PersonIcon /> },
    { label: "Messages", path: "/message/1", icon: <MessageIcon /> },
  ];


  if (!user) {
    return <></>;
  }

  return (
    <>
      {/* LEFT SIDEBAR */}
      <Box>
        <Paper sx={{ padding: 2, mb: 2 }}>
          <Box sx={{ textAlign: "center" }}>
            <Box sx={{ position: "relative", display: "inline-block" }}>
              <Avatar
                src={BASE_URL + user.profileUrl}
                alt="User Avatar"
                sx={{ width: 80, height: 80, margin: "auto" }}
              />
            </Box>
            <Typography variant="h6" sx={{ mt: 1 }}>
              {user.name}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                maxWidth:"150px",
                whiteSpace: "normal",
                wordBreak: "break-word",
                textAlign: "center",
                mx: "auto", 
              }}
            >
              {user.bio || "No bio available"}
            </Typography>
          </Box>
          <Box>
            {/* Navigation */}
            <List>
              {links.map(({ label, path, icon }) => (
                <ListItem key={path} disablePadding>
                  <NavLink
                    to={path}
                    style={{ textDecoration: "none", width: "100%" }}
                  >
                    {({ isActive }: { isActive: boolean }) => (
                      <ListItemButton
                        selected={isActive}
                        sx={{
                          color: isActive ? "primary.main" : "inherit",
                          "& .MuiListItemIcon-root": {
                            color: isActive ? "primary.main" : "inherit",
                          },
                        }}
                      >
                        <ListItemIcon>{icon}</ListItemIcon>
                        <ListItemText primary={label} />
                      </ListItemButton>
                    )}
                  </NavLink>
                </ListItem>
              ))}
            </List>
          </Box>
        </Paper>
      </Box>
    </>
  )
}

export default Sidebar