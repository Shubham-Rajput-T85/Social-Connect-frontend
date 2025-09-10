import React, { useState } from "react";
import { Box, Paper, Typography, Divider } from "@mui/material";
import SettingsSidebar from "./SettingsSidebar";
import GeneralSettingsForm from "./GeneralSettingsForm";
import SuggestedFriend from "../../friendSection/SuggestedFriend";

type TabType = "general" | "account";

const SettingsLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("general");

  return (
    <Box sx={{ display: "flex", gap: 2 }}>
      {/* Left Section - 75% */}
      <Box sx={{ flex: 3 }}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Settings
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Box sx={{ display: "flex" }}>
            {/* Vertical Tabs */}
            <Box sx={{ width: 200, mr: 3 }}>
              <SettingsSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            </Box>

            {/* Content Area */}
            <Box sx={{ flex: 1 }}>
              {activeTab === "general" && <GeneralSettingsForm />}
              {activeTab === "account" && 
              // <AccountSettings />
              <div>AccountSettings</div>
              }
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* Right Section - 25% */}
      <Box sx={{ flex: 1 }}>
        <SuggestedFriend />
        {/* <FollowRequest /> */}
      </Box>
    </Box>
  );
};

export default SettingsLayout;
