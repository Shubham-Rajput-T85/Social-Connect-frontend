import React from "react";
import {
  Box,
} from "@mui/material";
import SuggestedFriend from "../../friendSection/SuggestedFriend";
import AddPostForm from "../../post/AddPostForm";
import HomePostFeed from "../../post/HomePostFeed";

const Home = () => {
  return (
    <Box sx={{ display: "grid", gridTemplateColumns: "3fr 1fr", gap: 2 }}>
      {/* CENTER AREA */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, width: "800px" }}>
        {/* Add Post */}
        <Box>
          <AddPostForm />
        </Box>

        {/* Posts List (scrollable container) */}
        <HomePostFeed/>
      </Box>

      {/* RIGHT SIDEBAR */}
      <SuggestedFriend />
    </Box>
  );
};

export default React.memo(Home);
