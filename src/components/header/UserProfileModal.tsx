import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Avatar,
  Button,
  Divider,
  IconButton,
  Modal,
  Backdrop,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import { alertActions } from "../store/alert-slice";
import { PostService } from "../../api/services/post.service";

interface UserProfileModalProps {
  open: boolean;
  onClose: () => void;
  userData: any; // clicked user object
  currentUserId: string;
}

type FollowState = "Follow" | "Requested" | "Following" | "Follow Back";
type ActiveTab = "posts" | "followers" | "following" | "";

const UserProfileModal: React.FC<UserProfileModalProps> = ({
  open,
  onClose,
  userData,
  currentUserId,
}) => {
  const dispatch = useDispatch();
  const [followState, setFollowState] = useState<FollowState>("Follow");
  const [activeTab, setActiveTab] = useState<ActiveTab>("");
  const [loading, setLoading] = useState(false);
  const [buttonUI, setButtonUI] = useState<{ variant: string; color: string }>({
    variant: "contained",
    color: "primary",
  });

  // Local state for tab data
  const [posts, setPosts] = useState<any[]>([]);
  const [followers, setFollowers] = useState<any[]>([]);
  const [following, setFollowing] = useState<any[]>([]);

  const userIsPrivate = useSelector((state: any) => state.auth.user?.isPrivate) ?? true;
  const user = useSelector((state: any) => state.auth.user);
  console.log("log--------------------------------------------------------------------------------------------------: ",user , user.isPrivate);
  // ===== Reset state whenever modal opens for a new user =====
  useEffect(() => {
    if (open) {
      setActiveTab("posts");
    }
  }, [open, userData]);

  // ===== Fetch initial follow state =====
  useEffect(() => {
    const fetchFollowState = async () => {
      try {
        const res = await fetch(
          `http://localhost:8080/user/followState?currentUserId=${currentUserId}&targetUserId=${userData._id}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch state");

        setFollowState(data.state);
      } catch (error: any) {
        dispatch(
          alertActions.showAlert({
            severity: "error",
            message: error.message || "Error fetching follow state",
          })
        );
      }
    };

    if (open && userData?._id) {
      fetchFollowState();
    }
  }, [open, userData, dispatch, currentUserId, userIsPrivate]);

  // ===== Automatically set tab to posts when following =====
  useEffect(() => {
    if (followState === "Following" || followState === "Follow Back" || !userIsPrivate) {
      setActiveTab("posts");
    } else {
      setActiveTab("");
    }
  }, [followState, userIsPrivate]);

  // ===== Fetch tab data dynamically =====
  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        const res = await fetch(
          `http://localhost:8080/user/getFollowers?userId=${userData._id}`,
          { credentials: "include" }
        );

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch followers");
        setFollowers(data.followersList.followers || []);
      } catch (error: any) {
        dispatch(
          alertActions.showAlert({
            severity: "error",
            message: error.message || "Error fetching followers",
          })
        );
      }
    };

    const fetchFollowing = async () => {
      try {
        const res = await fetch(
          `http://localhost:8080/user/getFollowing?userId=${userData._id}`,
          { credentials: "include" }
        );

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch following");
        setFollowing(data.followingList.following || []);
      } catch (error: any) {
        dispatch(
          alertActions.showAlert({
            severity: "error",
            message: error.message || "Error fetching following",
          })
        );
      }
    };

    const fetchPosts = async () => {
      try {

        const data = await PostService.getPostByUser(userData._id);

        setPosts(data.postList || []);
      } catch (error: any) {
        dispatch(
          alertActions.showAlert({
            severity: "error",
            message: error.message || "Error fetching posts",
          })
        );
      }
    };

    if (!userData?._id) return;
    console.log("log user private:",userIsPrivate);
    if (activeTab === "followers" && (followState === "Following" || !userIsPrivate)) fetchFollowers();
    if (activeTab === "following" && (followState === "Following" || !userIsPrivate)) fetchFollowing();
    if (activeTab === "posts" && (followState === "Following" || !userIsPrivate)) fetchPosts();
  }, [activeTab, userData, dispatch]);

  // ===== Dynamic button styling =====
  useEffect(() => {
    const getButtonStyles = () => {
      switch (followState) {
        case "Follow":
          return { variant: "contained", color: "primary" };
        case "Requested":
          return { variant: "outlined", color: "secondary" };
        case "Following":
          return { variant: "outlined", color: "primary" };
        case "Follow Back":
          return { variant: "contained", color: "secondary" };
        default:
          return { variant: "contained", color: "primary" };
      }
    };
    setButtonUI(getButtonStyles());
  }, [followState]);

  // ===== Handle follow/unfollow =====
  const handleFollowClick = async () => {
    setLoading(true);
    let successMessage = "";
    let errorMessage = "";
    try {
      let url = "";
      let method = "POST";
      if (followState === "Follow" || followState === "Follow Back") {
        url = "http://localhost:8080/user/follow";
        successMessage = "Follow Request sent";
        errorMessage = "Error while Follow User, action failed!";
      } else if (followState === "Following") {
        url = "http://localhost:8080/user/unfollow";
        successMessage = "Unfollowing User";
        errorMessage = "Error while Unfollow User, action failed!";
      } else if (followState === "Requested") {
        url = "http://localhost:8080/user/cancel";
        successMessage = "Cancel Follow Request";
        errorMessage = "Error in Cancelling follow request, action failed!";
      }

      const res = await fetch(url, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentUserId: currentUserId,
          targetUserId: userData._id,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Follow action failed");

      setFollowState(data.currentState);
      dispatch(
        alertActions.showAlert({
          severity: "info",
          message: successMessage,
        })
      );
    } catch (error: any) {
      dispatch(
        alertActions.showAlert({
          severity: "error",
          message: error.message || errorMessage,
        })
      );
    } finally {
      setLoading(false);
    }
  };

  // ======= UI =======
  return (
    <Modal
      open={open}
      onClose={() => { }}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          sx: {
            backgroundColor: "rgba(0,0,0,0.3)",
            backdropFilter: "blur(4px)",
          },
        },
      }}
      disableEscapeKeyDown
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Paper
        sx={{
          width: "90%",
          maxWidth: 800,
          maxHeight: "90%",
          p: 3,
          position: "relative",
          overflowY: "auto",
        }}
      >
        {/* Close button */}
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", top: 16, right: 16, zIndex: 10 }}
        >
          <CloseIcon />
        </IconButton>

        {/* Heading */}
        <Typography variant="h5" fontWeight={600} mb={2} mt={4}>
          {userData.name || userData.username}
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Profile Info */}
          <Box sx={{ display: "flex", alignItems: "center", mb: 2, gap: 2 }}>
            <Avatar
              src={
                userData?.profileUrl
                  ? `http://localhost:8080${userData.profileUrl}`
                  : undefined
              }
              sx={{ width: 110, height: 110 }}
            >
              {(userData.username?.[0] || "U").toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="subtitle1">@{userData.username}</Typography>
              <Typography variant="subtitle1" color="text.secondary">
                {userData.bio ?? "bio"}
              </Typography>
            </Box>
          </Box>

          {/* Custom Tab-like Stats */}
          <Box sx={{ display: "flex", mb: 2, mr: 2, gap: 4 }}>
            {[
              { label: "Posts", value: "posts", count: userData.postCount },
              {
                label: "Followers",
                value: "followers",
                count: userData.followersCount,
              },
              {
                label: "Following",
                value: "following",
                count: userData.followingCount,
              },
            ].map((tab) => (
              <Box
                key={tab.value}
                onClick={() => {
                  if (followState === "Following" || followState === "Follow Back" || !userIsPrivate) {
                    setActiveTab(tab.value as ActiveTab);
                  }
                }}
                sx={{
                  cursor:
                    followState === "Following" || followState === "Follow Back" || !userIsPrivate
                      ? "pointer"
                      : "",
                  transition: "0.2s",
                  padding: "4px 8px",
                  borderRadius: "8px",
                }}
              >
                <Typography
                  variant="h6"
                  align="center"
                  sx={{
                    color:
                      activeTab === tab.value ? "primary.main" : "text.primary",
                    fontWeight: activeTab === tab.value ? 600 : 400,
                  }}
                >
                  {tab.count}
                </Typography>
                <Typography
                  variant="body2"
                  align="center"
                  sx={{
                    color:
                      activeTab === tab.value
                        ? "primary.main"
                        : "text.secondary",
                    fontWeight: activeTab === tab.value ? 500 : 400,
                  }}
                >
                  {tab.label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Follow Button */}
        <Button
          fullWidth
          variant={buttonUI.variant as any}
          color={buttonUI.color as any}
          sx={{ mt: 3 }}
          disabled={loading}
          onClick={handleFollowClick}
        >
          {loading ? "Processing..." : followState}
        </Button>



        {/* Tab Content */}
        {(followState === "Following" || followState === "Follow Back" || !userIsPrivate) && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h4" color="text.secondary" m={1}>
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </Typography>

            <Divider sx={{ my: 2 }} />
            {/* POSTS TAB */}
            {activeTab === "posts" && (
              <Box
                sx={{
                  display: "flex",
                  overflowX: "auto",
                  gap: 2,
                  pb: 2,
                  scrollBehavior: "smooth",
                  "&::-webkit-scrollbar": {
                    display: "none",
                  },
                  scrollbarWidth: "none",
                }}
              >
                {posts.length > 0 ? (
                  posts.map((post) => {
                    const isVideo = post.media?.type === "video";
                    const hasMedia = Boolean(post.media?.url);
                    const mediaUrl = hasMedia
                      ? `http://localhost:8080${post.media.url}`
                      : null;

                    // Helper to truncate text
                    const truncateText = (text: string, maxWords: number) => {
                      const words = text.split(" ");
                      return words.length > maxWords
                        ? `${words.slice(0, maxWords).join(" ")}...`
                        : text;
                    };

                    return (
                      <Box
                        key={post._id}
                        sx={{
                          position: "relative",
                          minWidth: { xs: 220, sm: 250 },
                          height: { xs: 140, sm: 160 },
                          borderRadius: "10px",
                          overflow: "hidden",
                          flexShrink: 0,
                          cursor: "pointer",
                          backgroundColor: hasMedia ? "#000" : "#f5f5f5",
                          transition: "transform 0.3s ease, box-shadow 0.3s ease",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          "&:hover": {
                            transform: "scale(1.03)",
                            boxShadow: 4,
                          },
                        }}
                      >
                        {/* MEDIA DISPLAY */}
                        {hasMedia ? (
                          isVideo ? (
                            <Box
                              component="video"
                              {...({
                                src: mediaUrl,
                                controls: true,
                              } as React.VideoHTMLAttributes<HTMLVideoElement>)}
                              sx={{
                                width: "100%",
                                height: "100%",
                                objectFit: "contain", // ensures full video is visible
                                backgroundColor: "#ccc", // extra space visible for portrait
                              }}
                            />
                          ) : (
                            <Box
                              component="img"
                              {...({
                                src: mediaUrl,
                                alt: post.postContent || "Post",
                                loading: "lazy",
                              } as React.ImgHTMLAttributes<HTMLImageElement>)}
                              sx={{
                                width: "100%",
                                height: "100%",
                                objectFit: "contain", // full image visible, no cropping
                                backgroundColor: "#ccc", // fills extra space
                              }}
                            />
                          )
                        ) : (
                          /* TEXT-ONLY POST */
                          <Typography
                            sx={{
                              px: 2,
                              textAlign: "center",
                              fontSize: "0.9rem",
                              color: "text.primary",
                              fontWeight: 500,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              width: "100%",
                            }}
                          >
                            {truncateText(post.postContent || "No content", 5)}
                          </Typography>
                        )}

                        {/* CAPTION OVERLAY (if media exists and text present) */}
                        {hasMedia && post.postContent && (
                          <Box
                            sx={{
                              position: "absolute",
                              bottom: 0,
                              left: 0,
                              right: 0,
                              bgcolor: "rgba(0, 0, 0, 0.5)",
                              color: "white",
                              px: 1,
                              py: 0.5,
                              fontSize: "0.75rem",
                              textAlign: "center",
                              backdropFilter: "blur(2px)",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {truncateText(post.postContent, 8)}
                          </Box>
                        )}
                      </Box>
                    );
                  })
                ) : (
                  <Typography
                    sx={{
                      p: 2,
                      textAlign: "center",
                      color: "text.secondary",
                      width: "100%",
                    }}
                  >
                    No posts yet
                  </Typography>
                )}
              </Box>
            )}

            {/* FOLLOWERS TAB */}
            {activeTab === "followers" && (
              <List sx={{ maxHeight: 300, overflowY: "auto" }}>
                {followers.length > 0 ? (
                  followers.map((f) => (
                    <ListItem key={f._id}>
                      <ListItemAvatar>
                        <Avatar src={`localhost:8080/${f.profileUrl}`}>
                          {(f.username?.[0] || "U").toUpperCase()}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText primary={f.username} />
                    </ListItem>
                  ))
                ) : (
                  <Typography sx={{ p: 2 }}>No followers yet</Typography>
                )}
              </List>
            )}

            {/* FOLLOWING TAB */}
            {activeTab === "following" && (
              <List sx={{ maxHeight: 300, overflowY: "auto" }}>
                {following.length > 0 ? (
                  following.map((f) => (
                    <ListItem key={f._id}>
                      <ListItemAvatar>
                        <Avatar src={f.profileUrl}>
                          {(f.username?.[0] || "U").toUpperCase()}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText primary={f.username} />
                    </ListItem>
                  ))
                ) : (
                  <Typography sx={{ p: 2 }}>Not following anyone</Typography>
                )}
              </List>
            )}
          </Box>
        )}
      </Paper>
    </Modal>
  );
};

export default UserProfileModal;
