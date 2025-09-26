import React from "react";
import { List, ListItemButton, ListItemText } from "@mui/material";

interface SettingsSidebarProps {
  activeTab: "general" | "account";
  setActiveTab: (tab: "general" | "account") => void;
}

const SettingsSidebar: React.FC<SettingsSidebarProps> = ({ activeTab, setActiveTab }) => {
  return (
    <List sx={{ width: "100%" }}>
      <ListItemButton
        selected={activeTab === "general"}
        onClick={() => setActiveTab("general")}
      >
        <ListItemText primary="General" />
      </ListItemButton>
      <ListItemButton
        selected={activeTab === "account"}
        onClick={() => setActiveTab("account")}
      >
        <ListItemText primary="Account" />
      </ListItemButton>
    </List>
  );
};

export default SettingsSidebar;
