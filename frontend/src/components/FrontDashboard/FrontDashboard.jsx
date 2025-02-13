import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./FrontDashboard.module.css";
import { useAuth } from "../../services/AuthContext";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { PDFViewer, PDFDownloadLink, pdf } from "@react-pdf/renderer";
import MyJudgmentDocument from "../PrintComps/judgmentprintcomp";
import aldlogo from "../../assets/DASHTitle/ALDONLINELOGOTITLE.png";

const FrontDashboard = ({
  onItemSelect,
  onZoom,
  onPrint,
  activeContent,
  judgmentData,
}) => {
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState("headnotes");
  const [isBookmarkModalOpen, setBookmarkModalOpen] = useState(false); // State for modal visibility
  const [folderName, setFolderName] = useState("");
  const [bookmarkTitle, setBookmarkTitle] = useState("");
  const [bookmarkNote, setBookmarkNote] = useState("");
  const { user, subscriptionStatus } = useAuth();
  const [selectedFolderId, setSelectedFolderId] = useState("");
  const [existingFolders, setExistingFolders] = useState([]);

  const [url, setUrl] = useState(""); // For URL
  const [show, setShow] = useState(false);

  const handleClose = () => {
    navigate("/auth");
  };
  const handleShow = () => setShow(true);

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
    if (!user && judgmentData && key != "headnotes") {
      handleShow(); // Redirect to login if not logged in
      return;
    }

    if (key === "plus" || key === "minus") {
      onZoom(key);
    } else if (key === "print") {
      if (user) {
        handlePrint();
      } else handleShow();
    } else if (key === "pad") {
      if (user) {
        navigate("/pad");
      } else handleShow();
    } else if (key === "bookmark") {
      if (!user) {
        handleShow(); // Dont Open the modal
      } else {
        setBookmarkModalOpen(true); // Open the modal
      }
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

    if (!bookmarkTitle.trim()) {
      alert("Bookmark title is required!");
      return;
    }

    const bookmarkData = {
      title: bookmarkTitle.trim(),
      note: bookmarkNote.trim(),
      url: window.location.href, // Get current URL
      folder_name: folderName.trim() || null,
      folder_id: selectedFolderId || null,
      parent_folder_id: null,
      uid: user.uid,
      judgmentId: judgmentData.judgmentId,
    };

    try {
      const response = await fetch("http://localhost:3000/api/bookmarks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookmarkData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Bookmark added successfully!");
        handleModalClose();
      } else {
        alert(`Failed to add bookmark: ${data.message}`);
      }
    } catch (err) {
      console.error("Error creating bookmark:", err);
      alert("Failed to add bookmark. Please try again.");
    }
  };

  useEffect(() => {
    if (isBookmarkModalOpen) {
      fetchFolders(); // Fetch folders when the modal opens
    }
  }, [isBookmarkModalOpen]);

  const renderFolderOptions = (folders, level = 0) => {
    return folders.map((folder) => (
      <React.Fragment key={folder.id}>
        <option value={folder.id}>
          {"\u00A0".repeat(level * 2)}
          {folder.folder_name}
        </option>
        {folder.children && renderFolderOptions(folder.children, level + 1)}
      </React.Fragment>
    ));
  };

  const handleParentFolderChange = (folderId) => {
    setSelectedFolderId(folderId);
    // Clear folder name if selecting an existing folder
    if (folderId) {
      setFolderName("");
    }
  };

  const fetchFolders = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/folders?uid=${user.uid}`
      );
      const data = await response.json();

      if (data.success) {
        // Convert flat array to hierarchical structure
        const folders = data.folders;
        const folderMap = {};
        const rootFolders = [];

        // First pass: create folder objects
        folders.forEach((folder) => {
          folderMap[folder.id] = {
            ...folder,
            children: [],
          };
        });

        // Second pass: establish hierarchy
        folders.forEach((folder) => {
          if (folder.parent_id && folderMap[folder.parent_id]) {
            folderMap[folder.parent_id].children.push(folderMap[folder.id]);
          } else {
            rootFolders.push(folderMap[folder.id]);
          }
        });

        setExistingFolders(rootFolders);
      } else {
        console.error("Failed to fetch folders:", data.message);
        setExistingFolders([]);
      }
    } catch (error) {
      console.error("Failed to fetch folders:", error);
      setExistingFolders([]);
    }
  };

  const renderFolderSelect = () => {
    if (existingFolders.length === 0) {
      return (
        <select disabled>
          <option>No folders available</option>
        </select>
      );
    }

    return (
      <select
        value={selectedFolderId || ""}
        onChange={(e) => handleParentFolderChange(e.target.value)}
      >
        <option value="">-- None (Top Level) --</option>
        {renderFolderOptions(existingFolders)}
      </select>
    );
  };

  const generateNewCitation = (originalCitation, judgmentData) => {
    // Ensure judgmentData is defined and has the expected structure
    if (!judgmentData || !judgmentData.judgmentDOJ) {
      console.error("Invalid judgmentData:", judgmentData);
      return null;
    }

    // Extract year from judgmentDOJ (assuming format is ddmmyyyy)
    const year = judgmentData.judgmentDOJ.slice(-4); // Get last 4 characters

    // Create base citation
    let newCitation = `${year} ALD Online`;

    // Add citation serial number if available
    if (judgmentData.citationSerialNo) {
      newCitation += ` ${judgmentData.citationSerialNo}`;
    }

    // Extract court info from original citation
    const courtInfo = originalCitation.match(/\(([^0-9)]+)\)/g);
    if (courtInfo) {
      newCitation += ` ${courtInfo.join(" ")}`;
    }

    return newCitation.trim(); // Remove any leading/trailing whitespace
  };

  //print
  const handlePrint = () => {
    if (judgmentData) {
      const printWindow = window.open("", "", "height=800,width=800");
      const currentTime = new Date().toLocaleString("en-US", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

      printWindow.document.write(`
        <html>
        <head>
          <title>ALD Online</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
            }

            table {
              width: 100%;
              border-collapse: collapse;
            }

            thead {
              display: table-header-group;
            }

            tbody {
              display: table-row-group;
            }

            .header-cell {
              padding: 20px 40px;
              background-color: white;
              border-bottom: none;
            }

            .header-content {
              display: flex;
              justify-content: space-between;
              align-items: center;
            }

            .title-image {
              width: 170px;
              height: auto;
            }

            .timestamp {
              font-size: 10px;
              color: #666;
            }
            .username {
              font-size: 10px;
              color: #666;
            }

            .contentcell {
              padding: 20px;
            }

            .container {
              height: auto;
              font-size: 12px;
              line-height: 1.5;
              text-align: justify;
              width: 90%;
              max-width: 1080px;
              margin: 0 auto;
              border: none;
              padding: 0;
            
            }

            .metadata {
              text-align: center !important;
              margin: 0;
            }

            .metadata h4 {
              text-align: center !important;
              font-weight: bold;
              font-size: 14px;
            }

            .metadata p, 
            .metadata div {
              text-align: center !important;
              margin: 10px 0;
            }

            h2, h3, h4, h5 {
              text-align: center !important;
              font-weight: bold;
            }

            h2 {
              font-size: 16px;
            }

            h3 {
              font-size: 15px;
            }

            h4 {
              font-size: 14px;
            }

            h5 {
              font-size: 13px;
            }

            .container .shortnote {
              width: 100%;
            }

            .container h4 {
              text-align: center !important;
              font-weight: bold;
              font-size: 14px;
            }

            .container .shortnote p {
              text-align: left;
              line-height: 1.5;
            }

            .container .longnote p {
              text-align: left;
              line-height: 1.5;
            }
            .notessection {
              text-align: left;
            }

            @page {
              margin: 10mm;
              @bottom-right {
                content: counter(page);
              }
            }

            .page-number {
              position: running(pageNumber);
              text-align: right;
            }

            .footer {
              position: fixed;
              bottom: 20px;
              left: 50%;
              transform: translateX(-50%);
              font-size: 12px;
              color: #666;
              text-align: center;
            }

            @media print {
              thead {
                display: table-header-group;
              }
              tbody {
                display: table-row-group;
              }
              .container {
                box-shadow: none;
                border: none;
                background-color: white;
              }
              .para-wrapper {
                page-break-inside: avoid !important;
               
              }
              h2, h3, h4, h5 {
                 page-break-inside: avoid !important;
                break-inside: avoid !important;
                -webkit-column-break-inside: avoid !important;
              }

              .footer {
                position: fixed;
                bottom: 5px;
                left: 50%;
                font-size: 12px;
                color: #666;
                text-align: center;
              }
              .footer-cell {
                padding: 10px;
                text-align: center;
                font-size: 12px;
                color: #666;
                display: flex;
                justify-content: space-between;
              }
            }
          </style>
        </head>
        <body>
          <div class="page-number"></div>
          
          <table>
            <thead>
              <tr>
                <td class="header-cell">
                  <div class="header-content">
                    <img class="title-image" src=${aldlogo} alt="ALD Online" />
                                          

                    <span class="timestamp">${currentTime}</span>
                  </div>
                </td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="contentcell">
                  <div class="container">
                    
                    
                    <!-- Metadata Section -->
                    <div class="metadata">
                      <div style="font-weight: bold;">${
                        generateNewCitation(
                          judgmentData.judgmentCitation,
                          judgmentData
                        ) || ""
                      }</div>
                      <div style="font-weight: bold;">${
                        judgmentData.judgmentCitation || ""
                      }</div>
                      <div style="font-weight: bold;">${
                        judgmentData.judgmentCourtText || ""
                      }</div>
                      <div style="font-weight: bold;">${
                        judgmentData.judgmentJudges || ""
                      }</div>
                      <div style="font-weight: bold;">${
                        judgmentData.judgmentDOJ
                          ? formatDate(judgmentData.judgmentDOJ)
                          : ""
                      }</div>
                      <div style="font-weight: lighter !important;">${
                        judgmentData.judgmentNoText || ""
                      }</div>
                      <div style="font-weight: lighter !important;">${
                        judgmentData.judgmentParties || ""
                      }</div>
                    </div>

                    <!-- Notes Section (Separate from metadata) -->
                    <div class="notessection" style="padding: 0; margin: 0;">
                    ${
                      judgmentData.ShortNotes &&
                      judgmentData.ShortNotes.length > 0
                        ? judgmentData.ShortNotes.map(
                            (shortNote) => `
                          <div class="shortnote">
                            <h4 style="text-align: justify !important;">${
                              shortNote.shortNoteText
                            }</h4>
                            ${
                              shortNote.LongNotes
                                ? shortNote.LongNotes.map(
                                    (longNote) => `
                              <div class="longnote">
                                ${longNote.LongNoteParas.map(
                                  (para) => `
                                  <p style="text-align: justify !important;">${para.longNoteParaText}</p>
                                `
                                ).join("")}
                              </div>
                            `
                                  ).join("")
                                : ""
                            }
                          </div>
                        `
                          ).join("")
                        : ""
                    }

                    <div>
                      ${
                        judgmentData.judgmentPetitionerCouncil
                          ? `<h5 style="text-align: left !important;">Petitioner Counsel: ${judgmentData.judgmentPetitionerCouncil}</h5>`
                          : ""
                      }
                      ${
                        judgmentData.judgmentRespondentCouncil
                          ? `<h5 style="text-align: left !important;">Respondent Counsel: ${judgmentData.judgmentRespondentCouncil}</h5>`
                          : ""
                      }
                      ${
                        judgmentData.judgmentRespondentCouncil
                          ? `<h5 style="text-align: left !important;">Appeared Counsel: ${judgmentData.judgmentRespondentCouncil}</h5>`
                          : ""
                      }
                    </div>
                    </div>

                    <div class="judgment-section">  
                    
                      ${judgmentData.JudgmentTexts.map((text) =>
                        text.judgmentsCiteds && text.judgmentsCiteds.length > 0
                          ? `<div class="cases-cited">
                              <h4>Cases Cited:</h4>
                              <ul>
                                ${text.judgmentsCiteds
                                  .map(
                                    (citation) => `
                                  <li>
                                    ${citation.judgmentsCitedParties} 
                                    ${citation.judgmentsCitedRefferedCitation}
                                    ${
                                      citation.judgmentsCitedEqualCitation
                                        ? `, ${citation.judgmentsCitedEqualCitation}`
                                        : ""
                                    }
                                  </li>
                                `
                                  )
                                  .join("")}
                              </ul>
                            </div>`
                          : ""
                      ).join("")}
                      <h3>JUDGMENT</h3>
                      ${judgmentData.JudgmentTexts.map((text) =>
                        text.JudgmentTextParas.map(
                          (para) => `
                          <div class="para-wrapper">
                            <div class="para-row">
                              
                              <div class="text-col">
                                ${
                                  para.judgementTextParaText.includes("<table")
                                    ? para.judgementTextParaText
                                    : `<p>${para.judgementTextParaText}</p>`
                                }
                              </div>
                            </div>
                          </div>
                        `
                        ).join("")
                      ).join("")}

                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td class="footer-cell">
                  <div>Licensed to ${user.displayName || "User"}</div>
                  <div>Copyright © Andhra Legal Decisions</div>
                </td>
              </tr>
            </tfoot>
          </table>
        </body>
        </html>
      `);

      // Helper function to format date
      function formatDate(dateString) {
        const months = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ];

        const day = parseInt(dateString.substring(0, 2), 10);
        const monthIndex = parseInt(dateString.substring(2, 4), 10) - 1;
        const year = parseInt(dateString.substring(4), 10);

        function toOrdinal(num) {
          const suffixes = ["th", "st", "nd", "rd"];
          const v = num % 100;
          return num + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
        }

        return `${toOrdinal(day)} day of ${months[monthIndex]}, ${year}`;
      }

      printWindow.document.close();
      printWindow.focus();

      printWindow.onload = () => {
        printWindow.print();
        printWindow.onafterprint = () => {
          printWindow.close();
        };
      };
    }
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles.content}>
        {items.map((item, index) => (
          <button
            key={index}
            className={`${styles.textButton} ${
              activeItem === item.key ? styles.active : ""
            }`}
            onClick={() => handleClick(item.key)}
          >
            {item.name}
          </button>
        ))}
      </div>

      {/* Modal for Bookmark Form */}
      {isBookmarkModalOpen && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Create Bookmark</h2>
            <form onSubmit={handleFormSubmit}>
              <label>
                Select Folder:
                {renderFolderSelect()}
              </label>

              {/* Show folder name input only if no folder is selected */}
              {!selectedFolderId && (
                <label>
                  New Folder Name:
                  <input
                    type="text"
                    value={folderName}
                    onChange={(e) => setFolderName(e.target.value)}
                    placeholder="Enter new folder name"
                  />
                </label>
              )}

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

      <Modal
        show={show}
        backdrop="static"
        keyboard={false}
        closeButton
        centered
      >
        <Modal.Header closeButton={false}>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Woohoo, you need to be a User to Acesses this Feature!
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Sign Up
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Login
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default FrontDashboard;
