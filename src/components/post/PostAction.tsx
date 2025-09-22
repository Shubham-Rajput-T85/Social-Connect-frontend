import React, { useState, useEffect } from "react";
import { ChatBubbleOutline } from "@mui/icons-material";
import { Box, IconButton, Typography } from "@mui/material";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import { LikeService } from "../../api/services/likeFeature.service";
import { formatCount } from "../../api/services/common";
import { useSelector } from "react-redux";

interface PostActionProps {
  postId: string;
  postOwnerUserId: string
  initialCommentCount: number;
  initialLikeCount: number;
  onToggleComments: () => void;
}

const PostAction: React.FC<PostActionProps> = ({
  postId,
  postOwnerUserId,
  initialCommentCount,
  initialLikeCount,
  onToggleComments,
}) => {
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(false);
    
  const currentUserId = useSelector((state: any) => state.auth.user._id);

  // On mount, check if the user has liked this post
  useEffect(() => {
    const fetchLikeStatus = async () => {
      try {
        const result = await LikeService.isLiked(postId);
        setIsLiked(result?.isLiked ?? false);
      } catch (error) {
        console.error("Failed to check like status", error);
      }
    };

    fetchLikeStatus();
  }, [postId]);

  const toggleLike = async () => {
    if (loading) return; // Prevent multiple clicks
    setLoading(true);

    try {
      if (isLiked) {
        // Optimistically update UI
        setLikeCount((prev) => Math.max(prev - 1, 0));
        setIsLiked(false);

        // Send request to backend
        await LikeService.undoLikePost(postId);
      } else {
        setLikeCount((prev) => prev + 1);
        setIsLiked(true);

        await LikeService.likePost(postId);
      }
    } catch (error) {
      console.error("Failed to toggle like", error);
      // Rollback UI if request fails
      setIsLiked((prev) => !prev);
      setLikeCount((prev) => (isLiked ? prev + 1 : Math.max(prev - 1, 0)));
    } finally {
      setLoading(false);
    }
  }; 

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 1,
      }}
    >
      {/* Comment Button */}
      <Box display="flex" alignItems="center">
        <IconButton onClick={onToggleComments} disabled={ initialCommentCount === 0}>
          <ChatBubbleOutline />
        </IconButton>
        <Typography variant="body2">{formatCount(initialCommentCount)}</Typography>
      </Box>

      {/* Like Button */}
      <Box display="flex" alignItems="center">
        <IconButton onClick={toggleLike} disabled={loading || currentUserId === postOwnerUserId}>
          {isLiked ? (
            <ThumbUpAltIcon color="secondary" />
          ) : (
            <ThumbUpOffAltIcon />
          )}
        </IconButton>
        <Typography variant="body2">{formatCount(likeCount)}</Typography>
      </Box>
    </Box>
  );
};

export default PostAction;
