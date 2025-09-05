// import React, { useState } from "react";
// import {
//   Box,
//   Paper,
//   Avatar,
//   Typography,
//   Button,
//   IconButton,
//   TextField,
//   Divider,
//   List, 
//   ListItem, 
//   ListItemAvatar, 
//   ListItemText,
//   ListItemButton, 
//   ListItemIcon
// } from "@mui/material";
// import {
//   Home as HomeIcon,
//   Person,
//   Message,
//   Image as ImageIcon,
//   FavoriteBorder,
//   Favorite,
//   ChatBubbleOutline,
// } from "@mui/icons-material";

// interface Post {
//   id: number;
//   user: {
//     name: string;
//     bio: string;
//     avatar: string;
//   };
//   date: string;
//   content: string;
//   media?: string;
//   liked: boolean;
// }

// const Home = () => {
//   const [posts, setPosts] = useState<Post[]>([
//     {
//       id: 1,
//       user: {
//         name: "John Doe",
//         bio: "Tech enthusiast",
//         avatar: "https://i.pravatar.cc/150?img=3",
//       },
//       date: "Sep 5, 2025",
//       content: "This is my first post!",
//       media: "https://via.placeholder.com/600x300",
//       liked: false,
//     },
//     {
//       id: 2,
//       user: {
//         name: "Jane Smith",
//         bio: "Lover of nature",
//         avatar: "https://i.pravatar.cc/150?img=5",
//       },
//       date: "Sep 4, 2025",
//       content: "What a beautiful day 🌞",
//       media: "",
//       liked: true,
//     },
//   ]);

//   const toggleLike = (postId: number) => {
//     setPosts((prevPosts) =>
//       prevPosts.map((post) =>
//         post.id === postId ? { ...post, liked: !post.liked } : post
//       )
//     );
//   };

//   return (
//     <Box
//       sx={{
//         display: "grid",
//         gridTemplateColumns: "1fr 3fr 1fr",
//         gap: 2,
//         padding: 2,
//       }}
//     >
//       {/* LEFT SIDEBAR */}
//       <Box>
//         <Paper sx={{ padding: 2, mb: 2 }}>
//           <Box sx={{ textAlign: "center" }}>
//             <Box sx={{ position: "relative", display: "inline-block" }}>
//               <Avatar
//                 src="https://i.pravatar.cc/150?img=1"
//                 alt="User Avatar"
//                 sx={{ width: 80, height: 80, margin: "auto" }}
//               />
//               <Box
//                 sx={{
//                   width: 14,
//                   height: 14,
//                   borderRadius: "50%",
//                   backgroundColor: "green",
//                   position: "absolute",
//                   bottom: 4,
//                   right: 4,
//                   border: "2px solid white",
//                 }}
//               />
//             </Box>
//             <Typography variant="h6" sx={{ mt: 1 }}>
//               Alex Johnson
//             </Typography>
//             <Typography variant="body2" color="text.secondary">
//               Building the future 🚀
//             </Typography>
//           </Box>
//         </Paper>

//         {/* Navigation */}
//         <Paper sx={{ p: 2 }}>
//         <List>
//           <ListItem disablePadding>
//             <ListItemButton /* component={Link} to="/" */>
//               <ListItemIcon><HomeIcon /></ListItemIcon>
//               <ListItemText primary="Home" />
//             </ListItemButton>
//           </ListItem>

//           <ListItem disablePadding>
//             <ListItemButton /* component={Link} to="/profile" */>
//               <ListItemIcon><Person /></ListItemIcon>
//               <ListItemText primary="Profile" />
//             </ListItemButton>
//           </ListItem>

//           <ListItem disablePadding>
//             <ListItemButton /* component={Link} to="/messages" */>
//               <ListItemIcon><Message /></ListItemIcon>
//               <ListItemText primary="Messages" />
//             </ListItemButton>
//           </ListItem>
//         </List>
//       </Paper>
//       </Box>

//       {/* CENTER AREA */}
//       <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
//         {/* Add Post */}
//         <Paper sx={{ padding: 2 }}>
//           <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
//             <Avatar src="https://i.pravatar.cc/150?img=1" sx={{ mr: 2 }} />
//             <TextField
//               variant="outlined"
//               placeholder="What's on your mind?"
//               fullWidth
//               size="small"
//             />
//           </Box>
//           <Divider sx={{ mb: 2 }} />
//           <Box sx={{ display: "flex", justifyContent: "space-between" }}>
//             <Button startIcon={<ImageIcon />}>Add Media</Button>
//             <Button variant="contained" color="primary">
//               Post
//             </Button>
//           </Box>
//         </Paper>

