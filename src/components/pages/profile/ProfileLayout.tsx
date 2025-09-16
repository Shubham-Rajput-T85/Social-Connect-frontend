import React, { useState } from "react";
import { Box } from "@mui/material";
import SuggestedFriend from "../../friendSection/SuggestedFriend";
import FollowRequest from "../../friendSection/FollowRequest";
import { useSelector } from "react-redux";

const ProfileLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  const currentUserId = useSelector((state: any) => state.auth.user._id);

  return (
    <Box sx={{ display: "flex", gap: 2 }}>
      {/* Left Section - 75% */}

      <Box sx={{ flex: 3 }}>
        {children}
      </Box>

      {/* Right Section - 25% */}
      <Box sx={{ flex: 1, gap:2 }}>
        <FollowRequest currentUserId={currentUserId} />
        <SuggestedFriend />

      </Box>
    </Box>
  );
};

export default ProfileLayout;


