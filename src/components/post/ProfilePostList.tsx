import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Avatar,
  Typography,
  IconButton,
} from "@mui/material";
import {
  DeleteOutline as DeleteOutlineIcon,
} from "@mui/icons-material";
import { useSelector } from "react-redux";
import { IPost, PostService } from "../../api/services/post.service";
import { BASE_URL } from "../../api/endpoints";
import SkeletonPost from "../ui/SkeletonPost";
import ConfirmDialog from "../ui/ConfirmDialog";

const ProfilePostList: React.FC = () => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const user = useSelector((state: any) => state.auth.user);
  const userId = user._id;

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [targetPostId, setTargetPostId] = useState<string | null>(null);

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
      <SkeletonPost count={2} withMedia={true} />
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
        height: "65vh",
        // maxWidth:"800px"
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
                  <Avatar src={`${BASE_URL}${user.profileUrl}`}
                    sx={{ mr: 1 }}>
                    {post.userId.username.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box>
                    <Typography variant="body1" fontWeight={600}>
                      {post.userId.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(post.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </Typography>
                  </Box>
                </Box>

                {/* Delete Button */}
                <IconButton
                  onClick={() => {
                    setTargetPostId(post._id);
                    setConfirmOpen(true);
                  }}
                >
                  <DeleteOutlineIcon />
                </IconButton>
              </Box>
              <hr />
              {/* Post Content */}
              <Typography variant="body1" sx={{ mb: 1, whiteSpace: "pre-line", wordBreak: "break-word" }}>
                {post.postContent}
              </Typography>

              {/* Post Media */}
              {post.media?.url && (
                <Box
                  sx={{
                    width: "100%",
                    maxHeight: 400, // sets a max display height
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#f9f9f9", // light background behind image/video
                    borderRadius: "10px",
                    overflow: "hidden",
                    mb: 1,
                    p: 1, // padding around the content
                  }}
                >
                  {post.media.type === "image" ? (
                    <Box
                      component="img"
                      src={`${BASE_URL}${post.media.url}`}
                      alt="Post Media"
                      loading="lazy"
                      sx={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                        objectFit: "contain", // ensures entire image is visible
                        borderRadius: "10px",
                      }}
                    />
                  ) : (
                    <Box
                      component="video"
                      src={`${BASE_URL}${post.media.url}`}
                      controls
                      sx={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                        objectFit: "contain", // same handling as image
                        borderRadius: "10px",
                      }}
                    />
                  )}
                </Box>
              )}
            </Paper>
          ))
        )}
      </Box>
      <ConfirmDialog
        open={confirmOpen}
        title="Delete Post?"
        description="Do you really want to delete this post? This cannot be undone."
        onConfirm={async () => {
          if (targetPostId) await handleDeletePost(targetPostId);
          setConfirmOpen(false);
        }}
        onCancel={() => setConfirmOpen(false)}
        confirmText="Delete"
        color="error"
      />
    </Box>
  );
};

export default ProfilePostList;
