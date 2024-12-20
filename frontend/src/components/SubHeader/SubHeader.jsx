import React from 'react';
import styles from './SubHeader.module.css'; // Ensure this import points to the correct CSS file

function SubHeader({ judgmentData, onToggleFullScreen, isFullScreen }) { // Add isFullScreen as a prop
  return (
    <div className={styles.frame}>
      <div className={styles.textBlock}>
        <div className={styles.citation}>
          {judgmentData ? judgmentData.judgmentCitation : null}
        </div>
        <div className={styles.caseTitle}>
          {judgmentData ? judgmentData.judgmentParties : null}
        </div>
      </div>
      <button 
        className={styles.fullScreenButton} 
        onClick={onToggleFullScreen}
      >
        {isFullScreen ? 'Exit Full Screen' : 'Full Screen'} {/* Toggle text based on state */}
      </button>
    </div>
  );
}

export default SubHeader;
