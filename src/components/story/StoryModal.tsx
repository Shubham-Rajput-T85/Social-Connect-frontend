import React, { useState, useEffect } from "react";
import {
  Box,
  Modal,
  Button,
  TextField,
  Typography,
  CircularProgress,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { StoryService } from "../../api/services/story.service";
import { useDispatch } from "react-redux";
import { alertActions } from "../store/alert-slice";

interface Props {
  open: boolean;
  onClose: () => void;
  onStoryAdded: () => void;
}

export const getMediaTypeFromUrl = (url: string): "image" | "video" | null => {
  if (!url) return null;

  const extension = url.split(".").pop()?.toLowerCase();
  if (!extension) return null;

  const imageExtensions = ["jpg", "jpeg", "png", "gif", "webp", "jfif"];
  const videoExtensions = ["mp4", "mov", "avi", "mkv", "webm"];

  if (imageExtensions.includes(extension)) return "image";
  if (videoExtensions.includes(extension)) return "video";

  return null;
};

const StoryModal: React.FC<Props> = ({ open, onClose, onStoryAdded }) => {
  const dispatch = useDispatch();
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isPortrait, setIsPortrait] = useState<boolean | null>(null);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      setIsPortrait(null);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    if (file.type.startsWith("image/")) {
      const img = new Image();
      img.onload = () => setIsPortrait(img.height > img.width);
      img.src = objectUrl;
    } else if (file.type.startsWith("video/")) {
      const v = document.createElement("video");
      v.onloadedmetadata = () => setIsPortrait(v.videoHeight > v.videoWidth);
      v.src = objectUrl;
    } else {
      setIsPortrait(false);
    }

    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    if (!selectedFile) return;

    const mediaType = getMediaTypeFromUrl(selectedFile.name);
    if (!mediaType) {
      dispatch(
        alertActions.showAlert({
          severity: "error",
          message: "Invalid file type! Only images or videos allowed.",
        })
      );
      return;
    }

    setFile(selectedFile);
  };

  const removePreview = () => setFile(null);

  const handleSubmit = async () => {
    if (!file) {
      dispatch(
        alertActions.showAlert({ severity: "error", message: "Select a file first!" })
      );
      return;
    }
    try {
      setLoading(true);
      await StoryService.addStory(file, caption);
      onStoryAdded();
      setFile(null);
      setCaption("");
      onClose();
    } catch (error: any) {
      dispatch(
        alertActions.showAlert({ severity: "error", message: error.message || "Upload failed" })
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    console.log("handlclose called");
    setFile(null);
    setCaption("");
    setPreviewUrl(null);
    setIsPortrait(null);
    onClose();
  };  

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          width: { xs: "90%", sm: 420 },
          bgcolor: "background.paper",
          mx: "auto",
          mt: { xs: 6, sm: 10 },
          borderRadius: "10px",
          p: 2,
          position: "relative",
          boxShadow: 24,
        }}
      >
        <IconButton
          onClick={handleClose}
          sx={{ position: "absolute", top: 8, right: 8 }}
          aria-label="close"
          size="small"
        >
          <CloseIcon />
        </IconButton>

        <Typography variant="h6" textAlign="center" mb={1}>
          Create Story
        </Typography>

        <Box sx={{ display: "flex", gap: 1, flexDirection: "column", alignItems: "center" }}>
          <Button
            variant="outlined"
            component="label"
            sx={{ textTransform: "none", width: "100%" }}
          >
            Choose File
            <input type="file" accept="image/*,video/*" hidden onChange={handleFileChange} />
          </Button>

          {previewUrl && (
            <Box
              sx={{
                width: "100%",
                height: 310,
                mt: 1,
                borderRadius: "10px",
                overflow: "hidden",
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "grey.900",
              }}
            >
              <IconButton
                onClick={removePreview}
                sx={{ position: "absolute", top: 8, right: 8, color: "white" }}
                size="small"
              >
                <CloseIcon />
              </IconButton>

              <Box
                sx={{
                  width: isPortrait ? "55%" : "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {file?.type.startsWith("image/") ? (
                  <img
                    src={previewUrl}
                    alt="preview"
                    style={{ maxWidth: "100%", maxHeight: "100%", borderRadius: "10px", objectFit: "contain" }}
                  />
                ) : (
                  <video
                    src={previewUrl}
                    controls
                    style={{ maxWidth: "100%", maxHeight: "100%", borderRadius: "10px", objectFit: "contain" }}
                  />
                )}
              </Box>
            </Box>
          )}

          <TextField
            fullWidth
            variant="outlined"
            label="Caption (optional)"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            sx={{ mt: 1 }}
          />

          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 1, borderRadius: "10px" }}
            onClick={handleSubmit}
            disabled={loading || !file}
          >
            {loading ? <CircularProgress size={20} /> : "Upload"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default StoryModal;
