// import React, { useState } from "react";
// import {
//   Box,
//   Paper,
//   Typography,
//   Avatar,
//   Button,
//   Divider,
//   Tabs,
//   Tab,
//   List,
//   ListItem,
//   ListItemAvatar,
//   ListItemText,
//   IconButton,
//   Modal,
//   Backdrop,
// } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";

// interface UserProfileModalProps {
//   open: boolean;
//   onClose: () => void;
//   userData: any; // clicked user object
//   currentUserId: string;
// }

// type FollowState = "Follow" | "Requested" | "Following";

// const UserProfileModal: React.FC<UserProfileModalProps> = ({
//   open,
//   onClose,
//   userData,
//   currentUserId,
// }) => {
//   const [tabIndex, setTabIndex] = useState(0);
//   const [followState, setFollowState] = useState<FollowState>(
//     userData.isFollowing ? "Following" : "Follow"
//   );

//   const handleFollowClick = () => {
//     if (followState === "Follow") setFollowState("Requested");
//     else if (followState === "Requested") setFollowState("Following");
//     else setFollowState("Follow");
//   };

//   const isFollowing = followState === "Following";

//   return (
//     <Modal
//       open={open}
//       onClose={() => { }}
//       closeAfterTransition
//       slots={{ backdrop: Backdrop }}
//       slotProps={{
//         backdrop: {
//           sx: {
//             backgroundColor: "rgba(0,0,0,0.3)",
//             backdropFilter: "blur(4px)",
//           },
//         },
//       }}
//       disableEscapeKeyDown
//       sx={{
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//       }}
//     >
//       <Paper
//         sx={{
//           width: "90%",
//           maxWidth: 800,
//           maxHeight: "90%",
//           p: 3,
//           position: "relative",
//           overflowY: "auto",
//         }}
//       >
//         {/* Close button */}
//         <IconButton
//           onClick={onClose}
//           sx={{ position: "absolute", top: 16, right: 16, zIndex: 10 }}
//         >
//           <CloseIcon />
//         </IconButton>


//         {/* Heading */}
//         <Typography variant="h5" fontWeight={600} mb={2} mt={4}>
//           {userData.name || userData.username}
//         </Typography>

//         <Box
//           sx={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//           }}
//         >
//           {/* Profile Info */}
//           <Box sx={{ display: "flex", alignItems: "center", mb: 2, gap: 2 }}>
//             <Avatar
//               src={userData.profileUrl}
//               sx={{ width: 110, height: 110 }}
//             >
//               {(userData.username?.[0] || "U").toUpperCase()}
//             </Avatar>
//             <Box>
//               <Typography variant="subtitle1">@{userData.username}</Typography>
//               <Typography variant="subtitle1" color="text.secondary">
//                 {userData.bio ?? "bio"}
//               </Typography>
//               {userData.followedBy?.length ? (
//                 <Typography variant="subtitle1">
//                   Followed by{" "}
//                   {userData.followedBy.slice(0, 3).map((f: any) => f.username).join(", ")}
//                 </Typography>
//               ) :
//                 (
//                   <Typography variant="subtitle1" mt={2}>
//                     Followed by{" "}
//                     {"ABC, DEF, GHI"}
//                   </Typography>
//                 )
//               }
//             </Box>
//           </Box>

//           {/* Right - Stats */}
//           <Box sx={{ display: "flex", mb: 2, mr: 2, gap: 4 }}>
//             <Box>
//               <Typography variant="h6" align="center">
//                 1
//               </Typography>
//               <Typography variant="body2" color="text.secondary" align="center">
//                 Posts
//               </Typography>
//             </Box>
//             <Box>
//               <Typography variant="h6" align="center">
//                 1
//               </Typography>
//               <Typography variant="body2" color="text.secondary" align="center">
//                 Followers
//               </Typography>
//             </Box>
//             <Box>
//               <Typography variant="h6" align="center">
//                 1
//               </Typography>
//               <Typography variant="body2" color="text.secondary" align="center">
//                 Following
//               </Typography>
//             </Box>
//           </Box>
//         </Box>
//         {/* Follow Button Full Width */}
//         <Button
//           variant={followState === "Follow" ? "contained" : "outlined"}
//           fullWidth
//           sx={{ mt: 3 }}
//           onClick={handleFollowClick}
//         >
//           {followState}
//         </Button>

//         <Divider sx={{ my: 2 }} />

