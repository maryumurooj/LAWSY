import React, { useState } from "react";
import UserTable from "../components/AdminData/UserTable"; // Import the UserTable component
import SubscriptionTable from "../components/AdminData/SubscriptionTable"; // Import the SubscriptionTable component
import BillingTable from "../components/AdminData/BillingTable"; // Import the BillingTable component
import styles from "./AdminDashboard.module.css"; // Import CSS for styling
import Profile from "../components/Authentication/Profile";
import LJ from "./LJReplace";
import Bookmark from "./Bookmark";
import { collection, getDocs } from "firebase/firestore";
import axios from "axios";


const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("users");

  // Function to handle tab switching
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

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



  const migrateFirestoreUsers = async () => {
    try {
      // Fetch all users from Firestore
      const usersCollection = collection(db, 'users');
      const querySnapshot = await getDocs(usersCollection);
  
      const users = [];
      querySnapshot.forEach(doc => {
        users.push({ uid: doc.id, ...doc.data() });
      });
  
      if (users.length === 0) {
        alert('No users found in Firestore.');
        return;
      }
  
      // Send users to the backend for migration
      const response = await axios.post('http://localhost:3000/api/migrate-users', { users });
  
      alert(response.data.message || 'Users migrated successfully.');
    } catch (error) {
      console.error('Error migrating users:', error);
      alert('An error occurred while migrating users.');
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      {/* Sidebar */}
      <div className={styles.sidebar}>
        <div className={styles.admin}>

        <div>
      <h1>Admin Dashboard</h1>
      <button onClick={migrateFirestoreUsers}>Migrate Firestore Users to MySQL</button>
    </div>
          <div>Admin</div>
        </div>
        <ul className={styles.contents}>
          <li
            className={activeTab === "users" ? styles.active : ""}
            onClick={() => handleTabChange("users")}
          >
            Users
          </li>
          <li
            className={activeTab === "subscription" ? styles.active : ""}
            onClick={() => handleTabChange("subscription")}
          >
            Subscriptions
          </li>
          <li
            className={activeTab === "billing" ? styles.active : ""}
            onClick={() => handleTabChange("billing")}
          >
            Billing
          </li>
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
            className={activeTab === "LJ" ? styles.active : ""}
            onClick={() => handleTabChange("LJ")}
          >
            Latest Judments
          </li>
          <li
            className={activeTab === "Bookmark" ? styles.active : ""}
            onClick={() => handleTabChange("Bookmark")}
          >
            BookMarks
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
