import styles from "./MainFooter.module.css";
import React from "react";
import { useNavigate } from "react-router-dom";

const MainFooter = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => () => {
    navigate(path);
  };

  const getClassName = (path) => {
    return window.location.pathname === path
      ? `${styles.navButton} ${styles.active}`
      : styles.navButton;
  };

  return (
    <div className={styles.container}>
      <div className={styles.footer}>
        <div className={styles.section}>
          <div className={styles.home}><button onClick={handleNavigation("/Home")}>Home</button></div>
          <div className={styles.about}><button onClick={handleNavigation("/About")}>About</button></div>
          <div className={styles.contacts}><button onClick={handleNavigation("/Contact")}>Contact Us</button></div>
          <div className={styles.FAQ}>
            <button onClick={handleNavigation("/FAQ")}>FAQ</button>
          </div>
        </div>
        <div className={styles.section}>
          <div className={styles.index1}><button>Index</button></div>
          <div className={styles.judges}><button onClick={handleNavigation("/CaseFinder")}>Case Finder</button></div>
          <div className={styles.updates1}><button onClick={handleNavigation("/Statutes")}>Statutes</button></div>
          <div className={styles.statutes}><button>Articles</button></div>
          <div className={styles.articles}><button>Judges</button></div>
        </div>
        <div className={styles.section}>
          <div style={{ width: "100%" }}>
            <iframe
              width="100%"
              height="140"
              src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=en&amp;q=No.%2021,%20Ald%20Publications,%201-990,%20Ghansi%20Bazaar,%20Hyderabad,%20Telangana%20500066+(ALD%20Publications)&amp;t=&amp;z=17&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
              title="ALD Publications Location"
            ></iframe>
          </div>
          <div className={styles.address}>
            Gate No. 5, 21-1-985, opp. High Court Road, Ghansi Bazaar,
            Hyderabad, Telangana 500002 <br/>
            Ph: 8374289998, 8374389998

          </div>
          
        </div>
      </div>
    </div>
  );
};

export default MainFooter;
