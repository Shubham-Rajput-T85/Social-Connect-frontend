import React, { useState } from "react";
import { Box } from "@mui/material";
import SuggestedFriend from "../../friendSection/SuggestedFriend";

const ProfileLayout: React.FC<{children:React.ReactNode}> = ({ children }) => {

  return (
    <Box sx={{ display: "flex", gap: 2 }}>
      {/* Left Section - 75% */}

      <Box sx={{ flex: 3 }}>
      {children}
      </Box>

      {/* Right Section - 25% */}
      <Box sx={{ flex: 1 }}>
        <SuggestedFriend />
        {/* <FollowRequest /> */}
      </Box>
    </Box>
  );
};

export default ProfileLayout;


