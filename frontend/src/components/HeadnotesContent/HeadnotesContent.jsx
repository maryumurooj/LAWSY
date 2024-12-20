import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';
import styles from "./HeadnotesContent.module.css";
import { useAuth } from '../../services/AuthContext'; // Assuming subscription info is available here

const HeadnotesContent = ({ judgmentData, searchTerms = [], onScroll }) => {
  const { user, subscriptionStatus } = useAuth(); // Assuming subscriptionStatus is part of the auth context
  const navigate = useNavigate();
  const scrollableDivRef = useRef(null);
  const [hasScrolled, setHasScrolled] = useState(false);
  const scrollThreshold = 80; // Allow 150px of scrolling before redirecting

  useEffect(() => {
    const scrollableDiv = scrollableDivRef.current;

    const handleScroll = () => {
      onScroll && onScroll(); // Call the onScroll prop if it's provided

      if (!user) {
        // If the user is not logged in, redirect to the auth page
        const scrollTop = scrollableDiv.scrollTop;
        if (scrollTop > scrollThreshold && !hasScrolled) {
          setHasScrolled(true);
          navigate('/auth');
        }
        else if (subscriptionStatus !== 'active') {
          navigate('/subscription-tier');  // Redirect to subscription page
        } else {
          setActiveContent(content);  // Set the selected content if conditions are met
        }
      
      }
    };

    if (scrollableDiv) {
      scrollableDiv.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (scrollableDiv) {
        scrollableDiv.removeEventListener("scroll", handleScroll);
      }
    };
  }, [onScroll, user, subscriptionStatus, navigate, hasScrolled]);

  // Format date function (unchanged)
  const formatDate = (dateString) => {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    const day = parseInt(dateString.substring(0, 2), 10);
    const monthIndex = parseInt(dateString.substring(2, 4), 10) - 1;
    const year = parseInt(dateString.substring(4), 10);

    const formattedDate = `${toOrdinal(day)} day of ${months[monthIndex]}, ${year}`;
    return formattedDate;
  };

  const toOrdinal = (num) => {
    const suffixes = ["th", "st", "nd", "rd"];
    const v = num % 100;
    return num + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
  };

  const highlightText = (text, searchTerms) => {
    if (!text || !Array.isArray(searchTerms) || !searchTerms.length) return text;

    const regexPattern = searchTerms.map(term => term.replace(/[()]/g, '\\$&')).join('|');
    const regex = new RegExp(`(${regexPattern})`, 'gi');

    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? <mark key={index}>{part}</mark> : part
    );
  };

  return (
    <div ref={scrollableDivRef} className={styles.scrollableText}>
      <div>
        <h3>HEADNOTES</h3>
        {judgmentData && judgmentData.ShortNotes && judgmentData.ShortNotes.length > 0 ? (
          judgmentData.ShortNotes.map((shortNote) => (
            <div key={shortNote.shortNoteId}>
              <h4>{highlightText(shortNote.shortNoteText, searchTerms)}</h4>
              {shortNote.LongNotes.map((longNote) => (
                <div key={longNote.longNoteId}>
                  {longNote.LongNoteParas.map((longNotePara) => (
                    <p key={longNotePara.longNoteParaId}>
                      {highlightText(longNotePara.longNoteParaText, searchTerms)}
                    </p>
                  ))}
                </div>
              ))}
            </div>
          ))
        ) : (
          ''
        )}
      </div>
    </div>
  );
};

export default HeadnotesContent;
