import React, { useState } from "react";
import UserTable from "../components/AdminData/UserTable"; // Import the UserTable component
import SubscriptionTable from "../components/AdminData/SubscriptionTable"; // Import the SubscriptionTable component
import BillingTable from "../components/AdminData/BillingTable"; // Import the BillingTable component
import styles from "./ProfileDashboard.module.css"; // Import CSS for styling
import Profile from "../components/Authentication/Profile";
import LJ from "./LJReplace";
import Bookmark from "./Bookmark";
import Notes from "./Notes.jsx"
import { useAuth } from './../services/AuthContext';



const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("users");
  const { user, subscriptionStatus } = useAuth();


  // Function to handle tab switching
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Function to render different content based on the active tab
  const renderFormContent = () => {
    switch (activeTab) {
       // Render BillingTable when "billing" tab is active
      case "Notes":
            return <Notes uid={user.uid} />;
      case "profile":
            return <Profile />; 
      case "LJ":
            return <LJ />;
      case "Bookmark":
              return <Bookmark />; 
        case "settings":
    
        return (
          <div>
            <form>
              <label>Change Password:</label>
              <input type="password" placeholder="Enter new password" />
              <br />
              <button type="submit">Update Settings</button>
            </form>
          </div>
        );
      default:
        return <p>Select a form from the sidebar.</p>;
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      {/* Sidebar */}
      <div className={styles.sidebar}>
        <div className={styles.admin}>
          <div>Admin</div>
        </div>
        <ul className={styles.contents}>
          <li
            className={activeTab === "settings" ? styles.active : ""}
            onClick={() => handleTabChange("settings")}
          >
            Settings
          </li>
          <li
            className={activeTab === "profile" ? styles.active : ""}
            onClick={() => handleTabChange("profile")}
          >
            Profile
          </li>
      
          <li
            className={activeTab === "Bookmark" ? styles.active : ""}
            onClick={() => handleTabChange("Bookmark")}
          >
            BookMarks
          </li>
          <li
            className={activeTab === "LJ" ? styles.active : ""}
            onClick={() => handleTabChange("LJ")}
          >
            LJ
          </li>

          <li
            className={activeTab === "Notes" ? styles.active : ""}
            onClick={() => handleTabChange("Notes")}
          >
            Notes
          </li>
        </ul>
      </div>

      {/* Main content area */}
      <div className={styles.mainContent}>
        {activeTab === "users"}
      </div>

      {/* Form container beside the sidebar */}
      <div className={styles.formContainer}>
        {/* Dynamically render content based on the active tab */}
        {renderFormContent()}
      </div>
    </div>
  );
};

export default AdminDashboard;
