import React from "react";
import { Box, Paper, Typography, Avatar, Divider } from "@mui/material";

interface ProfileHeaderProps {
  name: string;
  bio: string;
  avatarUrl: string;
  stats: {
    posts: number;
    followers: number;
    following: number;
  };
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ name, bio, avatarUrl, stats }) => {
  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      {/* Main Header */}
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
            src={avatarUrl}
            alt={`${name}'s Avatar`}
            sx={{ width: 80, height: 80 }}
          />
          <Box>
            <Typography variant="h6">{name}</Typography>
            <Typography variant="body2" color="text.secondary">
              {bio}
            </Typography>
          </Box>
        </Box>

        {/* Right - Stats */}
        <Box sx={{ display: "flex", gap: 4 }}>
          <Box>
            <Typography variant="h6" align="center">
              {stats.posts}
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center">
              Posts
            </Typography>
          </Box>
          <Box>
            <Typography variant="h6" align="center">
              {stats.followers}
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center">
              Followers
            </Typography>
          </Box>
          <Box>
            <Typography variant="h6" align="center">
              {stats.following}
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center">
              Following
            </Typography>
          </Box>
        </Box>
      </Box>

      <Divider sx={{ mt: 2 }} />
    </Paper>
  );
};

export default ProfileHeader;
