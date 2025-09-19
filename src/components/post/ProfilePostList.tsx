import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Avatar,
  Typography,
  IconButton,
  CircularProgress,
} from "@mui/material";
import {
  DeleteOutline as DeleteOutlineIcon,
} from "@mui/icons-material";
import { useSelector } from "react-redux";
import { IPost, PostService } from "../../api/services/post.service";

const ProfilePostList: React.FC = () => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const user = useSelector((state: any) => state.auth.user);
  const userId = user._id;

  /**
   * Fetch posts from backend
   */
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await PostService.getMyPost();

      setPosts(data.postList || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load posts. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Delete a post
   */
  const handleDeletePost = async (postId: string) => {
    try {
      const response = await fetch(
        `http://localhost:8080/posts/delete?postId=${postId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete the post");
      }

      // Update state locally without re-fetching
      setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));

      
    } catch (err) {
      console.error(err);
      alert("Failed to delete post. Please try again.");
    }
  };

  /**
   * Fetch posts on mount
   */
  useEffect(() => {
    fetchPosts();
  }, [userId]);

  /**
   * UI Rendering
   */
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" sx={{ textAlign: "center", mt: 4 }}>
        {error}
      </Typography>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        height: "600px",
      }}
    >
      {/* Scrollable container with hidden scrollbar */}
      <Box
        sx={{
          overflowY: "auto",
          flex: 1,
          pr: 1,
          padding: 1,
          "&::-webkit-scrollbar": {
            display: "none",
          },
          scrollbarWidth: "none", // Firefox
          msOverflowStyle: "none", // IE and Edge
        }}
      >
        {posts.length === 0 ? (
          <Typography sx={{ textAlign: "center", mt: 2 }}>
            No posts found.
          </Typography>
        ) : (
          posts.map((post) => (
            <Paper key={post._id} sx={{ mb: 2, p: 2 }}>
              {/* Header */}
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Avatar src={`http://localhost:8080${user.profileUrl}`}
                   sx={{ mr: 1 }}>
                    {post.userId.username.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box>
                    <Typography variant="body1" fontWeight={600}>
                      {post.userId.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Box>

                {/* Delete Button */}
                <IconButton onClick={() => handleDeletePost(post._id)}>
                  <DeleteOutlineIcon />
                </IconButton>
              </Box>
            <hr />
              {/* Post Content */}
              <Typography variant="body1" sx={{ mb: 1, whiteSpace: "pre-line" }}>
                {post.postContent}
              </Typography>

              {/* Post Media */}
              {post.media?.url && (
                <Box
                  component={post.media.type === "video" ? "video" : "img"}
                  src={`http://localhost:8080${post.media.url}`}
                  controls={post.media.type === "video"}
                  alt={post.media.type === "image" ? "Post Media" : undefined}
                  sx={{
                    width: "100%",
                    maxHeight: 350, // uniform height
                    objectFit: "cover",
                    borderRadius: 2,
                    mb: 1,
                  }}
                />
              )}
            </Paper>
          ))
        )}
      </Box>
    </Box>
  );
};

export default ProfilePostList;
