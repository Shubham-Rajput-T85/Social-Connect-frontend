import React, { useState, useEffect, useRef, useCallback,forwardRef, useImperativeHandle } from "react";
import {
  Box,
  Paper,
  Avatar,
  Typography,
  CircularProgress,
  IconButton,
  Modal,
  TextField,
  Button,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { CommentsService, IComment, CommentDTO } from "../../api/services/comments.service";
import { BASE_URL } from "../../api/endpoints";
import { getRelativeTimeWithEdit } from "../../api/services/common";
import { useSelector } from "react-redux";

const COMMENT_PAGE_SIZE = 10;

interface CommentListProps {
  postId: string;
  postOwnerUserId: string;
  onDeleteComment?: (postId: string) => void;
}

export interface CommentListHandle {
  addNewComment: (newComment: IComment) => void;
}

const CommentList = forwardRef<CommentListHandle, CommentListProps>(
  ({ postId, postOwnerUserId, onDeleteComment }, ref) => {

  const currentUserId = useSelector((state: any) => state.auth.user._id);
  console.log("current user id:", currentUserId);
  const [comments, setComments] = useState<IComment[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [editComment, setEditComment] = useState<IComment | null>(null);
  const [editText, setEditText] = useState("");

  const observer = useRef<IntersectionObserver | null>(null);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const loadingRef = useRef(loading);
  const hasMoreRef = useRef(hasMore);

  // Update refs
  useEffect(() => { loadingRef.current = loading; }, [loading]);
  useEffect(() => { hasMoreRef.current = hasMore; }, [hasMore]);

  // Fetch comments
  const fetchComments = useCallback(async () => {
    if (loadingRef.current || !hasMoreRef.current) return;
    setLoading(true);
    setError(null);
    try {
      const data = await CommentsService.getComments(postId, page, COMMENT_PAGE_SIZE);
      if (data?.commentList?.length) {
        setComments(prev => [...prev, ...data.commentList]);
        setHasMore(Boolean(data.pagination?.hasMore) ?? false);
      } else setHasMore(false);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch comments");
    } finally {
      setLoading(false);
    }
  }, [page, postId]);

  useEffect(() => { fetchComments(); }, [fetchComments]);

  // Infinite scroll
  useEffect(() => {
    const rootEl = scrollContainerRef.current;
    const sentinel = loaderRef.current;
    if (!rootEl || !sentinel || !hasMoreRef.current) return;

    observer.current?.disconnect();
    observer.current = new IntersectionObserver(
      entries => {
        const entry = entries[0];
        if (!entry.isIntersecting) return;
        if (rootEl.scrollHeight <= rootEl.clientHeight) return;
        if (loadingRef.current) return;
        setPage(p => p + 1);
      },
      { root: rootEl, rootMargin: "0px 0px 200px 0px", threshold: 0.5 }
    );
    observer.current.observe(sentinel);
    return () => observer.current?.disconnect();
  }, [comments.length]);

  // Auto-update relative time every minute
  useEffect(() => {
    const interval = setInterval(() => setComments(prev => [...prev]), 60000);
    return () => clearInterval(interval);
  }, []);

  // Handlers
  const handleDelete = async (commentId: string) => {
    try {
      const response = await CommentsService.deleteComment(postId, commentId);
      setComments(prev => prev.filter(c => c._id !== commentId));

      if (onDeleteComment) {
        onDeleteComment(postId);
      }
    } catch (err) { console.error(err); }
  };

  const handleEditOpen = (comment: IComment) => {
    setEditComment(comment);
    setEditText(comment.commentText);
  };

  const handleEditSave = async () => {
    if (!editComment) return;
    try {
      const updated = await CommentsService.editComments(postId, editComment._id, { commentText: editText } as CommentDTO);
      console.log("updated:", updated);
      setComments(prev => prev.map(c => c._id === editComment._id ? { ...c, commentText: updated.comment.commentText } : c));
      setEditComment(null);
      setEditText("");
    } catch (err) { console.error(err); }
  };

  console.log(comments);

  useImperativeHandle(ref, () => ({
    addNewComment: (newComment: IComment) => {
      console.log(newComment);
      setComments(prev => [newComment, ...prev]); // prepend new comment
    }
  }));

  if (comments.length === 0) {
    return <></>
  }

  return (
    <>
      <Box
        ref={scrollContainerRef}
        sx={{
          // maxHeight: "250px",
          overflowY: "auto",
          border: "1px solid #ddd",
          borderRadius: "10px",
          p: 1,
          mb: 1,
          backgroundColor: "#fafafa",
          "&::-webkit-scrollbar": { display: "none" },
          scrollbarWidth: "none",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {error && <Typography color="error" variant="body2" sx={{ textAlign: "center", py: 1 }}>{error}</Typography>}

        {comments.map(comment => (
          <Paper
            key={comment._id}
            elevation={1}
            sx={{
              p: 1.5,
              mb: 1,
              borderRadius: "10px",
              display: "flex",
              alignItems: "flex-start",
              gap: 1.5,
              position: "relative",
              "&:hover .comment-actions": { display: "flex" }
            }}
          >
            <Avatar src={`${BASE_URL}${comment.userId.profileUrl}`} alt={comment.userId.name} sx={{ width: 40, height: 40 }} />
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                <Box>
                  <Typography variant="subtitle2" fontWeight={600}>{comment.userId.name}</Typography>
                  <Typography variant="caption" color="text.secondary">{comment.userId.bio}</Typography>
                </Box>
                <Typography variant="caption" color="text.secondary">
                  {
                    getRelativeTimeWithEdit(comment.createdAt, comment.updatedAt)
                  }
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: "text.primary", whiteSpace: "pre-line" }}>{comment.commentText}</Typography>
            </Box>

            {/* Edit/Delete buttons */}
            <Box className="comment-actions" sx={{ display: "none", gap: 0.5, position: "absolute", top: 4, right: 4 }}>
              {currentUserId === comment.userId._id &&
                <IconButton size="small" onClick={() => handleEditOpen(comment)}><Edit fontSize="small" /></IconButton>
              }
              {(currentUserId === comment.userId._id || currentUserId === postOwnerUserId) && 
                <IconButton size="small" onClick={() => handleDelete(comment._id)}><Delete fontSize="small" /></IconButton>
              }
            </Box>
          </Paper>
        ))}

        {/* Loader / sentinel */}
        {hasMore && (
          <Box ref={loaderRef} sx={{ display: "flex", justifyContent: "center", py: 1 }}>
            {loading && <CircularProgress size={20} />}
          </Box>
        )}

        {!hasMore && comments.length > 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", mt: 1 }}>
            You've reached the end of the comments
          </Typography>
        )}
      </Box>

      {/* Edit modal */}
      <Modal open={!!editComment} onClose={() => setEditComment(null)}>
        <Box sx={{
          position: "absolute",
          top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          p: 3,
          borderRadius: "10px",
          width: 600,

        }}>
          <Typography variant="h6" mb={2}>Edit Comment</Typography>
          <TextField
            fullWidth
            multiline
            maxRows={5}
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
          />
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2, gap: 1 }}>
            <Button variant="outlined" onClick={() => setEditComment(null)}>Cancel</Button>
            <Button variant="contained" onClick={handleEditSave}>Save</Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}
)
;

export default CommentList;
