import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Divider,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Close as CloseIcon
} from "@mui/icons-material";

import SettingsSidebar from "./SettingsSidebar";
import GeneralSettingsForm from "./GeneralSettingsForm";
import AccountSettings from "./AccountSettings";

type TabType = "general" | "account";

const SettingsMain: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("general");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const theme = useTheme();

  /**
   * Custom breakpoint:
   * - Sidebar is always visible at 1300px and above
   * - Collapsible below 1300px
   */
  const isAboveLgPlus = useMediaQuery("(min-width:1300px)");

  // Auto toggle open state when screen crosses our custom breakpoint
  useEffect(() => {
    setSidebarOpen(isAboveLgPlus);
  }, [isAboveLgPlus]);

  return (
    <Paper sx={{ p: 2, maxWidth: 800, mx: "auto", overflow: "hidden" }}>
      {/* Header with title and toggle button */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 1,
        }}
      >
        <Typography variant="h6">Settings</Typography>

        {/* Show toggle button only when sidebar is collapsible */}
        {!isAboveLgPlus && (
          <IconButton onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <CloseIcon /> : <MenuIcon />}
          </IconButton>
        )}
      </Box>

      <Divider sx={{ mb: 2 }} />

      <Box sx={{ display: "flex", position: "relative", minHeight: 400 }}>
        {/* Sidebar */}
        <Box
          sx={{
            width: sidebarOpen ? 200 : 0,
            transition: "width 0.3s ease",
            overflow: "hidden",
            mr: sidebarOpen ? 3 : 0,
            borderRight: sidebarOpen ? "1px solid #ddd" : "none",
            backgroundColor: "#fafafa",
          }}
        >
          <SettingsSidebar
            activeTab={activeTab}
            setActiveTab={(tab) => {
              setActiveTab(tab);
              if (!isAboveLgPlus) {
                setSidebarOpen(false); // auto close on tab click for collapsible mode
              }
            }}
          />
        </Box>

        {/* Main Content */}
        <Box sx={{ flex: 1 }}>
          {activeTab === "general" && <GeneralSettingsForm />}
          {activeTab === "account" && <AccountSettings />}
        </Box>
      </Box>
    </Paper>
  );
};

export default SettingsMain;