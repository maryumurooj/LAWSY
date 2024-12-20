import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./LegislationInfo.module.css";

const LegislationInfo = ({ legislationInfo, searchTerm, bareActName }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(1); // Display 1 short note per page
  const [currentItems, setCurrentItems] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (legislationInfo && legislationInfo.shortNotes) {
      const totalItems = legislationInfo.shortNotes.length;
      setTotalPages(Math.ceil(totalItems / itemsPerPage));
      updateCurrentItems(1);
    }
  }, [legislationInfo, searchTerm, bareActName]);

  const updateCurrentItems = (pageNumber) => {
    if (legislationInfo && legislationInfo.shortNotes) {
      const indexOfLastItem = pageNumber * itemsPerPage;
      const indexOfFirstItem = indexOfLastItem - itemsPerPage;
      const itemsToDisplay = legislationInfo.shortNotes.slice(indexOfFirstItem, indexOfLastItem);
      setCurrentItems(itemsToDisplay);
    }
  };

  const getCitationsAndPartiesForCurrentNote = () => {
    const currentNoteIndex = currentPage - 1;
    if (legislationInfo && legislationInfo.shortNotes && legislationInfo.shortNotes[currentNoteIndex]) {
      const currentNote = legislationInfo.shortNotes[currentNoteIndex];
      return {
        citations: currentNote.judgmentCitations || [],
        parties: currentNote.judgmentParties || []
      };
    }
    return { citations: [], parties: [] };
  };

  const highlightSearchTerm = (text, searchTerm, bareActName) => {
    if (!text) return '';

    let highlightedText = text;

    // Highlight searchTerm
    if (searchTerm) {
      const searchTermRegex = new RegExp(`(${searchTerm})`, 'gi');
      highlightedText = highlightedText.replace(searchTermRegex, '<mark>$1</mark>');
    }

    // Highlight bareActName
    if (bareActName) {
      const bareActNameRegex = new RegExp(`(${bareActName})`, 'gi');
      highlightedText = highlightedText.replace(bareActNameRegex, '<mark>$1</mark>');
    }

    console.log('Highlighted Text:', highlightedText); // Debugging line

    return highlightedText;
  };

  const handleOpenClick = () => {
    const currentNoteIndex = currentPage - 1;
    if (legislationInfo && legislationInfo.shortNotes && legislationInfo.shortNotes[currentNoteIndex]) {
      const currentNote = legislationInfo.shortNotes[currentNoteIndex];
      if (currentNote.judgmentCitations && currentNote.judgmentCitations.length > 0) {
        const judgmentCitation = currentNote.judgmentCitations[0]; // Assuming you want to save the first citation
        localStorage.setItem('referredCitation', judgmentCitation);
      }
    }
    navigate('/index');
  };

  return (
    <div className={styles.legislationInfo}>
      {/* Horizontal Bar for Judgment Citations and Parties */}
      <div className={styles.citationsBar}>
        <div className={styles.citationsList}>
          {getCitationsAndPartiesForCurrentNote().citations.concat(getCitationsAndPartiesForCurrentNote().parties).map((item, index) => (
            <span key={index} className={styles.citationItem}>
              <span dangerouslySetInnerHTML={{ __html: highlightSearchTerm(item, searchTerm, bareActName) }} />
            </span>
          ))}
        </div>
        <button className={styles.openButton} onClick={handleOpenClick}>Open</button>
      </div>

      {/* Display Short Notes */}
      {currentItems.map((shortNote, index) => (
        <div key={index} className={styles.shortNote}>
          <div className={styles.shortNoteHeader}></div>
          <div className={styles.shortNoteText}>
            <span dangerouslySetInnerHTML={{ __html: highlightSearchTerm(shortNote.shortNoteText, searchTerm, bareActName) }} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default LegislationInfo;
