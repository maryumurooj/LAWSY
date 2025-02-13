import React, { useState } from "react";
import styles from "./ProfileDashboard.module.css";
import { useAuth } from "./../services/AuthContext";
// Import MUI components
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import SettingsIcon from "@mui/icons-material/Settings";
import PersonIcon from "@mui/icons-material/Person";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import NoteIcon from "@mui/icons-material/Note";
import LogoutIcon from "@mui/icons-material/Logout";
import Box from "@mui/material/Box";

// Import your components
import Profile from "../components/Authentication/Profile";
import Bookmark from "./Bookmark";
import Notes from "./Notes.jsx";

const ProfileDashboard = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { user } = useAuth();

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const menuItems = [
    { id: "settings", icon: <SettingsIcon />, text: "Settings" },
    { id: "profile", icon: <PersonIcon />, text: "Profile" },
    { id: "Bookmark", icon: <BookmarkIcon />, text: "Bookmarks" },
    { id: "Notes", icon: <NoteIcon />, text: "Notes" },
    { id: "logout", icon: <LogoutIcon />, text: "Logout" },
  ];

  const renderFormContent = () => {
    switch (activeTab) {
      case "Notes":
        return <Notes uid={user.uid} />;
      case "profile":
        return <Profile />;
      case "Bookmark":
        return <Bookmark />;
      default:
        return <p>Select a form from the sidebar.</p>;
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      <Box
        component="nav"
        className={`${styles.sidebar} ${
          isSidebarOpen ? styles.sidebarOpen : styles.sidebarClosed
        }`}
      >
        <IconButton
          color="inherit"
          aria-label="toggle sidebar"
          onClick={toggleSidebar}
          className={styles.menuButton}
        >
          <MenuIcon />
        </IconButton>

        <List>
          {menuItems.map((item) => (
            <ListItem
              key={item.id}
              onClick={() => handleTabChange(item.id)}
              className={`${styles.listItem} ${
                activeTab === item.id ? styles.listItemActive : ""
              }`}
            >
              {item.icon}
              <span
                className={`${styles.listItemText} ${
                  !isSidebarOpen && styles.hidden
                }`}
              >
                {item.text}
              </span>
            </ListItem>
          ))}
        </List>
      </Box>

      <div className={styles.mainContent}>
        <div className={styles.formContainer}>{renderFormContent()}</div>
      </div>
    </div>
  );
};

export default ProfileDashboard;
