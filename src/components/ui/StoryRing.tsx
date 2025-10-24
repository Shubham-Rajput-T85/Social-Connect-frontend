import React from "react";
import { Avatar, IconButton, Box } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import PersonIcon from "@mui/icons-material/Person";
import { BASE_URL } from "../../api/endpoints";

interface Props {
  profileUrl?: string;
  storyCount?: number;
  onAddStory: () => void;
  onViewStory: () => void;
}

const COLORS = ["#ff0050", "#ff7a00", "#ffb400"];

const StoryRing: React.FC<Props> = ({ profileUrl, storyCount = 0, onAddStory, onViewStory }) => {
  const segments = Math.max(0, Math.min(12, storyCount)); // limit to 12 for visual sanity
  const gapPct = 2; // percent gap between segments
  const segPct = segments > 0 ? 100 / segments : 100;

  const gradientStops =
    segments > 0
      ? Array.from({ length: segments })
          .map((_, i) => {
            const start = (i * segPct).toFixed(4);
            const end = (i + 1) * segPct - gapPct;
            const color = COLORS[i % COLORS.length];
            return `${color} ${start}%, ${color} ${end}%, transparent ${end}%`;
          })
          .join(", ")
      : "transparent";

  const ringStyle: React.CSSProperties = {
    borderRadius: "50%",
    padding: "3px",
    cursor: storyCount == 0 ? "cursor" : "pointer",
    background: segments > 0 ? `conic-gradient(from -90deg, ${gradientStops})` : "transparent",
  };

  return (
    <Box sx={{ position: "relative", display: "inline-block" }}>
      <Box onClick={onViewStory} sx={ringStyle}>
        <Avatar
          src={profileUrl ? `${BASE_URL}${profileUrl}` : undefined}
          alt="profile"
          sx={{
            width: 80,
            height: 80,
            margin: "auto",
            borderRadius: "50%",
            bgcolor: !profileUrl ? "grey.400" : undefined,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {!profileUrl && <PersonIcon sx={{ fontSize: 40 }} />}
        </Avatar>
      </Box>

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
    </Box>
  );
};

export default StoryRing;
