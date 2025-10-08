import React, { useState, useEffect, useRef } from "react";
import { Box, Paper, Avatar, Typography } from "@mui/material";

import { IPost, PostService } from "../../api/services/post.service";
import { BASE_URL } from "../../api/endpoints";
import PostAction from "./PostAction";
import CommentList, { CommentListHandle } from "./CommentList";
import AddCommentForm from "./AddCommentForm";
import SkeletonPost from "../ui/SkeletonPost";

const PAGE_SIZE = 10;

const HomePostFeed = () => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [commentCounts, setCommentCounts] = useState<{ [postId: string]: number }>({});
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [openComments, setOpenComments] = useState<string | null>(null);

  const commentsRef = useRef<CommentListHandle>(null);
  const observer = useRef<IntersectionObserver | null>(null);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const loadingRef = useRef(loading);
  const hasMoreRef = useRef(hasMore);

  useEffect(() => { loadingRef.current = loading; }, [loading]);
  useEffect(() => { hasMoreRef.current = hasMore; }, [hasMore]);

  // ----- Fetch posts -----
  const fetchPage = async (pageToFetch: number) => {
    if (loadingRef.current || !hasMoreRef.current) return;

    setLoading(true);
    try {
      const data = await PostService.getHomeFeed(pageToFetch, PAGE_SIZE);
      if (data?.postList?.length > 0) {
        setPosts(prev => [...prev, ...data.postList]);

        setCommentCounts(prevCounts => {
          const newCounts = { ...prevCounts };
          data.postList.forEach((post: any) => {
            if (newCounts[post._id] === undefined) {
              newCounts[post._id] = post.commentsCount;
            }
          });
          return newCounts;
        });

        setHasMore(Boolean(data.pagination?.hasMore));
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Error fetching posts:", err);
    } finally {
      setLoading(false);
    }
  };

  // ----- Initial fetch -----
  useEffect(() => {
    fetchPage(1);
  }, []);

  // ----- Pagination fetch -----
  useEffect(() => {
    if (page > 1) {
      fetchPage(page);
    }
  }, [page]);

  // ----- IntersectionObserver -----
  useEffect(() => {
    const rootEl = scrollContainerRef.current;
    const sentinel = loaderRef.current;
    if (!rootEl || !sentinel || !hasMoreRef.current || posts.length === 0) return;

    observer.current?.disconnect();
    observer.current = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry.isIntersecting) return;

        // Ensure container overflows
        if (rootEl.scrollHeight <= rootEl.clientHeight) return;
        if (loadingRef.current) return;

        setPage(p => p + 1);
      },
      { root: rootEl, rootMargin: "0px 0px 600px 0px", threshold: 0.5 }
    );

    observer.current.observe(sentinel);
    return () => observer.current?.disconnect();
  }, [posts.length, hasMore]);

  const toggleComments = (postId: string) => setOpenComments(prev => (prev === postId ? null : postId));

  return (
    <Box
      ref={scrollContainerRef}
      sx={{
        overflowY: "auto",
        height: "70vh",
        pr: 1,
        p: 1,
        "&::-webkit-scrollbar": { display: "none" },
        scrollbarWidth: "none",
        WebkitOverflowScrolling: "touch",
      }}
    >
      {/* Skeleton for initial load */}
      {posts.length === 0 && loading && <SkeletonPost count={3} />}

      {posts.map(post => (
        <Paper key={post._id} sx={{ mb: 2, p: 2 }}>
          {/* Header */}
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Avatar src={`${BASE_URL}${post.userId.profileUrl}`} sx={{ mr: 1 }} />
              <Box>
                <Typography variant="body1" fontWeight={600}>{post.userId.name}</Typography>
                <Typography variant="caption" color="text.secondary">{post.userId.bio}</Typography>
              </Box>
            </Box>
            <Typography variant="caption" color="text.secondary">
              {new Date(post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </Typography>
          </Box>

          {/* Post content */}
          <Typography variant="body1" sx={{ mb: 1, whiteSpace: "pre-line", wordBreak: "break-word" }}>{post.postContent}</Typography>

          {/* Media */}
          {post.media?.url && (
            <Box sx={{
              width: "100%",
              maxHeight: 400,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#f9f9f9",
              borderRadius: "10px",
              overflow: "hidden",
              mb: 1,
              p: 1,
            }}>
              {post.media.type === "image" ? (
                <Box component="img" src={`${BASE_URL}${post.media.url}`} alt="Post Media" loading="lazy"
                  sx={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", borderRadius: "10px" }}
                />
              ) : (
                <Box component="video" src={`${BASE_URL}${post.media.url}`} controls
                  sx={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", borderRadius: "10px" }}
                />
              )}
            </Box>
          )}

          <PostAction
            initialLikeCount={post.likeCount}
            initialCommentCount={commentCounts[post._id] ?? post.commentsCount}
            onToggleComments={() => toggleComments(post._id)}
            postId={post._id}
            postOwnerUserId={post.userId._id}
          />

          {openComments === post._id && (
            <CommentList
              ref={commentsRef}
              postId={post._id}
              postOwnerUserId={post.userId._id}
              onDeleteComment={(postId: string) => {
                setCommentCounts(prev => ({ ...prev, [postId]: Math.max((prev[postId] || 1) - 1, 0) }));
              }}
            />
          )}

          <AddCommentForm
            postId={post._id}
            onCommentAdded={(postId, newComment) => {
              commentsRef.current?.addNewComment(newComment);
              setCommentCounts(prev => ({ ...prev, [postId]: (prev[postId] || 0) + 1 }));
            }}
          />
        </Paper>
      ))}

      {/* Sentinel */}
      {hasMore && posts.length > 0 && (
        <Box ref={loaderRef} sx={{ textAlign: "center" }}>
          {loading ? <SkeletonPost count={2} withMedia={true} /> : "Scroll to load more"}
        </Box>
      )}

      {!hasMore && posts.length > 0 && (
        <Box sx={{ textAlign: "center", p: 2, color: "gray" }}>You've reached the end of the feed</Box>
      )}
    </Box>
  );
};

export default HomePostFeed;
