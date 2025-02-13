import React, { useState } from "react";
import UserTable from "../components/AdminData/UserTable"; // Import the UserTable component
import SubscriptionTable from "../components/AdminData/SubscriptionTable"; // Import the SubscriptionTable component
import BillingTable from "../components/AdminData/BillingTable"; // Import the BillingTable component
import styles from "./AdminDashboard.module.css"; // Import CSS for styling
import Profile from "../components/Authentication/Profile";
import LJ from "./LJReplace";
import Bookmark from "./Bookmark";
import Marquee from "../components/Marquee/Marquee";
import BookManager from "../components/BookManager/BookManager";
import { collection, getDocs } from "firebase/firestore";
import axios from "axios";


import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import SettingsIcon from "@mui/icons-material/Settings";
import PersonIcon from "@mui/icons-material/Person";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import NoteIcon from "@mui/icons-material/Note";
import LogoutIcon from "@mui/icons-material/Logout";

import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import GavelIcon from '@mui/icons-material/Gavel';
import ArticleIcon from '@mui/icons-material/Article';
import PaymentIcon from '@mui/icons-material/Payment';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import StorageIcon from '@mui/icons-material/Storage';


const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Function to handle tab switching
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const menuItems = [
    { id: "users", icon: <PeopleAltIcon />, text: "Users" },
    { id: "subscription", icon: <ArticleIcon />, text: "Subscription" },
    { id: "billing", icon: <PaymentIcon />, text: "Billing" },
    { id: "LJ", icon: <GavelIcon />, text: "Latest-Judgments" },
    { id: "Marquee", icon: <FormatQuoteIcon />, text: "Marquee" },
    { id: "BookManager", icon: <AutoStoriesIcon />, text: "BookManager" },
  ];

  // Function to render different content based on the active tab
  const renderFormContent = () => {
    switch (activeTab) {
      case "users":
        return <UserTable />; // Render the UserTable component when "users" tab is active
      case "subscription":
        return <SubscriptionTable />; // Render SubscriptionTable when "subscription" tab is active
      case "billing":
        return <BillingTable />; // Render BillingTable when "billing" tab is active
      case "profile":
        return <Profile />;
      case "LJ":
        return <LJ />;
      case "Bookmark":
        return <Bookmark />;
      case "Marquee":
        return <Marquee />;
      case "BookManager":
        return <BookManager />;
      default:
        return <p>Select a form from the sidebar.</p>;
    }
  };

  const migrateFirestoreUsers = async () => {
    try {
      // Fetch all users from Firestore
      const usersCollection = collection(db, "users");
      const querySnapshot = await getDocs(usersCollection);

      const users = [];
      querySnapshot.forEach((doc) => {
        users.push({ uid: doc.id, ...doc.data() });
      });

      if (users.length === 0) {
        alert("No users found in Firestore.");
        return;
      }

      // Send users to the backend for migration
      const response = await axios.post(
        "http://localhost:3000/api/migrate-users",
        { users }
      );

      alert(response.data.message || "Users migrated successfully.");
    } catch (error) {
      console.error("Error migrating users:", error);
      alert("An error occurred while migrating users.");
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      {/* Sidebar */}
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

      {/* Main content area */}
      <div className={styles.mainContent}>{activeTab === "users"}</div>

      {/* Form container beside the sidebar */}
      <div className={styles.formContainer}>
        {/* Dynamically render content based on the active tab */}
        {renderFormContent()}
      </div>
    </div>
  );
};

export default AdminDashboard;
