import React from "react";
import styles from "./RearDBS.module.css";

function RearDBS({ onSectionClick, currentPage, totalPages, handleNext, handlePrev }) {
  const items = ["Citations", "Amendments", "Table", "←", " ", "→"];

  return (
    <div className={styles.dashboard}>
      <div className={styles.content}>
        {items.map((item, index) => (
          <React.Fragment key={index}>
            {item === "←" ? (
              <button
                className={styles.textButton}
                onClick={handlePrev}
                disabled={currentPage === 1}
              >
                {item}
              </button>
            ) : item === "→" ? (
              <button
                className={styles.textButton}
                onClick={handleNext}
                disabled={currentPage === totalPages}
              >
                {item}
              </button>
            ) : item === " " ? (
              <span className={styles.pageIndicator}>
                Page {currentPage} of {totalPages}
              </span>
            ) : (
              <button
                className={styles.textButton}
                onClick={() => onSectionClick(item)}
              >
                {item}
              </button>
            )}
          </React.Fragment>
        ))}
      </div>
      <div className={styles.rectangle}></div>
    </div>
  );
}

export default RearDBS;
