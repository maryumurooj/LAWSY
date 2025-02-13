import React, { useEffect, useState } from "react";
import styles from "./Bookmarks.module.css";
import { useAuth } from "../services/AuthContext";
import FolderIcon from "@mui/icons-material/Folder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

const Bookmarks = () => {
  const [folders, setFolders] = useState([]);
  const [expandedFolders, setExpandedFolders] = useState({});
  const { user } = useAuth();

  useEffect(() => {
    fetchFoldersAndBookmarks();
  }, []);

  const fetchFoldersAndBookmarks = async () => {
    try {
      // Fetch folders
      const foldersResponse = await fetch(
        `http://localhost:3000/api/folders?uid=${user.uid}`
      );
      const foldersData = await foldersResponse.json();

      // Fetch bookmarks
      const bookmarksResponse = await fetch(
        `http://localhost:3000/api/bookmarks?uid=${user.uid}`
      );
      const bookmarksData = await bookmarksResponse.json();

      // Organize bookmarks by folder
      const organizedData = organizeFoldersAndBookmarks(
        foldersData.folders,
        bookmarksData.bookmarks
      );
      setFolders(organizedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const organizeFoldersAndBookmarks = (folders, bookmarks) => {
    const folderMap = new Map();

    // Initialize with "No Folder" category
    folderMap.set(null, {
      id: "no-folder",
      name: "Uncategorized",
      bookmarks: [],
    });

    // Create folder structure
    folders.forEach((folder) => {
      folderMap.set(folder.id, {
        ...folder,
        name: folder.folder_name,
        bookmarks: [],
      });
    });

    // Organize bookmarks into folders
    bookmarks.forEach((bookmark) => {
      const folderId = bookmark.folder_id || null;
      const folder = folderMap.get(folderId);
      if (folder) {
        folder.bookmarks.push(bookmark);
      }
    });

    return Array.from(folderMap.values());
  };

  const toggleFolder = (folderId) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [folderId]: !prev[folderId],
    }));
  };

  return (
    <div className={styles.bookmarksContainer}>
      {folders.map((folder) => (
        <div key={folder.id} className={styles.folderSection}>
          <div
            className={styles.folderHeader}
            onClick={() => toggleFolder(folder.id)}
          >
            <FolderIcon className={styles.folderIcon} />
            <span className={styles.folderName}>{folder.name}</span>
            {expandedFolders[folder.id] ? (
              <ExpandLessIcon />
            ) : (
              <ExpandMoreIcon />
            )}
          </div>

          {expandedFolders[folder.id] && (
            <div className={styles.bookmarksList}>
              {folder.bookmarks.map((bookmark) => (
                <div key={bookmark.id} className={styles.bookmarkCard}>
                  <div className={styles.bookmarkContent}>
                    <div className={styles.bookmarkHeader}>
                      <BookmarkIcon className={styles.bookmarkIcon} />
                      <h3 className={styles.title}>{bookmark.title}</h3>
                    </div>
                    <p className={styles.citation}>{bookmark.citation}</p>
                    {bookmark.note && (
                      <p className={styles.note}>{bookmark.note}</p>
                    )}
                  </div>
                  <div className={styles.openButtonContainer}>
                    <a
                      href={`/judgment/${bookmark.judgmentId}`}
                      className={styles.openButton}
                    >
                      Open
                    </a>
                  </div>
                </div>
              ))}
              {folder.bookmarks.length === 0 && (
                <p className={styles.emptyFolder}>
                  No bookmarks in this folder
                </p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Bookmarks;
