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
import { useDispatch } from "react-redux";
import { alertActions } from "../store/alert-slice";
import { authActions } from "../store/auth-slice";
import { useSelector } from "react-redux";

interface Props {
  open: boolean;
  onClose: () => void;
  userId: string;
  currentUserId?: string; // for checking story ownership
}

const StoryViewerModal: React.FC<Props> = ({
  open,
  onClose,
  userId,
  currentUserId,
}) => {
  const dispatch = useDispatch();
  const [stories, setStories] = useState<IStory[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewers, setViewers] = useState<any[]>([]);
  const [openViewers, setOpenViewers] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [hasViewed, setHasViewed] = useState<Record<string, boolean>>({});
  const [loadingDelete, setLoadingDelete] = useState(false);

  // Timing refs owned by modal:
  const durationRef = useRef<number>(5000); // default, per story type we update
  const remainingRef = useRef<number>(5000); // ms remaining for current story
  const rafRef = useRef<number | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const [progress, setProgress] = useState(0); // 0 - 100%

  const touchStartX = useRef<number | null>(null);
  const loggedUserId = useSelector((state : any) => state.auth.user._id);
  // Load stories when modal opens
  console.log("currentUser id: userid: ",currentUserId,userId);
  
  useEffect(() => {
    if (!open) return;
    setCurrentIndex(0);
    StoryService.getStoriesFeed(userId).then((res) => {
      const s = res.stories || [];
      setStories(s);
      setViewers(s[0]?.views || []);

      // Update story count in redux
      // if(loggedUserId === userId){
        dispatch(authActions.updateStoryCount(s.length));
      // }
    });
  }, [open, userId]);

  // When currentIndex or stories change: reset timers for that story
  useEffect(() => {
    if (!stories.length || !open) return;
    const story = stories[currentIndex];
    if (!story) return;

    // mark viewed
    if (!hasViewed[story._id]) {
      StoryService.viewStory(story._id);
      setHasViewed((p) => ({ ...p, [story._id]: true }));
    }

    // set duration for this story
    const dur = story.media.type === "image" ? 5000 : 10000;
    durationRef.current = dur;
    remainingRef.current = dur;
    setProgress(0);

    // clear any previous timers
    clearTimers();

    if (!isPaused && !openViewers) {
      startTimers();
    }

    // cleanup on unmount or index change
    return () => {
      clearTimers();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, stories, open]); // intentionally not depending on isPaused/openViewers here

  // When pause or viewers modal toggles, update timers
  useEffect(() => {
    if (!stories.length) return;

    if (isPaused || openViewers) {
      // pause: clear timers and update remaining
      pauseTimers();
    } else {
      // resume: start timers with remaining
      startTimers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPaused, openViewers]);

  // Cleanup when modal closed
  useEffect(() => {
    if (!open) {
      clearTimers();
      setStories([]);
      setCurrentIndex(0);
      setProgress(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Timer helpers
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

  const startTimers = () => {
    // nothing to do if no stories
    if (!stories.length) return;

    // if already running, do nothing
    if (timeoutRef.current !== null || rafRef.current !== null) return;

    startTimeRef.current = performance.now();

    // set timeout to finish remaining time
    timeoutRef.current = window.setTimeout(() => {
      // move to next story when completed
      handleNext();
    }, Math.max(remainingRef.current, 0));

    // start RAF loop to update progress visually
    const tick = () => {
      if (startTimeRef.current === null) return;
      const now = performance.now();
      const elapsedSinceStart = now - startTimeRef.current;
      const elapsedTotal = (durationRef.current - remainingRef.current) + elapsedSinceStart;
      const pct = Math.min((elapsedTotal / durationRef.current) * 100, 100);
      setProgress(pct);

      // schedule next frame
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  };

  const pauseTimers = () => {
    if (startTimeRef.current !== null) {
      const now = performance.now();
      const elapsedSinceStart = now - startTimeRef.current;
      remainingRef.current = Math.max(remainingRef.current - elapsedSinceStart, 0);
    }
    clearTimers();
    // Keep `progress` value as-is so UI remains frozen.
  };

  // Navigation helpers
  const handleNext = () => {
    clearTimers();
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    clearTimers();
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
    }
  };

  const handleViewersClick = () => {
    setViewers(stories[currentIndex].views || []);
    setOpenViewers(true);
    setIsPaused(true); // pause timers (effects will call pause)
  };

  const handleCloseViewers = () => {
    setOpenViewers(false);
    setIsPaused(false); // resume timers
  };

  const handleDeleteStory = async () => {
    const story = stories[currentIndex];
    if (!story) return;

    // Pause before confirm so progress freezes during the blocking dialog
    setIsPaused(true);
    // Give a small tick to ensure pause effects applied (optional but helps in some browsers)
    await new Promise((r) => setTimeout(r, 10));
    const confirmed = window.confirm("Are you sure you want to delete this story?");
    // After confirm, keep it paused until we handle deletion result
    if (!confirmed) {
      setIsPaused(false);
      return;
    }

    try {
      setLoadingDelete(true);
      const res = await StoryService.deleteStory(story._id);
      dispatch(
        alertActions.showAlert({
          severity: "success",
          message: res.message || "Story deleted",
        })
      );
      dispatch(authActions.decrementStoryCount());

      const updated = stories.filter((s) => s._id !== story._id);
      setStories(updated);
      if (updated.length === 0) {
        onClose();
      } else if (currentIndex >= updated.length) {
        setCurrentIndex(updated.length - 1);
      } else {
        // continue on same index (new story), reset remaining
        remainingRef.current = durationRef.current;
        setProgress(0);
      }
    } catch (err: any) {
      dispatch(
        alertActions.showAlert({
          severity: "error",
          message: err.message || "Failed to delete story",
        })
      );
    } finally {
      setLoadingDelete(false);
      setIsPaused(false); // resume after deletion handling
    }
  };

  // Touch handlers (pause while touch held)
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
    <>
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
          {/* Close */}
          <IconButton
            sx={{ position: "absolute", top: 10, right: 10, color: "white" }}
            onClick={onClose}
          >
            <CloseIcon />
          </IconButton>

          {stories.length === 0 ? (
            <Typography variant="h6" textAlign="center">
              No stories found.
            </Typography>
          ) : (
            <>
              {/* Progress bar controlled by modal */}
              <StoryProgressBar
                stories={stories}
                currentIndex={currentIndex}
                progress={progress}
              />

              {/* Media */}
              {story.media.type === "image" ? (
                <img
                  src={`${BASE_URL}${story.media.url}`}
                  alt="story"
                  style={{
                    maxHeight: "80vh",
                    maxWidth: "90vw",
                    borderRadius: "10px",
                  }}
                />
              ) : (
                <video
                  src={`${BASE_URL}${story.media.url}`}
                  controls
                  // pause/play video based on pause state
                  onPlay={() => {
                    if (isPaused || openViewers) {
                      // if opened paused UI, immediately pause video playback
                      (document.activeElement as HTMLElement)?.blur?.();
                    }
                  }}
                  autoPlay={!isPaused && !openViewers}
                  style={{
                    maxHeight: "80vh",
                    maxWidth: "90vw",
                    borderRadius: "10px",
                  }}
                />
              )}

              {/* Caption */}
              {story.caption && (
                <Typography mt={2} textAlign="center">
                  {story.caption}
                </Typography>
              )}

              {/* Actions */}
              {loggedUserId === story.userId._id &&
                <Box
                  sx={{
                    mt: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    justifyContent: "center",
                  }}
                >
                  <IconButton
                    sx={{ color: "white" }}
                    onClick={handleViewersClick}
                    title="View viewers"
                  >
                    <VisibilityIcon />
                    <Typography variant="body2" ml={0.5}>
                      {story.viewsCount}
                    </Typography>
                  </IconButton>
                </Box>
              }

              {/* Navigation */}
              {currentIndex > 0 && (
                <IconButton
                  sx={{
                    position: "absolute",
                    left: 10,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "white",
                  }}
                  onClick={handlePrev}
                >
                  <ArrowBackIosNewIcon />
                </IconButton>
              )}
              {currentIndex < stories.length - 1 && (
                <IconButton
                  sx={{
                    position: "absolute",
                    right: 10,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "white",
                  }}
                  onClick={handleNext}
                >
                  <ArrowForwardIosIcon />
                </IconButton>
              )}
              <ViewersListModal
                open={openViewers}
                onClose={handleCloseViewers}
                viewers={viewers}
                currentUserId={currentUserId}
                storyOwnerId={story.userId._id}
                onDeleteStory={handleDeleteStory}
              />
            </>)}
        </Box>
      </Modal >
    </>
  );
};

export default StoryViewerModal;
