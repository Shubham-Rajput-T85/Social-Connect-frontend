import React, { useEffect, useState, useRef } from "react";
import { Box, LinearProgress } from "@mui/material";

interface Props {
  stories: any[];
  currentIndex: number;
  duration?: number;
  isPaused?: boolean;
}

const StoryProgressBar: React.FC<Props> = ({
  stories,
  currentIndex,
  duration = 5000,
  isPaused = false,
}) => {
  const [progress, setProgress] = useState(0);
  const progressRef = useRef<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setProgress(0);
    progressRef.current = 0;
  }, [currentIndex]);

  useEffect(() => {
    const interval = 50;
    const step = (interval / duration) * 100;

    if (!isPaused) {
      timerRef.current = setInterval(() => {
        progressRef.current += step;
        setProgress(Math.min(progressRef.current, 100));
      }, interval);
    }

    return () => clearInterval(timerRef.current as NodeJS.Timeout);
  }, [isPaused, currentIndex, duration]);

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