//         {/* Tabs */}
//         <Tabs
//           value={tabIndex}
//           onChange={(e, val) => setTabIndex(val)}
//           textColor="primary"
//           indicatorColor="primary"
//           sx={{ mb: 2 }}
//         >
//           <Tab label={`Posts (${userData.posts?.length || 0})`} />
//           <Tab label={`Followers (${userData.followers?.length || 0})`} />
//           <Tab label={`Following (${userData.following?.length || 0})`} />
//         </Tabs>

//         <Divider sx={{ mb: 2 }} />

//         {/* Tab Content */}
//         <Box>
//           {!isFollowing && tabIndex !== 0 ? (
//             <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
//               Follow this user to see content.
//             </Typography>
//           ) : (
//             <>
//               {tabIndex === 0 && (
//                 <Box
//                   sx={{
//                     display: "flex",
//                     overflowX: "auto",
//                     gap: 2,
//                     "&::-webkit-scrollbar": { display: "none" },
//                     scrollBehavior: "smooth",
//                     pb: 2,
//                   }}
//                 >
//                   {userData.posts?.map((post: any) => (
//                     <Box
//                       key={post._id}
//                       component="img"
//                       src={post.mediaUrl}
//                       alt="post"
//                       sx={{
//                         width: 150,
//                         height: 150,
//                         objectFit: "cover",
//                         borderRadius: 2,
//                       }}
//                     />
//                   ))}
//                 </Box>
//               )}
//               {tabIndex === 1 && (
//                 <List sx={{ maxHeight: 300, overflowY: "auto" }}>
//                   {userData.followers?.map((f: any) => (
//                     <ListItem key={f._id}>
//                       <ListItemAvatar>
//                         <Avatar src={f.profileUrl}>
//                           {(f.username?.[0] || "U").toUpperCase()}
//                         </Avatar>
//                       </ListItemAvatar>
//                       <ListItemText primary={f.username} />
//                     </ListItem>
//                   ))}
//                 </List>
//               )}
//               {tabIndex === 2 && (
//                 <List sx={{ maxHeight: 300, overflowY: "auto" }}>
//                   {userData.following?.map((f: any) => (
//                     <ListItem key={f._id}>
//                       <ListItemAvatar>
//                         <Avatar src={f.profileUrl}>
//                           {(f.username?.[0] || "U").toUpperCase()}
//                         </Avatar>
//                       </ListItemAvatar>
//                       <ListItemText primary={f.username} />
//                     </ListItem>
//                   ))}
//                 </List>
//               )}
//             </>
//           )}
//         </Box>


//       </Paper>
//     </Modal>
//   );
// };

// export default UserProfileModal;


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




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
import { useDispatch } from "react-redux";
import { alertActions } from "../store/alert-slice";

interface UserProfileModalProps {
  open: boolean;
  onClose: () => void;
  userData: any; // clicked user object
  currentUserId: string;
}

type FollowState = "Follow" | "Requested" | "Following" | "Follow Back";
type ActiveTab = "posts" | "followers" | "following";

