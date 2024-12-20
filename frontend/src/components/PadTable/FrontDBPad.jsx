import React from "react";
import styles from "./FrontDBPad.module.css"; // Import CSS module

function FrontDBPad({ clearData, printPadTable }) {
  const items = ["Print", "Preview", "Clear"];

  return (
    <div className={styles.dashboard}>
      <div className={styles.content}>
        {items.map((item, index) => (
          <React.Fragment key={index}>
            <button
              className={styles.textButton}
              onClick={() => {
                if (item === "Clear") {
                  clearData();
                } else if (item === "Print") {
                  printPadTable();
                }
              }}
            >
              {item}
            </button>
            {index < items.length - 1 && (
              <span className={styles.divider}>|</span>
            )}
          </React.Fragment>
        ))}
      </div>
      {/* Rectangle with curved edges */}
      <div className={styles.rectangle}></div>
    </div>
  );
}

export default FrontDBPad;
