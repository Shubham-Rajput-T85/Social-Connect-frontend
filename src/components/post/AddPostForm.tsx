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
import { Image as ImageIcon, Close as CloseIcon } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { alertActions } from "../store/alert-slice";
import Loader from "../ui/Loader"; // Import your custom loader

const AddPostForm = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.auth.user);

  const [postContent, setPostContent] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  /** Handle file selection */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
  
    if (!file) return;
  
    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "video/mp4",
      "video/webm",
    ];
    if (!allowedTypes.includes(file.type)) {
      dispatch(
        alertActions.showAlert({
          severity: "error",
          message:
            "Only image (JPG, PNG, WEBP) or video (MP4, WEBM) files are allowed!",
        })
      );
      // Reset input value to allow same file to be selected again
      e.target.value = "";
      return;
    }
  
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  
    // **IMPORTANT: Reset the input value**
    // This ensures selecting the same file again triggers onChange
    e.target.value = "";
  };

  /** Clear the selected file and preview */
  const handleClearPreview = () => {
    setSelectedFile(null);
    setPreview(null);
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
      <Paper
        sx={{ padding: 2, position: "relative" }}
        component="form"
        onSubmit={handlePostSubmit}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Avatar
            src={`http://localhost:8080${user.profileUrl}`}
            sx={{ mr: 2 }}
          />
          <TextField
            variant="outlined"
            placeholder="What's on your mind?"
            fullWidth
            multiline
            maxRows={5}
            size="small"
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            disabled={loading}
          />
        </Box>

        {/* Preview of selected media */}
        {preview && (
          <Box
            sx={{
              position: "relative",
              mb: 2,
              width: "100%",
              maxHeight: "400px",
              overflow: "hidden",
              borderRadius: "10px",
              border: "1px solid #ccc",
              backgroundColor: "#f9f9f9",
            }}
          >
            {/* Close button */}
            <IconButton
              onClick={handleClearPreview}
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                backgroundColor: "rgba(0,0,0,0.6)",
                color: "#fff",
                "&:hover": {
                  backgroundColor: "rgba(0,0,0,0.8)",
                },
                zIndex: 5,
              }}
              size="small"
            >
              <CloseIcon fontSize="small" />
            </IconButton>

            {/* Media Display */}
            {selectedFile?.type.startsWith("video") ? (
              <video
                src={preview}
                controls
                style={{
                  width: "100%",
                  maxHeight: "400px",
                  objectFit: "contain",
                  display: "block",
                }}
              />
            ) : (
              <img
                src={preview}
                alt="Preview"
                style={{
                  width: "100%",
                  maxHeight: "400px",
                  objectFit: "cover",
                  display: "block",
                }}
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
