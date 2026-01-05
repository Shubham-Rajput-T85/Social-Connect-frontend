import React, { useEffect, useState } from "react";
import { Box, Paper, Typography, Avatar, Button, Divider } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { BASE_URL } from "../../../api/endpoints";
import StoryRing from "../../ui/StoryRing";
import { authActions } from "../../store/auth-slice";
import { alertActions } from "../../store/alert-slice";
import StoryModal from "../../story/AddStoryModal";
import StoryViewerModal from "../../story/StoryViewerModal";
import FollowModal from "./FollowModal";
import { Person as PersonIcon } from "@mui/icons-material";
import { userService } from "../../../api/services/user.service";


const ProfileHeader = () => {
  const user = useSelector((state: any) => state.auth.user);
  const navigate = useNavigate();
  const location = useLocation();
  const [openStoryModal, setOpenStoryModal] = useState(false);
  const [openViewer, setOpenViewer] = useState(false);
  console.log("user :.................................",user);
  const [userFollowCount, setUserFollowCount] = useState({
    postCount: user.postCount,
    followersCount: user.followersCount,
    followingCount: user.followingCount
  });

  const dispatch = useDispatch();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"followers" | "following">("followers");

    useEffect(() => {
    const fetchCounts = async () => {
      try {
        const res = await userService.getUserFollowCount(user._id); // or getUserCounts()
        setUserFollowCount(res.data);
      } catch (error) {
        console.error("Failed to fetch user counts", error);
      }
    };

    fetchCounts();
  }, []);

  // Extract the last segment of the path to determine active tab
  const path = location.pathname.split("/").pop();
  const activeTab = path === "my-posts" ? "my-posts" : path === "add-post" ? "add-post" : "settings";

  const handleAddStory = () => setOpenStoryModal(true);
  const handleViewStory = () => user.storyCount > 0 && setOpenViewer(true);

  const handleStoryAdded = () => {
    dispatch(authActions.incrementStoryCount());
    dispatch(alertActions.showAlert({
      severity: "success",
      message: "Story added successfully!",
    }));
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2
        }}
      >
        {/* Left - Avatar + Bio */}
        <Box sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: { xs: "center", md: "flex-start" },
          textAlign: { xs: "center", md: "left" },
          gap: 2
        }}>
          <Box>
            <Box sx={{ display: { xs: "none", sm: "block" } }}>
              <Avatar
                src={user?.profileUrl ? `${BASE_URL}${user.profileUrl}` : undefined}
                alt="User Avatar"
                sx={{ width: 80, height: 80 }}
              />
            </Box>
            <Box sx={{ display: { xs: "block", sm: "none" } }}>
              <StoryRing
                keepAddButton={true}
                storyCount={user.storyCount}
                onAddStory={handleAddStory}
                onViewStory={handleViewStory}>
                <Avatar
                  src={user.profileUrl ? `${BASE_URL}${user.profileUrl}` : undefined}
                  alt="profile"
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
          </Box>
          <Box>
            <Typography variant="h6">{user?.name}</Typography>
            <Typography variant="body1" color="gray">
              {user?.username}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user?.bio}
            </Typography>
          </Box>
        </Box>

        {/* Right - Stats */}
        <Box sx={{ display: "flex", gap: 4 }}>
          <Box>
            <Typography variant="h6" align="center">
              {userFollowCount.postCount}
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center">
              Posts
            </Typography>
          </Box>
          <Box
            sx={{ cursor: "pointer" }}
            onClick={() => {
              setModalType("followers");
              setModalOpen(true);
            }}
          >
            <Typography variant="h6" align="center">
              {userFollowCount.followersCount}
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center">
              Followers
            </Typography>
          </Box>
          <Box
            sx={{ cursor: "pointer" }}
            onClick={() => {
              setModalType("following");
              setModalOpen(true);
            }}
          >
            <Typography variant="h6" align="center">
              {userFollowCount.followingCount}
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center">
              Following
            </Typography>
          </Box>
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Tabs Navigation */}
      <Box sx={{ display: "flex", gap: 2, justifyContent: { xs: "center", md: "flex-start" }, }}>
        <Button
          onClick={() => navigate("/profile/my-posts")}
          variant={activeTab === "my-posts" ? "contained" : "text"}
        >
          My Posts
        </Button>

        <Button
          onClick={() => navigate("/profile/add-post")}
          variant={activeTab === "add-post" ? "contained" : "text"}
        >
          Add Post
        </Button>

        <Button
          onClick={() => navigate("/profile/settings")}
          variant={activeTab === "settings" ? "contained" : "text"}
        >
          Settings
        </Button>
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
      <FollowModal open={modalOpen} onClose={() => setModalOpen(false)} userId={user._id} type={modalType} />
    </Paper>
  );
};

export default ProfileHeader;
