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
} from "@mui/material";
import { Image as ImageIcon } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { alertActions } from "../store/alert-slice";
import Loader from "../ui/Loader"; // Import your custom loader

const AddPostForm = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.auth.user);

  const [postContent, setPostContent] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); // NEW loading state

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

    if (!user?._id) {
      dispatch(
        alertActions.showAlert({
          severity: "error",
          message: "User not logged in!",
        })
      );
      return;
    }

    if (!postContent.trim() && !selectedFile) {
      dispatch(
        alertActions.showAlert({
          severity: "error",
          message: "Post must have text or media!",
        })
      );
      return;
    }

    try {
      setLoading(true); // Start loader

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
    } finally {
      setLoading(false); // Stop loader
    }
  };

  return (
    <div style={{ width: "800px" }}>
      {/* Show loader while uploading */}
      {loading && (
        <Box 
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(255, 255, 255, 0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10,
          }}
        >
          <Loader />
        </Box>
      )}

      {/* Add Post Form */}
      <Paper sx={{ padding: 2, position: "relative" }} component="form" onSubmit={handlePostSubmit}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Avatar src={`http://localhost:8080${user.profileUrl}`} sx={{ mr: 2 }} />
          <TextField
            variant="outlined"
            placeholder="What's on your mind?"
            fullWidth
            multiline
            size="small"
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            disabled={loading}
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
          <Button startIcon={<ImageIcon />} component="label" disabled={loading}>
            Add Media
            <input
              type="file"
              hidden
              accept="image/jpeg,image/png,image/webp,video/mp4,video/webm"
              onChange={handleFileChange}
            />
          </Button>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={loading || (!postContent.trim() && !selectedFile)} // disabled when no input or loading
          >
            {loading ? "Posting..." : "Post"}
          </Button>
        </Box>
      </Paper>
    </div>
  );
};

export default AddPostForm;
