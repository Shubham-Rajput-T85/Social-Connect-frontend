import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Paper,
  Avatar,
  Typography,
} from "@mui/material";

import { IPost, PostService } from "../../api/services/post.service";
import { BASE_URL } from "../../api/endpoints";
import PostAction from "./PostAction";
import CommentList from "./CommentList";
import AddCommentForm from "./AddCommentForm";

const PAGE_SIZE = 10;

const HomePostFeed = () => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [openComments, setOpenComments] = useState<string | null>(null);

  // Refs
  const observer = useRef<IntersectionObserver | null>(null);
  const loaderRef = useRef<HTMLDivElement | null>(null); // sentinel element at bottom
  const scrollContainerRef = useRef<HTMLDivElement | null>(null); // posts list container

  // Refs to keep latest state accessible inside callbacks without re-creating them
  const loadingRef = useRef(loading);
  const hasMoreRef = useRef(hasMore);

  useEffect(() => {
    loadingRef.current = loading;
  }, [loading]);

  useEffect(() => {
    hasMoreRef.current = hasMore;
  }, [hasMore]);

  // Fetch posts for current page
  useEffect(() => {
    let cancelled = false;
    const fetchPage = async () => {
      // Use ref guards (latest values)
      if (loadingRef.current || !hasMoreRef.current) return;

      setLoading(true);
      try {
        const data = await PostService.getHomeFeed(page, PAGE_SIZE);

        if (!cancelled) {
          if (data?.postList?.length > 0) {
            // Deduplicate with Map as safety-net
            // setPosts((prev) => {
            //   const map = new Map<string, IPost>();
            //   [...prev, ...data.postList].forEach((p) => map.set(p._id, p));
            //   return Array.from(map.values());
            // });
            setPosts((prev) => [...prev, ...data.postList])

            setHasMore(Boolean(data.pagination?.hasMore));
          } else {
            setHasMore(false);
          }
        }
      } catch (err) {
        console.error("Error fetching posts:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchPage();

    return () => {
      cancelled = true;
    };
  }, [page]); // run only when page changes

  /**
   * IntersectionObserver setup
   * - root = the scrollable posts container (scrollContainerRef.current)
   * - We attach observer when loaderRef + scroll container are ready and hasMore is true.
   * - Inside callback: only increment page when:
   *    1) the sentinel is intersecting,
   *    2) the container actually has overflow (scrollHeight > clientHeight),
   *    3) not already loading.
   *
   * We re-create observer when posts length or hasMore changes so it adapts as content grows.
   */
  useEffect(() => {
    const rootEl = scrollContainerRef.current;
    const sentinel = loaderRef.current;
    if (!rootEl || !sentinel || !hasMoreRef.current) return;

    // cleanup existing observer
    observer.current?.disconnect();

    observer.current = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;

        // Only trigger when sentinel is visible
        if (!entry.isIntersecting) return;

        // Guard: if container does not overflow yet, don't auto-load pages
        // This prevents auto-loading multiple pages when the content is still shorter than container
        const sc = rootEl;
        if (sc.scrollHeight <= sc.clientHeight) {
          // content doesn't overflow the scroll container — don't auto-load
          return;
        }

        // Guard: do nothing if already loading
        if (loadingRef.current) return;

        // All checks passed — load next page
        setPage((p) => p + 1);
      },
      {
        root: rootEl, // observe intersection relative to the scroll container
        rootMargin: "0px 0px 600px 0px", // preload a bit before reaching actual bottom
        threshold: 0.5, // element should be roughly half visible
      }
    );

    observer.current.observe(sentinel);

    return () => {
      observer.current?.disconnect();
    };
  }, [posts.length, hasMore]); // re-create if posts changed (content size changed) or hasMore changed

  const toggleComments = (postId: string) => {
    setOpenComments((prev) => (prev === postId ? null : postId));
  };

  // small debug logs you can remove later
  useEffect(() => {
    console.log("page:", page, "loading:", loading, "posts:", posts.length, "hasMore:", hasMore);
  }, [page, loading, posts.length, hasMore]);

  return (
    <Box
      ref={scrollContainerRef}
      id="posts-scroll-container"
      sx={{
        overflowY: "auto",
        height: "700px", // fixed height so it's scrollable; adjust as needed
        pr: 1,
        p: 1,
        /* Hide scrollbar - Chrome, Safari and Edge */
        "&::-webkit-scrollbar": {
          display: "none",
        },

        /* Hide scrollbar - Firefox */
        scrollbarWidth: "none",

        /* Optional: smoother scrolling feel */
        WebkitOverflowScrolling: "touch",
      }}
    >
      {posts.map((post) => (
        <Paper key={post._id} sx={{ mb: 2, p: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Avatar src={`${BASE_URL}${post.userId.profileUrl}`} sx={{ mr: 1 }} />
              <Box>
                <Typography variant="body1" fontWeight={600}>
                  {post.userId.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {post.userId.bio}
                </Typography>
              </Box>
            </Box>
            <Typography variant="caption" color="text.secondary">
              {new Date(post.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </Typography>
          </Box>

          <Typography variant="body1" sx={{ mb: 1, whiteSpace: "pre-line" }}>
            {post.postContent}
          </Typography>

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

          <PostAction initialLikeCount={post.likeCount} onToggleComments={() => toggleComments(post._id)} initialCommentCount={post.commentsCount} postId={post._id} postOwnerUserId={post.userId._id} />

          {openComments === post._id && (
            <CommentList postId={post._id} postOwnerUserId={post.userId._id} />
          )}

          <AddCommentForm postId={post._id} />
        </Paper>
      ))}

      {/* sentinel element observed by IntersectionObserver */}
      {hasMore && (
        <Box ref={loaderRef} sx={{ textAlign: "center", py: 2, color: "gray" }}>
          {loading ? "Loading more posts..." : "Scroll to load more"}
        </Box>
      )}

      {!hasMore && posts.length > 0 && (
        <Box sx={{ textAlign: "center", p: 2, color: "gray" }}>
          You've reached the end of the feed
        </Box>
      )}
    </Box>
  )
}

export default HomePostFeed
