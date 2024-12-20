import React from "react";
import styles from "./AboutUs.module.css";
import bg from "../../assets/Homepage.jpg";

const AboutUs = () => {
  return (
    <section className={styles.aboutSection}>
      <div className={styles.container}>
        <div className={styles.imageWrapper}>
          <img
            src={bg}
            alt="John Mehta"
            className={styles.aboutImage}
          />
        </div>
        <div className={styles.textWrapper}>
          <h2>Welcome to Advokat Lawyers & Lawfirm</h2>
          <p>
            We denounce with righteous indignation and dislike men who are so
            beguiled and demoralized by the charms of pleasure, blinded by desire
            that cannot foresee the pain.
          </p>
          <p>
            In a free hour, when our power of choice is untrammeled, we do what we
            like best, every pleasure is to be welcomed.
          </p>
          <p className={styles.signature}>John Mehta - CEO & Founder</p>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
