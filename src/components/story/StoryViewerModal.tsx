import React, { useEffect, useState, useRef } from "react";
import { Modal, Box, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { StoryService, IStory } from "../../api/services/story.service";
import StoryProgressBar from "./StoryProgressBar";
import ViewersListModal from "./ViewersListModal";
import { BASE_URL } from "../../api/endpoints";

interface Props {
  open: boolean;
  onClose: () => void;
  userId: string;
}

const StoryViewerModal: React.FC<Props> = ({ open, onClose, userId }) => {
  const [stories, setStories] = useState<IStory[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewers, setViewers] = useState<any[]>([]);
  const [openViewers, setOpenViewers] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [hasViewed, setHasViewed] = useState<Record<string, boolean>>({});
  const touchStartX = useRef<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch stories on open
  useEffect(() => {
    if (open) {
      setCurrentIndex(0);
      StoryService.getStoriesFeed(userId).then((res) =>
      {
        setStories(res.stories || [])
        setViewers(res.stories[0].views || []);
      }
      );
    }
  }, [open, userId]);

  // Auto switch story
  useEffect(() => {
    if (!stories.length || !open) return;
    const story = stories[currentIndex];

    // Mark as viewed only once
    if (!hasViewed[story._id]) {
      StoryService.viewStory(story._id);
      setHasViewed((prev) => ({ ...prev, [story._id]: true }));
    }

    const duration = story.media.type === "image" ? 5000 : 10000;

    if (!isPaused) {
      timerRef.current = setTimeout(() => handleNext(), duration);
    }

    return () => clearTimeout(timerRef.current as NodeJS.Timeout);
  }, [currentIndex, stories, open, isPaused]);

  const handleNext = () => {
    if (currentIndex < stories.length - 1) setCurrentIndex((i) => i + 1);
    else onClose();
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  };

  const handleViewersClick = async () => {
    setViewers((stories as any)[currentIndex].views || []);
    setOpenViewers(true);
  };

  // Swipe handling for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setIsPaused(true); // pause on hold
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setIsPaused(false); // resume
    if (touchStartX.current === null) return;
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(diff) > 50) diff > 0 ? handlePrev() : handleNext();
    touchStartX.current = null;
  };

  if (!stories.length) return null;
  const story = stories[currentIndex];

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
          <IconButton
            sx={{ position: "absolute", top: 10, right: 10, color: "white" }}
            onClick={onClose}
          >
            <CloseIcon />
          </IconButton>

          <StoryProgressBar
            stories={stories}
            currentIndex={currentIndex}
            isPaused={isPaused}
          />

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
              autoPlay={!isPaused}
              style={{ maxHeight: "80vh", maxWidth: "90vw", borderRadius: "10px" }}
            />
          )}

          <Typography mt={2}>{story.caption}</Typography>

          <IconButton sx={{ color: "white", mt: 1 }} onClick={handleViewersClick}>
            <VisibilityIcon /> {story.viewsCount}
          </IconButton>

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
        </Box>
      </Modal>

      <ViewersListModal
        open={openViewers}
        onClose={() => setOpenViewers(false)}
        viewers={viewers}
      />
    </>
  );
};

export default StoryViewerModal;
