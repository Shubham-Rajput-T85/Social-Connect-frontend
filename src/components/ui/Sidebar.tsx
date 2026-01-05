import React, { useState } from "react";
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
import SkeletonSidebar from "./SkeletonSidebar";
import StoryRing from "./StoryRing";
import { alertActions } from "../store/alert-slice";
import { useDispatch } from "react-redux";
import { authActions } from "../store/auth-slice";
import StoryModal from "../story/AddStoryModal";
import StoryViewerModal from "../story/StoryViewerModal";
import { BASE_URL } from "../../api/endpoints";

interface SidebarLink {
  label: string;
  path: string;
  icon: React.ReactNode;
}

const Sidebar = () => {
  const user = useSelector((state: any) => state.auth.user);
  const [openStoryModal, setOpenStoryModal] = useState(false);
  const [openViewer, setOpenViewer] = useState(false);

  const dispatch = useDispatch();

  const links: SidebarLink[] = [
    { label: "Home", path: "/", icon: <HomeIcon /> },
    { label: "Profile", path: "/profile/", icon: <PersonIcon /> },
    { label: "Messages", path: "/message", icon: <MessageIcon /> },
  ];

  if (!user) {
    return <SkeletonSidebar />;
  }
  console.log("profile:",user.profileUrl);
  

  const handleAddStory = () => setOpenStoryModal(true);
  console.log("story count: ",user.storyCount, " openViewer: ",openViewer);
  const handleViewStory = () => user.storyCount > 0 && setOpenViewer(true);

  const handleStoryAdded = () => {
    dispatch(authActions.incrementStoryCount());
    dispatch(alertActions.showAlert({
      severity: "success",
      message: "Story added successfully!",
    }));
  };

  return (
    <>
      {/* LEFT SIDEBAR */}
      <Box>
        <Paper sx={{ padding: 2, mb: 2 }}>
          <Box sx={{ textAlign: "center" }}>
            <Box sx={{ position: "relative", display: "inline-block" }}>
            <StoryRing
                keepAddButton={true}
                storyCount={user.storyCount}
                onAddStory={handleAddStory}
                onViewStory={handleViewStory}>
                <Avatar
                  src={user.profileUrl ? `${BASE_URL}${user.profileUrl}` : undefined}
                  alt={user.name.charAt(0)}
                  sx={{
                    width: 80,
                    height: 80,
                    margin: "auto",
                    borderRadius: "50%",
                    bgcolor: !user.profileUrl ? "grey.400" : undefined,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {!user.profileUrl && <PersonIcon sx={{ fontSize: 40 }} />}
                </Avatar>
              </StoryRing>
            </Box>
            <Typography variant="h6" sx={{ mt: 1 }}>
              {user.name}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                maxWidth: "150px",
                whiteSpace: "normal",
                wordBreak: "break-word",
                textAlign: "center",
                mx: "auto",
              }}
            >
              {user.bio || "No bio available"}
            </Typography>
          </Box>

          {/* Story Modal */}
          <StoryModal
            open={openStoryModal}
            onClose={() => setOpenStoryModal(false)}
            onStoryAdded={handleStoryAdded}
          />

          {/* Story Viewer */}
          <StoryViewerModal
            open={openViewer}
            onClose={() => setOpenViewer(false)}
            userId={user._id}
          />

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