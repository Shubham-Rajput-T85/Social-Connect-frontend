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


interface SidebarLink {
  label: string;
  path: string;
  icon: React.ReactNode;
}



const Sidebar = () => {
  const links: SidebarLink[] = [
    { label: "Home", path: "/", icon: <HomeIcon /> },
    { label: "Profile", path: "/profile", icon: <PersonIcon /> },
    { label: "Messages", path: "/message/1", icon: <MessageIcon /> },
  ];

  return (
    <>
      {/* LEFT SIDEBAR */}
      <Box>
        <Paper sx={{ padding: 2, mb: 2 }}>
          <Box sx={{ textAlign: "center" }}>
            <Box sx={{ position: "relative", display: "inline-block" }}>
              <Avatar
                src="https://i.pravatar.cc/150?img=1"
                alt="User Avatar"
                sx={{ width: 80, height: 80, margin: "auto" }}
              />
              <Box
                sx={{
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  backgroundColor: "green",
                  position: "absolute",
                  bottom: 4,
                  right: 4,
                  border: "2px solid white",
                }}
              />
            </Box>
            <Typography variant="h6" sx={{ mt: 1 }}>
              Alex Johnson
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Building the future 🚀
            </Typography>
          </Box>
          <Box>
            {/* Navigation */}
            <List>
              {links.map(({ label, path, icon }) => (
                <ListItem key={path} disablePadding>
                  <NavLink to={path} style={{ textDecoration: "none", width: "100%" }}>
                    {({ isActive }: { isActive: boolean }) => (
                      <ListItemButton 
                      selected={ isActive }
                      // onClick={() => setActiveTab("general")}
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