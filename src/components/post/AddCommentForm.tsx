import React, { useState, FormEvent } from "react";
import {
  Box,
  Avatar,
  Button,
  TextField,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { alertActions } from "../store/alert-slice";
import Loader from "../ui/Loader"; // Import your custom loader
import { CommentDTO, CommentsService, IComment } from "../../api/services/comments.service";

const AddCommentForm: React.FC<{ postId: string,
  onCommentAdded?: (postId: string,newComment: IComment) => void
 }> = ({ postId, onCommentAdded }) => {
    const dispatch = useDispatch();
    const user = useSelector((state: any) => state.auth.user);
  
    const [commentContent, setCommentContent] = useState("");
    const [loading, setLoading] = useState(false); // NEW loading state
  
    /** Submit new comment */
    const handleCommentSubmit = async (event: FormEvent) => {
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
  
      if (!commentContent.trim()) {
        dispatch(
          alertActions.showAlert({
            severity: "error",
            message: "Comment must have text or media!",
          })
        );
        return;
      }
  
      try {
        setLoading(true); // Start loader
        const data: CommentDTO = { commentText: commentContent };
        const response = await CommentsService.addComments(postId, data);
        console.log(response);
        if (onCommentAdded) {
          onCommentAdded(postId, response.comment);
        }

        // Reset form
        setCommentContent("");
  
        dispatch(
          alertActions.showAlert({
            severity: "success",
            message: "Comment added successfully!",
          })
        );
      } catch (error) {
        dispatch(
          alertActions.showAlert({
            severity: "error",
            message: "Error: " + error,
          })
        );
      } finally {
        setLoading(false); // Stop loader
      }
    };
    return (
      <>
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
  
        {/* Add Comment Form */}
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }} component="form" onSubmit={handleCommentSubmit}>
            <Avatar src={`http://localhost:8080${user.profileUrl}`} sx={{ mr: 2 }} />
            <TextField
              variant="outlined"
              placeholder="How's this post?"
              fullWidth
              multiline
              maxRows={5}
              size="small"
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              disabled={loading}
            />
            <Button sx={{ ml: 2 }} 
              variant="contained"
              color="primary"
              type="submit"
              disabled={loading || (!commentContent.trim())} // disabled when no input or loading
            >
              {loading ? "Commenting..." : "Comment"}
            </Button>
          </Box>
      </>
    );
}

export default AddCommentForm
