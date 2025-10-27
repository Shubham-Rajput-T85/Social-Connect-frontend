import React, { useState, useEffect, useRef, useCallback, forwardRef, useImperativeHandle } from "react";
import {
  Box,
  Paper,
  Avatar,
  Typography,
  CircularProgress,
  IconButton,
  TextField,
  Button,
} from "@mui/material";
import { Edit, Delete, Check, Close } from "@mui/icons-material";
import { CommentsService, IComment, CommentDTO } from "../../api/services/comments.service";
import { BASE_URL } from "../../api/endpoints";
import { getRelativeTimeWithEdit } from "../../api/services/common";
import { useSelector } from "react-redux";
import { alertActions } from "../store/alert-slice";
import { useDispatch } from "react-redux";
import ConfirmDialog from "../ui/ConfirmDialog";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Menu, MenuItem } from "@mui/material";


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
    const [comments, setComments] = useState<IComment[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
    const [editText, setEditText] = useState("");

    const observer = useRef<IntersectionObserver | null>(null);
    const loaderRef = useRef<HTMLDivElement | null>(null);
    const scrollContainerRef = useRef<HTMLDivElement | null>(null);

    const loadingRef = useRef(loading);
    const hasMoreRef = useRef(hasMore);

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [targetCommentId, setTargetCommentId] = useState<string | null>(null);

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [menuCommentId, setMenuCommentId] = useState<string | null>(null);

    const dispatch = useDispatch();

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

    // Infinite scroll observer
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

    // Auto-update relative time
    useEffect(() => {
      const interval = setInterval(() => setComments(prev => [...prev]), 60000);
      return () => clearInterval(interval);
    }, []);

    // Delete comment
    const handleDelete = async (commentId: string) => {
      try {
        await CommentsService.deleteComment(postId, commentId);
        setComments(prev => prev.filter(c => c._id !== commentId));
        onDeleteComment?.(postId);
      } catch (err) { console.error(err); }
    };

    // Start editing
    const handleEditStart = (comment: IComment) => {
      setEditingCommentId(comment._id);
      setEditText(comment.commentText);
    };

    // Save edited comment
    const handleEditSave = async (commentId: string) => {
      if (!editText.trim()) {
        dispatch(
          alertActions.showAlert({
            severity: "error",
            message: "Comment cannot be empty.",
          })
        );
        return;
      }
      try {
        const updated = await CommentsService.editComments(postId, commentId, { commentText: editText } as CommentDTO);
        setComments(prev =>
          prev.map(c => c._id === commentId ? { ...c, commentText: updated.comment.commentText, updatedAt: new Date().toISOString() } : c)
        );
        setEditingCommentId(null);
        setEditText("");
      } catch (err) {
        console.error(err);
      }
    };

    // Cancel editing
    const handleEditCancel = () => {
      setEditingCommentId(null);
      setEditText("");
    };

    useImperativeHandle(ref, () => ({
      addNewComment: (newComment: IComment) => {
        setComments(prev => [newComment, ...prev]);
      },
    }));

    const handleMenuClick = (event: React.MouseEvent<HTMLElement>, commentId: string) => {
      setAnchorEl(event.currentTarget);
      setMenuCommentId(commentId);
    };

    const handleMenuClose = () => {
      setAnchorEl(null);
      setMenuCommentId(null);
    };

    if (comments.length === 0) return <></>;

    return (
      <Box
        ref={scrollContainerRef}
        sx={{
          maxHeight: "250px",
          overflowY: "auto",
          border: "1px solid #ddd",
          borderRadius: "10px",
          p: 1,
          mb: 1,
          backgroundColor: "#fafafa",
          "&::-webkit-scrollbar": { display: "none" },
          scrollbarWidth: "none",
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
              "&:hover .comment-actions": { display: "block", p: 1 },
            }}
          >
            <Avatar
              src={`${BASE_URL}${comment.userId.profileUrl}`}
              alt={comment.userId.name}
              sx={{ width: 40, height: 40 }}
            />
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                <Box>
                  <Typography variant="subtitle2" fontWeight={600}>{comment.userId.name}</Typography>
                  <Typography variant="caption" color="text.secondary">{comment.userId.bio}</Typography>
                </Box>
                <Typography variant="caption" color="text.secondary">
                  {getRelativeTimeWithEdit(comment.createdAt, comment.updatedAt)}
                </Typography>
              </Box>

              {/* Inline Edit Mode */}
              {editingCommentId === comment._id ? (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <TextField
                    fullWidth
                    size="small"
                    multiline
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                  />
                  <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
                    <Button
                      size="small"
                      variant="contained"
                      color="primary"
                      onClick={() => handleEditSave(comment._id)}
                      startIcon={<Check fontSize="small" />}
                    >
                      Save
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      color="inherit"
                      onClick={handleEditCancel}
                      startIcon={<Close fontSize="small" />}
                    >
                      Cancel
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Typography variant="body2" sx={{ color: "text.primary", whiteSpace: "pre-line" }}>
                  {comment.commentText}
                </Typography>
              )}
            </Box>

            {/* Actions */}
            {((currentUserId === comment.userId._id && editingCommentId !== comment._id) || (currentUserId === comment.userId._id || currentUserId === postOwnerUserId)) && (
            <Box
              className="comment-actions"
              sx={{ display: "none" }}
            >
            <IconButton
              size="small"
              onClick={(e) => handleMenuClick(e, comment._id)}
              sx={{
                position: "absolute",
                top: 5,
                right: 5,
                transition: "0.2s",
              }}
              className="menu-btn"
            >
              <MoreVertIcon fontSize="small" />
            </IconButton>
            </Box>
            )}
            {/* Hover More Icon */}

            {/* The Dropdown Menu */}
            <Menu
              anchorEl={anchorEl}
              open={menuCommentId === comment._id}
              onClose={handleMenuClose}
            >
              {currentUserId === comment.userId._id && editingCommentId !== comment._id && (
                <MenuItem
                  onClick={() => {
                    handleEditStart(comment);
                    handleMenuClose();
                  }}
                >
                  Edit
                </MenuItem>
              )}
              {(currentUserId === comment.userId._id || currentUserId === postOwnerUserId) && (
                <MenuItem
                  sx={{ color: "error.main" }}
                  onClick={() => {
                    handleMenuClose();
                    setTargetCommentId(comment._id);
                    setConfirmOpen(true);
                  }}
                >
                  Delete
                </MenuItem>
              )}
            </Menu>

          </Paper>
        ))}

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

        <ConfirmDialog
          open={confirmOpen}
          title="Delete Comment?"
          description="Are you sure you want to delete this comment? This action cannot be undone."
          onConfirm={async () => {
            if (targetCommentId) await handleDelete(targetCommentId);
            setConfirmOpen(false);
          }}
          onCancel={() => setConfirmOpen(false)}
          confirmText="Delete"
          color="error"
        />
      </Box>
    );
  }
);

export default CommentList;
