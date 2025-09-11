import React from "react";
import { Box } from "@mui/material";
import { useLocation, Navigate } from "react-router-dom";
import ProfileHeader from "./ProfileHeader";
import SettingsMain from "./SettingsMain";
import ProfileLayout from "./ProfileLayout";
import AddPostForm from "../../post/AddPostForm";
import MyPosts from "./MyPosts";

const ProfilePage: React.FC = () => {
  const location = useLocation();
  const path = location.pathname.split("/").pop(); // last segment of URL

  // Determine active tab based on URL
  const activeTab = path === "my-posts" 
    ? "my-posts" 
    : path === "add-post" 
      ? "add-post" 
      : "settings"; // default tab

  // Redirect /profile → /profile/settings
  if (location.pathname === "/profile") {
    return <Navigate to="/profile/settings" replace />;
  }

  return (
    <Box>
      <ProfileHeader
        stats={{ posts: 1, followers: 2, following: 3 }}
      />

      {/* Tab Content */}
      {activeTab === "settings" && <ProfileLayout><SettingsMain /></ProfileLayout>}
      {activeTab === "my-posts" && <ProfileLayout><MyPosts /></ProfileLayout>}
      {activeTab === "add-post" && <ProfileLayout><AddPostForm /></ProfileLayout>}
    </Box>
  );
};

export default ProfilePage;
