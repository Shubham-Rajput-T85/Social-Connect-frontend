import React from "react";
import { Box, LinearProgress } from "@mui/material";

interface Props {
  stories: any[];
  currentIndex: number;
  progress: number; // 0 - 100 for the current story
}

const StoryProgressBar: React.FC<Props> = ({ stories, currentIndex, progress }) => {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 0.5,
        width: "90%",
        position: "absolute",
        top: 15,
      }}
    >
      {stories.map((_, index) => (
        <Box key={index} sx={{ flexGrow: 1 }}>
          <LinearProgress
            variant="determinate"
            value={
              index < currentIndex ? 100 : index === currentIndex ? progress : 0
            }
            sx={{
              height: 4,
              borderRadius: 5,
              backgroundColor: "rgba(255,255,255,0.3)",
              "& .MuiLinearProgress-bar": {
                backgroundColor: "white",
              },
            }}
          />
        </Box>
      ))}
    </Box>
  );
};

export default StoryProgressBar;
