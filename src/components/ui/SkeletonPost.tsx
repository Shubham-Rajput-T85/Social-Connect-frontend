import React from "react";
import { Box, Paper, Skeleton } from "@mui/material";

interface SkeletonPostProps {
  count?: number; // how many skeleton cards to render
  withMedia?: boolean; // whether to include a media skeleton
}

const SkeletonPost: React.FC<SkeletonPostProps> = ({ count = 3, withMedia = true }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <Paper
          key={index}
          sx={{
            mb: 2,
            p: 2,
            borderRadius: "16px",
            boxShadow: "0px 1px 3px rgba(0,0,0,0.12)",
          }}
        >
          {/* Header: Avatar + Name + Date */}
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Skeleton variant="circular" width={40} height={40} sx={{ mr: 1 }} />
              <Box>
                <Skeleton variant="text" width={120} height={20} />
                <Skeleton variant="text" width={80} height={16} />
              </Box>
            </Box>
            <Skeleton variant="text" width={60} height={16} />
          </Box>

          {/* Post content lines */}
          <Skeleton variant="text" width="90%" height={20} sx={{ mb: 0.5 }} />
          <Skeleton variant="text" width="80%" height={20} sx={{ mb: 1.5 }} />

          {/* Optional media block */}
          {withMedia && (
            <Skeleton
              variant="rectangular"
              width="100%"
              height={250}
              sx={{ borderRadius: "10px", mb: 1 }}
            />
          )}

          {/* Post actions */}
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
            <Skeleton variant="rectangular" width={60} height={30} sx={{ borderRadius: "6px" }} />
            <Skeleton variant="rectangular" width={60} height={30} sx={{ borderRadius: "6px" }} />
          </Box>
        </Paper>
      ))}
    </>
  );
};

export default SkeletonPost;
