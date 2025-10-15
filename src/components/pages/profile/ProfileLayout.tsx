import React from "react";
import { Box } from "@mui/material";
import SuggestedFriend from "../../friendSection/SuggestedFriend";
import FollowRequest from "../../friendSection/FollowRequest";

const ProfileLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",          // On mobile, single column
          md: "3fr 1fr",  // On md and above, split into 3 columns
        },
        gap: 2,
      }}
    >
      {/* Main Content */}
      <Box sx={{ width: "100%", maxWidth: 800, mx: "auto" }}>
        {children}
      </Box>

      {/* Right Sections - visible only on md and above */}
      <Box sx={{ display: { xs: "none", md: "block" } }}>
        <FollowRequest />
        <SuggestedFriend />
      </Box>
    </Box>
  );
};

export default ProfileLayout;