//         {/* Posts */}
//         <Box sx={{ overflowY: "auto", flex: 1, pr: 1 }}>
//           {posts.map((post) => (
//             <Paper key={post.id} sx={{ mb: 2, p: 2 }}>
//               <Box
//                 sx={{
//                   display: "flex",
//                   justifyContent: "space-between",
//                   mb: 1,
//                 }}
//               >
//                 <Typography variant="caption" color="text.secondary">
//                   {post.date}
//                 </Typography>
//                 <Box sx={{ display: "flex", alignItems: "center" }}>
//                   <Avatar src={post.user.avatar} sx={{ mr: 1 }} />
//                   <Box>
//                     <Typography variant="body1" fontWeight={600}>
//                       {post.user.name}
//                     </Typography>
//                     <Typography variant="caption" color="text.secondary">
//                       {post.user.bio}
//                     </Typography>
//                   </Box>
//                 </Box>
//               </Box>

//               {/* Post Content */}
//               <Typography variant="body1" sx={{ mb: 1 }}>
//                 {post.content}
//               </Typography>
//               {post.media && (
//                 <Box
//                   component="img"
//                   src={post.media}
//                   alt="Post Media"
//                   sx={{
//                     width: "100%",
//                     height: "auto",
//                     borderRadius: 2,
//                     mb: 1,
//                   }}
//                 />
//               )}

//               {/* Like & Comment Buttons */}
//               <Box
//                 sx={{
//                   display: "flex",
//                   justifyContent: "space-between",
//                   alignItems: "center",
//                   mb: 1,
//                 }}
//               >
//                 <IconButton>
//                   <ChatBubbleOutline />
//                 </IconButton>
//                 <IconButton onClick={() => toggleLike(post.id)}>
//                   {post.liked ? (
//                     <Favorite color="error" />
//                   ) : (
//                     <FavoriteBorder />
//                   )}
//                 </IconButton>
//               </Box>

//               {/* Comment Input */}
//               <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                 <Avatar src="https://i.pravatar.cc/150?img=1" />
//                 <TextField
//                   placeholder="Write a comment..."
//                   size="small"
//                   fullWidth
//                 />
//                 <Button variant="contained" color="primary">
//                   Post
//                 </Button>
//               </Box>
//             </Paper>
//           ))}
//         </Box>
//       </Box>

//       {/* RIGHT SIDEBAR */}
//       <Box>
//         <Paper sx={{ p: 2 }}>
//           <Typography variant="h6" sx={{ mb: 2 }}>
//             Suggested Friends
//           </Typography>
//           <List>
//             {["Emily", "Michael", "Sophia"].map((friend, index) => (
//               <ListItem
//                 key={index}
//                 secondaryAction={<Button variant="outlined">Follow</Button>}
//               >
//                 <ListItemAvatar>
//                   <Avatar src={`https://i.pravatar.cc/150?img=${index + 10}`} />
//                 </ListItemAvatar>
//                 <ListItemText
//                   primary={friend}
//                   secondary="New to platform"
//                 />
//               </ListItem>
//             ))}
//           </List>
//         </Paper>
//       </Box>
//     </Box>
//   );
// };

// export default Home;

/////////////////////////////////


import React, { useState, FormEvent } from "react";
import {
  Box,
  Paper,
  Avatar,
  Typography,
  Button,
  IconButton,
  TextField,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemButton,
  ListItemIcon,
} from "@mui/material";
import {
  Home as HomeIcon,
  Person,
  Message,
  Image as ImageIcon,
  FavoriteBorder,
  Favorite,
  ChatBubbleOutline,
} from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { alertActions } from "../store/alert-slice"; // your existing alert slice

interface Post {
  id: number;
  user: {
    name: string;
    bio: string;
    avatar: string;
  };
  date: string;
  content: string;
  media?: string;
  liked: boolean;
}

