import React, { useState } from "react";
import { Box, Paper, Typography, Divider } from "@mui/material";
import SettingsSidebar from "./SettingsSidebar";
import GeneralSettingsForm from "./GeneralSettingsForm";
import AccountSettings from "./AccountSettings";

type TabType = "general" | "account";

const SettingsMain = () => {
  const [activeTab, setActiveTab] = useState<TabType>("general");
  return (
    <Paper sx={{ p: 2 , width: "800px" }}>
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
          <AccountSettings />
          }
        </Box>
      </Box>
    </Paper>
  )
}

export default SettingsMain