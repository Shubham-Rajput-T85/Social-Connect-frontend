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
    return <Navigate to="/profile/my-posts" replace />;
  }

  return (
    <Box>
      <ProfileHeader />

      {/* Tab Content */}
      <ProfileLayout>
      {activeTab === "settings" && <SettingsMain />}
      {activeTab === "my-posts" && <MyPosts />}
      {activeTab === "add-post" && <AddPostForm />}
      </ProfileLayout>
    </Box>
  );
};

export default ProfilePage;
