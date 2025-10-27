import React, { useEffect, useRef, useState } from "react";
import {
  Modal,
  Box,
  Typography,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { StoryService, IStory } from "../../api/services/story.service";
import StoryProgressBar from "./StoryProgressBar";
import ViewersListModal from "./ViewersListModal";
import { BASE_URL } from "../../api/endpoints";
import { useDispatch, useSelector } from "react-redux";
import { alertActions } from "../store/alert-slice";
import { authActions } from "../store/auth-slice";
import Loader from "../ui/Loader";

interface Props {
  open: boolean;
  onClose: () => void;
  userId: string;
  onStoryCountChange?: (count: number) => void;
}

const StoryViewerModal: React.FC<Props> = ({
  open,
  onClose,
  userId,
  onStoryCountChange
}) => {
  const dispatch = useDispatch();
  const loggedUserId = useSelector((state: any) => state.auth.user._id);

  const [stories, setStories] = useState<IStory[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewers, setViewers] = useState<any[]>([]);
  const [openViewers, setOpenViewers] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [hasViewed, setHasViewed] = useState<Record<string, boolean>>({});
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [loadingStories, setLoadingStories] = useState(false);

  // image timer refs
  const durationRef = useRef<number>(5000); // ms for images fallback
  const remainingRef = useRef<number>(5000); // ms remaining for images
  const rafRef = useRef<number | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const [progress, setProgress] = useState(0); // 0-100
  const touchStartX = useRef<number | null>(null);

  // video ref
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // ---- fetch stories when modal opens ----
  useEffect(() => {
    if (!open) return;
    setCurrentIndex(0);
    setLoadingStories(true);
    StoryService.getStoriesFeed(userId)
      .then((res) => {
        const s = res.stories || [];
        setStories(s);
        setViewers(s[0]?.views || []);
        if (loggedUserId === userId) dispatch(authActions.updateStoryCount(s.length));
      })
      .catch((err) => {
        dispatch(alertActions.showAlert({ severity: "error", message: err }));
      })
      .finally(() => setLoadingStories(false));
  }, [open, userId]);

  // ---- clear all timers/raf helpers ----
  const clearTimers = () => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    startTimeRef.current = null;
  };

  // ---- start the image timer (uses RAF to update progress smoothly) ----
  const startImageTimers = () => {
    // ensure no duplicate timers
    clearTimers();
    startTimeRef.current = performance.now();

    // schedule next story
    timeoutRef.current = window.setTimeout(() => {
      // ensure we don't leave timers running
      clearTimers();
      handleNext();
    }, Math.max(remainingRef.current, 0));

    const tick = () => {
      if (startTimeRef.current === null) return;
      const now = performance.now();
      const elapsed = now - startTimeRef.current;
      const progressed = ((durationRef.current - remainingRef.current) + elapsed) / durationRef.current;
      const pct = Math.min(progressed * 100, 100);
      setProgress(pct);
      if (pct < 100) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        // safety: if pct reached 100 here, ensure next story
        clearTimers();
      }
    };
    rafRef.current = requestAnimationFrame(tick);
  };

  // ---- pause image timers and compute remaining ----
  const pauseImageTimers = () => {
    if (startTimeRef.current !== null) {
      const now = performance.now();
      const elapsed = now - startTimeRef.current;
      remainingRef.current = Math.max(remainingRef.current - elapsed, 0);
    }
    clearTimers();
  };

  // ---- unify pause/resume behavior ----
  useEffect(() => {
    // do nothing if stories not loaded
    if (!stories.length) return;
    const story = stories[currentIndex];
    if (!story) return;

    // If paused or viewers modal open -> pause everything
    if (isPaused || openViewers) {
      // pause image timer if it's an image
      if (story.media.type === "image") {
        pauseImageTimers();
      }
      // pause video playback if it's a video
      if (story.media.type === "video" && videoRef.current) {
        try {
          videoRef.current.pause();
        } catch (e) {
          /* ignore */
        }
      }
      return;
    }

    // not paused & viewers closed -> resume appropriate behaviour
    if (story.media.type === "image") {
      // ensure durations set (fallback if not)
      if (!durationRef.current || durationRef.current <= 0) durationRef.current = 5000;
      if (!remainingRef.current || remainingRef.current <= 0) remainingRef.current = durationRef.current;
      startImageTimers();
    } else {
      // video: try to play (progress is updated by onTimeUpdate)
      if (videoRef.current) {
        videoRef.current.play().catch(() => {
          /* autoplay blocked */
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPaused, openViewers, currentIndex, stories]);

  // ---- when currentIndex or stories change -> reset progress, mark viewed, set durations ----
  useEffect(() => {
    if (!stories.length || !open) return;
    const story = stories[currentIndex];
    if (!story) return;

    // mark viewed (once)
    if (!hasViewed[story._id]) {
      StoryService.viewStory(story._id);
      setHasViewed((p) => ({ ...p, [story._id]: true }));
    }

    // reset progress and clear timers
    setProgress(0);
    clearTimers();

    if (story.media.type === "image") {
      // initialize image timer
      durationRef.current = 5000;
      remainingRef.current = 5000;
      if (!isPaused && !openViewers) startImageTimers();
    } else {
      // video: reset video element; progress will be set by onTimeUpdate
      // ensure remainingRef set for safety (not used for video)
      remainingRef.current = 0;
      // if videoRef exists, seek to start and play if not paused
      if (videoRef.current) {
        try {
          videoRef.current.currentTime = 0;
          if (!isPaused && !openViewers) {
            videoRef.current.play().catch(() => { });
          }
        } catch (e) { /* ignore */ }
      }
    }

    // cleanup on change
    return () => {
      clearTimers();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, stories, open]);

  // ---- cleanup on modal close ----
  useEffect(() => {
    if (!open) {
      clearTimers();
      setStories([]);
      setCurrentIndex(0);
      setProgress(0);
    }
  }, [open]);

  // ---- navigation handlers ----
  const handleNext = () => {
    clearTimers();
    // stop any playing video
    if (videoRef.current) {
      try { videoRef.current.pause(); } catch (e) { }
    }
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      onStoryCountChange?.(stories.length);
      onClose();
    }
  };

  const handlePrev = () => {
    clearTimers();
    if (videoRef.current) {
      try { videoRef.current.pause(); } catch (e) { }
    }
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
    }
  };

  // ---- viewers modal open/close handlers (preserve your previous behavior) ----
  const handleViewersClick = () => {
    setViewers(stories[currentIndex].views || []);
    setOpenViewers(true);
    setIsPaused(true); // triggers unified pause effect
  };

  const handleCloseViewers = () => {
    setOpenViewers(false);
    // allow a small tick to ensure modal has visually closed before resuming:
    // (this reduces abruptness)
    requestAnimationFrame(() => {
      setIsPaused(false);
    });
  };

  // ---- deletion flow (keeps previous behavior) ----
  const handleDeleteStory = async () => {
    const story = stories[currentIndex];
    if (!story) return;

    setIsPaused(true);

    try {
      setLoadingDelete(true);
      const res = await StoryService.deleteStory(story._id);
      dispatch(alertActions.showAlert({ severity: "success", message: res.message || "Story deleted" }));
      dispatch(authActions.decrementStoryCount());

      const updated = stories.filter((s) => s._id !== story._id);
      setStories(updated);
      if (updated.length === 0) {
        onStoryCountChange?.(stories.length);
        onClose();
      } else if (currentIndex >= updated.length) {
        setCurrentIndex(updated.length - 1);
      } else {
        // keep index same (will render new item)
        setCurrentIndex(currentIndex);
      }
    } catch (err: any) {
      dispatch(alertActions.showAlert({ severity: "error", message: err.message || "Failed to delete story" }));
    } finally {
      setLoadingDelete(false);
      setIsPaused(false);
      handleCloseViewers();
    }
  };

  // ---- touch handlers (press to pause, swipe to navigate) ----
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setIsPaused(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setIsPaused(false);
    if (touchStartX.current === null) return;
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(diff) > 50) diff > 0 ? handlePrev() : handleNext();
    touchStartX.current = null;
  };

  const story = stories[currentIndex] ?? null;

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          bgcolor: "black",
          color: "white",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
          position: "relative",
          overflow: "hidden",
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={() => setIsPaused(true)}
        onMouseUp={() => setIsPaused(false)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <IconButton
          sx={{ position: "absolute", top: 10, right: 10, color: "white", zIndex: 9999  }}
          onClick={() => {
            onStoryCountChange?.(stories.length);
            onClose();
          }}
        >
          <CloseIcon />
        </IconButton>

        {loadingStories ? (
          <Typography variant="h6" textAlign="center"><Loader /></Typography>
        ) : stories.length === 0 ? (
          <Typography variant="h6" textAlign="center">No stories found.</Typography>
        ) : (
          <>
            <StoryProgressBar stories={stories} currentIndex={currentIndex} progress={progress} />

            {story.media.type === "image" ? (
              <img
                src={`${BASE_URL}${story.media.url}`}
                alt="story"
                style={{ maxHeight: "80vh", maxWidth: "90vw", borderRadius: "10px" }}
              />
            ) : (
              <video
                key={story._id}
                ref={videoRef}
                src={`${BASE_URL}${story.media.url}`}
                controls={false}
                muted
                playsInline
                autoPlay={!isPaused && !openViewers}
                onLoadedMetadata={(e) => {
                  const vid = e.currentTarget;
                  // we won't use remainingRef for video playback; progress is driven by timeupdate
                  // but keep durationRef for fallback information if needed
                  if (vid.duration && isFinite(vid.duration)) {
                    durationRef.current = vid.duration * 1000;
                  }
                }}
                onTimeUpdate={(e) => {
                  const vid = e.currentTarget;
                  if (vid.duration && vid.duration > 0) {
                    const pct = (vid.currentTime / vid.duration) * 100;
                    setProgress(pct);
                  }
                }}
                onEnded={() => {
                  // immediate next story, ensure timers cleared first
                  clearTimers();
                  setProgress(100);
                  handleNext();
                }}
                style={{ maxHeight: "80vh", maxWidth: "90vw", borderRadius: "10px", objectFit: "contain" }}
              />
            )}

            {story.caption && (
              <Typography mt={2} textAlign="center">{story.caption}</Typography>
            )}

            {loggedUserId === story.userId && (
              <Box sx={{ mt: 2, display: "flex", alignItems: "center", gap: 2, justifyContent: "center" }}>
                <IconButton sx={{ color: "white" }} onClick={handleViewersClick} title="View viewers">
                  <VisibilityIcon />
                  <Typography variant="body2" ml={0.5}>{story.viewsCount}</Typography>
                </IconButton>
              </Box>
            )}

            {/* Fullscreen Click Areas for Prev/Next */}
            {currentIndex > 0 && (
              <Box
                onClick={handlePrev}
                sx={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: "10%",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  color: "white",
                  background: "transparent",
                  zIndex: 5,
                }}
              >
                <ArrowBackIosNewIcon
                  sx={{
                    ml: 1,
                    fontSize: 30,
                    opacity: 0.7,
                    transition: "opacity 0.2s",
                    "&:hover": { opacity: 1 },
                  }}
                />
              </Box>
            )}

            {currentIndex < stories.length - 1 && (
              <Box
                onClick={handleNext}
                sx={{
                  position: "absolute",
                  right: 0,
                  top: 0,
                  bottom: 0,
                  width: "10%",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  color: "white",
                  background: "transparent",
                  zIndex: 5,
                }}
              >
                <ArrowForwardIosIcon
                  sx={{
                    mr: 1,
                    fontSize: 30,
                    opacity: 0.7,
                    transition: "opacity 0.2s",
                    "&:hover": { opacity: 1 },
                  }}
                />
              </Box>
            )}


            <ViewersListModal
              open={openViewers}
              onClose={handleCloseViewers}
              viewers={viewers}
              storyOwnerId={story.userId.toString()}
              onDeleteStory={handleDeleteStory}
            />
          </>
        )}
      </Box>
    </Modal>
  );
};

export default StoryViewerModal;
