import React, { useState } from "react";
import { Box, Paper, Typography, Avatar, Button, Divider } from "@mui/material";
import SettingsLayout from "./SettingsLayout";

type TabType = "my-posts" | "add-post" | "settings";

const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("settings");

  return (
    <Box>
      {/* Profile Header */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Left - Avatar + Bio */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar
              src="https://i.pravatar.cc/150?img=12"
              alt="User Avatar"
              sx={{ width: 80, height: 80 }}
            />
            <Box>
              <Typography variant="h6">Alex Johnson</Typography>
              <Typography variant="body2" color="text.secondary">
                Building the future 🚀
              </Typography>
            </Box>
          </Box>

          {/* Right - Stats */}
          <Box sx={{ display: "flex", gap: 4 }}>
            <Box>
              <Typography variant="h6" align="center">
                120
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center">
                Posts
              </Typography>
            </Box>
            <Box>
              <Typography variant="h6" align="center">
                350
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center">
                Followers
              </Typography>
            </Box>
            <Box>
              <Typography variant="h6" align="center">
                180
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center">
                Following
              </Typography>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Tabs Navigation */}
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            onClick={() => setActiveTab("my-posts")}
            variant={activeTab === "my-posts" ? "contained" : "text"}
          >
            My Posts
          </Button>
          <Button
            onClick={() => setActiveTab("add-post")}
            variant={activeTab === "add-post" ? "contained" : "text"}
          >
            Add Post
          </Button>
          <Button
            onClick={() => setActiveTab("settings")}
            variant={activeTab === "settings" ? "contained" : "text"}
          >
            Settings
          </Button>
        </Box>
      </Paper>

      {/* Tab Content */}
      {activeTab === "settings" && <SettingsLayout />}
      {activeTab === "my-posts" && <Typography>My Posts Component</Typography>}
      {activeTab === "add-post" && <Typography>Add Post Form Component</Typography>}
    </Box>
  );
};

export default ProfilePage;
