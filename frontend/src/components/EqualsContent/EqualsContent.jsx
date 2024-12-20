import React from "react";
import styles from "./EqualsContent.module.css";

const EqualsContent = ({ judgmentData }) => {

  if (!judgmentData) {
    return <div>No Equals Data Available</div>;
  }

  return (
    <div className={styles.scrollableText}>
      <div className={styles.left}>
      {judgmentData && judgmentData.EqualCitations && judgmentData.EqualCitations.length > 0 ? (
        judgmentData.EqualCitations.map((citation) => (
          <p key={citation.equalCitationId}>{citation.equalCitationText}</p>
        ))
      ) : (
        'No equal citations available'
      )}
    </div>
    </div>
  );
};

export default EqualsContent;