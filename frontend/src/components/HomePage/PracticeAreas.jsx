import React from "react";
import styles from "./PracticeAreas.module.css";

const PracticeAreas = () => {
  const areas = [
    { title: "Corporate Security", description: "Law is complex..." },
    { title: "Bankruptcy Law", description: "Guidance in debt..." },
    { title: "Education Law", description: "Supporting educators..." },
  ];

  return (
    <section className={styles.practiceSection}>
      <h2>Our Practice Areas</h2>
      <div className={styles.areaCards}>
        {areas.map((area, index) => (
          <div key={index} className={styles.card}>
            <h3>{area.title}</h3>
            <p>{area.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PracticeAreas;
