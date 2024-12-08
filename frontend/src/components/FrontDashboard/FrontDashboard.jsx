import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./FrontDashboard.module.css";
import { useAuth } from '../../services/AuthContext';


const FrontDashboard = ({ onItemSelect, onZoom, onPrint, activeContent, judgmentData }) => {
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState("headnotes");
  const [isBookmarkModalOpen, setBookmarkModalOpen] = useState(false); // State for modal visibility
  const [folderName, setFolderName] = useState("");
  const [bookmarkTitle, setBookmarkTitle] = useState("");
  const [bookmarkNote, setBookmarkNote] = useState("");
  const { user, subscriptionStatus } = useAuth();
  const [selectedFolderId, setSelectedFolderId] = useState("");
  const [existingFolders, setExistingFolders] = useState([]);  

const [url, setUrl] = useState("");  // For URL


  const items = [
    { name: "Headnotes", key: "headnotes" },
    { name: "Judgements", key: "judgment" },
    { name: "Status", key: "status" },  
    { name: "Equals", key: "equals" },
    { name: "Cited", key: "cited" }, 
    { name: "Notes", key: "notes" }, 
    { name: "-", key: "minus" }, 
    { name: "+", key: "plus" }, 
    { name: "Bookmark", key: "bookmark" }, 
    { name: "Pad", key: "pad" }, 
    { name: "Print", key: "print" }, 
    { name: "True Print", key: "truePrint" }, 
  ]; 


  
  const handleClick = (key) => {
    if (key === "plus" || key === "minus") { 
      onZoom(key);
    } else if (key === "print") {
      onPrint();
    } else if (key === "pad") {
      navigate("/pad");
    } else if (key === "bookmark") {
      setBookmarkModalOpen(true); // Open the modal
    } else {
      onItemSelect(key);
    }
    setActiveItem(key);
  };

  const handleModalClose = () => {
    setBookmarkModalOpen(false);
    setFolderName("");
    setBookmarkTitle("");
    setBookmarkNote("");
    setSelectedFolderId(null);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!judgmentData || !judgmentData.judgmentId) {
      alert("Judgment ID is required!");
      return;
    }

    const bookmarkData = {
      title: bookmarkTitle,
      note: bookmarkNote,
      url: url || "http://defaulturl.com", // Ensure a non-empty URL
      folder_name: folderName || null, // Dynamic folder creation
      folder_id: selectedFolderId || null, // Existing folder ID
      parent_folder_id: null, // Optional parent folder
      uid: user.uid,
      judgmentId: judgmentData.judgmentId,
    };

    try {
      const response = await fetch("http://localhost:3000/api/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookmarkData),
      });

      if (response.ok) {
        alert("Bookmark added successfully!");
        handleModalClose();
      } else {
        const errorData = await response.json();
        alert(`Failed to add bookmark: ${errorData.message}`);
      }
    } catch (err) {
      console.error("Error creating bookmark:", err);
      alert("Failed to add bookmark.");
    }
  };

  useEffect(() => {
    if (isBookmarkModalOpen) {
      fetchFolders(); // Fetch folders when the modal opens
    }
  }, [isBookmarkModalOpen]);

  const fetchFolders = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/folders?uid=${user.uid}`);
      const folders = await response.json();
      setExistingFolders(folders);
    } catch (error) {
      console.error("Failed to fetch folders:", error);
    }
  };
  
  
  

  return (
    <div className={styles.dashboard}>
      <div className={styles.content}>
        {items.map((item, index) => (
          <button
            key={index}
            className={`${styles.textButton} ${activeItem === item.key ? styles.active : ""}`}
            onClick={() => handleClick(item.key)}
          >
            {item.name}
          </button>
        ))}
      </div>

      {/* Modal for Bookmark Form */}
      {isBookmarkModalOpen && (<div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Create Bookmark</h2>
            <form onSubmit={handleFormSubmit}>
              {/* Existing Folder Selection */}
              <label>
    Select Parent Folder:
    <select
        value={selectedFolderId || ""}
        onChange={(e) => handleParentFolderChange(e.target.value || null)}
    >
        <option value="">-- None (Top Level) --</option>
        {renderFolderOptions(existingFolders)}
    </select>
</label>

              <label>
                Select Folder:
                <select
                  value={selectedFolderId || ""}
                  onChange={(e) => setSelectedFolderId(e.target.value || null)}
                >
                  <option value="">-- None (Create New Folder) --</option>
                  {existingFolders.map((folder) => (
                    <option key={folder.id} value={folder.id}>
                      {folder.folder_name}
                    </option>
                  ))}
                </select>
              </label>

              {/* Dynamic Folder Creation */}
              <label>
                Folder Name:
                <input
                  type="text"
                  value={folderName}
                  onChange={(e) => setFolderName(e.target.value)}
                  placeholder="Enter new folder name (optional)"
                />
              </label>

              {/* Bookmark Title */}
              <label>
                Bookmark Title:
                <input
                  type="text"
                  value={bookmarkTitle}
                  onChange={(e) => setBookmarkTitle(e.target.value)}
                  required
                />
              </label>

              {/* Bookmark Note */}
              <label>
                Note:
                <textarea
                  value={bookmarkNote}
                  onChange={(e) => setBookmarkNote(e.target.value)}
                  placeholder="Optional notes for your bookmark"
                />
              </label>

              <div className={styles.modalActions}>
                <button type="submit">Save Bookmark</button>
                <button type="button" onClick={handleModalClose}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      
      )}
    </div>
  );
};

export default FrontDashboard;