const UserProfileModal: React.FC<UserProfileModalProps> = ({
  open,
  onClose,
  userData,
  currentUserId,
}) => {
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState<ActiveTab>("posts");
  const [followState, setFollowState] = useState<FollowState>("Follow");
  const [loading, setLoading] = useState(false);

  // Local state for tab data
  const [posts, setPosts] = useState<any[]>([]);
  const [followers, setFollowers] = useState<any[]>([]);
  const [following, setFollowing] = useState<any[]>([]);

  // ===== Fetch initial follow state =====
  useEffect(() => {
    if (open && userData?._id) {
      fetchFollowState();
      fetchPosts();
    }
  }, [open, userData]);

  const fetchFollowState = async () => {
    try {
      const res = await fetch(
        `http://localhost:8080/user/state?currentUserId=${currentUserId}&targetUserId=${userData._id}`,
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

  const fetchPosts = async () => {
    try {
      const res = await fetch(
        `http://localhost:8080/posts/getPosts?userId=${userData._id}`,
        { credentials: "include" }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch posts");

      setPosts(data.posts || []);
    } catch (error: any) {
      dispatch(
        alertActions.showAlert({
          severity: "error",
          message: error.message || "Error fetching posts",
        })
      );
    }
  };

  const fetchFollowers = async () => {
    try {
      const res = await fetch(
        `http://localhost:8080/user/list?userId=${userData._id}`,
        { credentials: "include" }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch followers");

      setFollowers(data.followers || []);
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
        `http://localhost:8080/user/list?userId=${userData._id}`,
        { credentials: "include" }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch following");

      setFollowing(data.following || []);
    } catch (error: any) {
      dispatch(
        alertActions.showAlert({
          severity: "error",
          message: error.message || "Error fetching following",
        })
      );
    }
  };

  // Load tab data dynamically when switching
  useEffect(() => {
    if (activeTab === "followers") fetchFollowers();
    if (activeTab === "following") fetchFollowing();
  }, [activeTab]);

  // ===== Handle follow/unfollow =====
  const handleFollowClick = async () => {
    setLoading(true);
    try {
      let url = "";
      let method = "POST";

      if (followState === "Follow" || followState === "Follow Back") {
        url = "http://localhost:8080/user/follow";
      } else if (followState === "Following") {
        url = "http://localhost:8080/user/unfollow";
      }
      else if(followState === "Requested"){
        url = "http://localhost:8080/user/reject";
      }

      const res = await fetch(url, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentUserId, targetUserId: userData._id }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Follow action failed");

      setFollowState(data.currentState);
      dispatch(
        alertActions.showAlert({
          severity: "success",
          message: data.message || "Action successful",
        })
      );
    } catch (error: any) {
      dispatch(
        alertActions.showAlert({
          severity: "error",
          message: error.message || "Error performing follow action",
        })
      );
    } finally {
      setLoading(false);
    }
  };

  // ===== Dynamic button styling =====
  const getButtonStyles = () => {
    switch (followState) {
      case "Follow":
        return { variant: "contained", color: "primary" };
      case "Requested":
        return { variant: "outlined", color: "secondary" };
      case "Following":
        return { variant: "outlined", color: "error" };
      case "Follow Back":
        return { variant: "contained", color: "success" };
      default:
        return { variant: "contained", color: "primary" };
    }
  };

  console.log(userData);
  

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
              src={userData.profileUrl}
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
              { label: "Followers", value: "followers", count: userData.followersCount },
              { label: "Following", value: "following", count: userData.followingCount },
            ].map((tab) => (
              <Box
                key={tab.value}
                onClick={() => setActiveTab(tab.value as ActiveTab)}
                sx={{
                  cursor: "pointer",
                  transition: "0.2s",
                  padding: "4px 8px",
                  borderRadius: "8px",
                  backgroundColor:
                    activeTab === tab.value ? "rgba(0,0,0,0.05)" : "transparent",
                  "&:hover": { backgroundColor: "rgba(0,0,0,0.08)" },
                }}
              >
                <Typography
                  variant="h6"
                  align="center"
                  sx={{
                    color: activeTab === tab.value ? "primary.main" : "text.primary",
                    fontWeight: activeTab === tab.value ? 600 : 400,
                  }}
                >
                  {tab.count}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  align="center"
                  sx={{
                    color: activeTab === tab.value ? "primary.main" : "text.secondary",
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
          sx={{
            mt: 3,
            backgroundColor: "#3f51b5", // custom color
            color: "#fff",
            "&:hover": {
              backgroundColor: "#303f9f", // darker shade on hover
            },
          }}
          disabled={loading}
          onClick={handleFollowClick}
        >
          {loading ? "Processing..." : followState}
        </Button>


        <Divider sx={{ my: 2 }} />

        {/* Tab Content */}
        <Box>
          {activeTab === "posts" && (
            <Box
              sx={{
                display: "flex",
                overflowX: "auto",
                gap: 2,
                "&::-webkit-scrollbar": { display: "none" },
                scrollBehavior: "smooth",
                pb: 2,
              }}
            >
              {posts.length > 0 ? (
                posts.map((post) => (
                  <Box
                    key={post._id}
                    component="img"
                    src={post.mediaUrl}
                    alt="post"
                    sx={{
                      width: 150,
                      height: 150,
                      objectFit: "cover",
                      borderRadius: 2,
                    }}
                  />
                ))
              ) : (
                <Typography sx={{ p: 2 }}>No posts yet</Typography>
              )}
            </Box>
          )}

          {activeTab === "followers" && (
            <List sx={{ maxHeight: 300, overflowY: "auto" }}>
              {followers.length > 0 ? (
                followers.map((f) => (
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
                <Typography sx={{ p: 2 }}>No followers yet</Typography>
              )}
            </List>
          )}

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
      </Paper>
    </Modal>
  );
};

export default UserProfileModal;