const Home = () => {
  const dispatch = useDispatch();

  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      user: {
        name: "John Doe",
        bio: "Tech enthusiast",
        avatar: "https://i.pravatar.cc/150?img=3",
      },
      date: "Sep 5, 2025",
      content: "This is my first post!",
      media: "https://via.placeholder.com/600x300",
      liked: false,
    },
  ]);

  const [postContent, setPostContent] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  /** Handle file selection */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "video/mp4", "video/webm"];
    if (!allowedTypes.includes(file.type)) {
      dispatch(
        alertActions.showAlert({
          severity: "error",
          message: "Only image (JPG, PNG, WEBP) or video (MP4, WEBM) files are allowed!",
        })
      );
      return;
    }

    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  /** Submit new post */
  const handlePostSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user?._id) {
      dispatch(
        alertActions.showAlert({
          severity: "error",
          message: "User not logged in!",
        })
      );
      return;
    }

    if (!postContent.trim()) {
      dispatch(
        alertActions.showAlert({
          severity: "error",
          message: "Post content cannot be empty!",
        })
      );
      return;
    }

    try {
      const formData = new FormData();
      formData.append("userId", user._id);
      formData.append("postContent", postContent);
      if (selectedFile) {
        formData.append("media", selectedFile);
      }

      const response = await fetch("http://localhost:8080/posts/addPost", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        let errorMessage = "Something went wrong while posting";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          errorMessage = "Server returned an unexpected error";
        }

        dispatch(
          alertActions.showAlert({
            severity: "error",
            message: errorMessage,
          })
        );
        return;
      }

      const data = await response.json();

      // Update UI instantly
      setPosts((prev) => [
        {
          id: Date.now(),
          user: {
            name: user.name,
            bio: user.bio || "",
            avatar: `http://localhost:8080${user.profileUrl}`,
          },
          date: new Date().toLocaleDateString(),
          content: postContent,
          media: preview || "",
          liked: false,
        },
        ...prev,
      ]);

      // Reset form
      setPostContent("");
      setSelectedFile(null);
      setPreview(null);

      dispatch(
        alertActions.showAlert({
          severity: "success",
          message: "Post added successfully!",
        })
      );
    } catch (error) {
      dispatch(
        alertActions.showAlert({
          severity: "error",
          message: "Network error: " + error,
        })
      );
    }
  };

  const toggleLike = (postId: number) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId ? { ...post, liked: !post.liked } : post
      )
    );
  };

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "1fr 3fr 1fr",
        gap: 2,
        padding: 2,
      }}
    >
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
        </Paper>

        {/* Navigation */}
        <Paper sx={{ p: 2 }}>
          <List>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon><HomeIcon /></ListItemIcon>
                <ListItemText primary="Home" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon><Person /></ListItemIcon>
                <ListItemText primary="Profile" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon><Message /></ListItemIcon>
                <ListItemText primary="Messages" />
              </ListItemButton>
            </ListItem>
          </List>
        </Paper>
      </Box>

      {/* CENTER AREA */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {/* Add Post */}
        <Paper sx={{ padding: 2 }} component="form" onSubmit={handlePostSubmit}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Avatar src="https://i.pravatar.cc/150?img=1" sx={{ mr: 2 }} />
            <TextField
              variant="outlined"
              placeholder="What's on your mind?"
              fullWidth
              size="small"
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
            />
          </Box>

          {/* Preview of selected media */}
          {preview && (
            <Box sx={{ mb: 2 }}>
              {selectedFile?.type.startsWith("video") ? (
                <video
                  src={preview}
                  controls
                  style={{ width: "100%", borderRadius: 8 }}
                />
              ) : (
                <img
                  src={preview}
                  alt="Preview"
                  style={{ width: "100%", borderRadius: 8 }}
                />
              )}
            </Box>
          )}

          <Divider sx={{ mb: 2 }} />
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Button
              startIcon={<ImageIcon />}
              component="label"
            >
              Add Media
              <input
                type="file"
                hidden
                accept="image/jpeg,image/png,image/webp,video/mp4,video/webm"
                onChange={handleFileChange}
              />
            </Button>
            <Button variant="contained" color="primary" type="submit">
              Post
            </Button>
          </Box>
        </Paper>

        {/* Posts List */}
        <Box sx={{ overflowY: "auto", flex: 1, pr: 1 }}>
          {posts.map((post) => (
            <Paper key={post.id} sx={{ mb: 2, p: 2 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  {post.date}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Avatar src={post.user.avatar} sx={{ mr: 1 }} />
                  <Box>
                    <Typography variant="body1" fontWeight={600}>
                      {post.user.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {post.user.bio}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Post Content */}
              <Typography variant="body1" sx={{ mb: 1 }}>
                {post.content}
              </Typography>
              {post.media && (
                <Box
                  component="img"
                  src={post.media}
                  alt="Post Media"
                  sx={{
                    width: "100%",
                    height: "auto",
                    borderRadius: 2,
                    mb: 1,
                  }}
                />
              )}

              {/* Like & Comment Buttons */}
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                <IconButton>
                  <ChatBubbleOutline />
                </IconButton>
                <IconButton onClick={() => toggleLike(post.id)}>
                  {post.liked ? (
                    <Favorite color="error" />
                  ) : (
                    <FavoriteBorder />
                  )}
                </IconButton>
              </Box>

              {/* Comment Input */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Avatar src="https://i.pravatar.cc/150?img=1" />
                <TextField placeholder="Write a comment..." size="small" fullWidth />
                <Button variant="contained" color="primary">
                  Post
                </Button>
              </Box>
            </Paper>
          ))}
        </Box>
      </Box>

      {/* RIGHT SIDEBAR */}
      <Box>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Suggested Friends
          </Typography>
          <List>
            {["Emily", "Michael", "Sophia"].map((friend, index) => (
              <ListItem
                key={index}
                secondaryAction={<Button variant="outlined">Follow</Button>}
              >
                <ListItemAvatar>
                  <Avatar src={`https://i.pravatar.cc/150?img=${index + 10}`} />
                </ListItemAvatar>
                <ListItemText
                  primary={friend}
                  secondary="New to platform"
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Box>
    </Box>
  );
};

export default Home;
