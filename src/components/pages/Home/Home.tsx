import React from "react";
import {
  Box,
} from "@mui/material";
import SuggestedFriend from "../../friendSection/SuggestedFriend";
import AddPostForm from "../../post/AddPostForm";
import HomePostFeed from "../../post/HomePostFeed";

const Home = () => {
  return (
    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr", md: "3fr 1fr" }, gap: 2 }}>
      {/* CENTER AREA */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, flexGrow: 1, maxWidth: "800px" }}>
        {/* Add Post */}
          <AddPostForm />

        {/* Posts List (scrollable container) */}
        <HomePostFeed />
      </Box>

      {/* RIGHT SIDEBAR */}
      <Box
        sx={{
          display: {
            xs: "none",
            sm: "none",  // hidden below `sm`
            md: "block", // visible on `sm` and above
          }
        }}
      >
        <SuggestedFriend />
      </Box>
    </Box>
  );
};

export default React.memo(Home);
