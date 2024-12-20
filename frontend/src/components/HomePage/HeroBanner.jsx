import React from "react";
import styles from "./HeroBanner.module.css";

const HeroBanner = () => {
  return (
    <section className={styles.heroSection}>
      <div className={styles.content}>
        <h1>We Fight for Right</h1>
        <p>
          We denounce with righteous indignation and dislike men who are beguiled
          and demoralized by the charms of pleasure.
        </p>
        <button className={styles.contactBtn}>Contact Us</button>
      </div>
    </section>
  );
};

export default HeroBanner;
