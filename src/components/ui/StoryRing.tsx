import React from "react";
import { IconButton, Box } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";

interface Props {
  children: React.ReactNode;
  keepAddButton?: boolean;
  storyCount?: number;
  onAddStory: () => void;
  onViewStory: () => void;
}

const COLORS = ["#ff0050", "#ff7a00", "#ffb400"];

const StoryRing: React.FC<Props> = ({
  children,
  keepAddButton = false,
  storyCount = 0,
  onAddStory,
  onViewStory,
}) => {
  const segments = Math.max(0, Math.min(12, storyCount)); // limit to 12 for visual sanity
  const gapPct = 2; // percent gap between segments
  const segPct = segments > 0 ? 100 / segments : 100;

  let background: string;

  if (segments === 0) {
    background = "transparent";
  } else if (segments === 1) {
    // For one story → smooth gradient ring
    background = `conic-gradient(from -90deg, ${COLORS[0]}, ${COLORS[1]}, ${COLORS[2]}, ${COLORS[0]})`;
  } else {
    // For multiple stories → clear segmented conic gradient
    const gradientStops = Array.from({ length: segments })
      .map((_, i) => {
        const start = (i * segPct).toFixed(2);
        const end = ((i + 1) * segPct - gapPct).toFixed(2);
        const color = COLORS[i % COLORS.length];
        return `${color} ${start}%, ${color} ${end}%, transparent ${end}%, transparent ${(i + 1) * segPct}%`;
      })
      .join(", ");
    background = `conic-gradient(from -90deg, ${gradientStops})`;
  }

  const ringStyle: React.CSSProperties = {
    borderRadius: "50%",
    padding: "3px",
    cursor: storyCount === 0 ? "default" : "pointer",
    background,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "transform 0.2s ease",
  };

  return (
    <Box sx={{ position: "relative", display: "inline-block" }}>
      <Box
        onClick={onViewStory}
        sx={{
          ...ringStyle,
          "&:hover": storyCount > 0 ? { transform: "scale(1.05)" } : {},
        }}
      >
        {children}
      </Box>

      {keepAddButton && (
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            onAddStory();
          }}
          sx={{
            position: "absolute",
            bottom: -4,
            right: -4,
            bgcolor: "primary.main",
            color: "white",
            "&:hover": { bgcolor: "primary.dark" },
            borderRadius: "50%",
            boxShadow: 1,
          }}
        >
          <AddCircleIcon fontSize="small" />
        </IconButton>
      )}
    </Box>
  );
};

export default StoryRing;
