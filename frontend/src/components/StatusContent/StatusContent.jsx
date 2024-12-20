import React from "react";
import styles from "./StatusContent.module.css";

const StatusContent = ({ judgmentData, searchTerms }) => {
  const highlightText = (text) => {
    if (!searchTerms || searchTerms.length === 0) {
      return text;
    }

    const regex = new RegExp(`(${searchTerms.join('|')})`, 'gi');
    return text.replace(regex, (match) => `<span class=${styles.highlight}>${match}</span>`);
  };

  if (!judgmentData) {
    return <div>No Status Data Available</div>;
  }

  return (
    <div className={styles.scrollableText}>
      <h3>STATUS</h3>
      {judgmentData && judgmentData.JudgmentStatuses && judgmentData.JudgmentStatuses.length > 0 ? (
        judgmentData.JudgmentStatuses.map((status) => (
          <div key={status.judgmentStatusId} className={styles.statusItem}>
            <h3 dangerouslySetInnerHTML={{ __html: highlightText(status.judgmentStatusLinkCitation) }}></h3>
            <p dangerouslySetInnerHTML={{ __html: status.JudgmentStatusType ? highlightText(status.JudgmentStatusType.judgmentStatusTypeName) : '' }}></p>
          </div>
        ))
      ) : (
        <p>No status information available</p>
      )}
    </div>
  );
};

export default StatusContent;
