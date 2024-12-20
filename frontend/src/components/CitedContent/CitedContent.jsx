import React from "react";
import styles from "./CitedContent.module.css";

const CitedContent = ({ judgmentData, searchTerms }) => {
  const highlightText = (text, searchTerms) => {
    if (!text || !searchTerms || !searchTerms.length) {
      console.log("Text or searchTerms are undefined or empty:", text, searchTerms);
      return text;
    }

    console.log("Highlighting text:", text);

    const regexPattern = searchTerms.map(term => term.replace(/[()]/g, '\\$&')).join('|');
    const regex = new RegExp(`(${regexPattern})`, 'gi');

    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? <mark key={index}>{part}</mark> : part
    );
  };

  if (!judgmentData) {
    return <div>No Citied Data Available</div>;
  }

  return (
    <div className={styles.scrollableText}>
      <h3>CASES CITED</h3>
      {judgmentData && judgmentData.JudgmentTexts ? (
        judgmentData.JudgmentTexts.map((text) => (
          <div key={text.judgementTextId}>
            <p>{highlightText(text.judgementTextParaText, searchTerms)}</p>
            {text.judgmentsCiteds && text.judgmentsCiteds.length > 0 ? (
              <div style={{ textAlign: 'left' }}>
                <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
                  {text.judgmentsCiteds.map((citation, index) => (
                    <li key={index}>
                      {highlightText(citation.judgmentsCitedParties, searchTerms)}
                      {highlightText(citation.judgmentsCitedEqualCitation, searchTerms)}
                      {citation.judgmentsCitedRefferedCitation &&
                        ` = ${highlightText(citation.judgmentsCitedRefferedCitation, searchTerms)}`}
                      {citation.judgmentsCitedParaLink &&
                        ` (${highlightText(citation.judgmentsCitedParaLink, searchTerms)})`}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p>Citations not available</p>
            )}
          </div>
        ))
      ) : (
        'No Cited Information available'
      )}
    </div>
  );
};

export default CitedContent;
