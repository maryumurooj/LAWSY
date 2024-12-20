import React, { useState, useEffect } from "react";
import styles from "./Statutes.module.css";
import FrontDBS from "../components/Statutes/FrontDBS";
import RearDBS from "../components/Statutes/RearDBS";
import SidePanel from "../components/SidePanel/StatuesSidePanel";
import LegislationInfo from "../components/StatuesInfo/LegislationInfo";
import parse from "html-react-parser";

const Statutes = () => {
  const [topHtmlContent, setTopHtmlContent] = useState('');
  const [bottomHtmlContent, setBottomHtmlContent] = useState(null);
  const [bareActIndex, setBareActIndex] = useState('');
  const [Legislation, setLegislation] = useState([]);

  const updateTopHtmlContent = (index) => {
    const fetchedHtml = `
      <div class="${styles.scrollableContent}">
        <p>${index}</p>
      </div>
    `;
    setTopHtmlContent(fetchedHtml);
    setBareActIndex(index);
    // Reset bottom frame content
    setBottomHtmlContent(null);
  };

  const updateBottomHtmlContent = (content) => {
    setBottomHtmlContent(content);
  };

  const handleSectionClick = (section) => {
    if (section === "Citations") {
      setLegislation(setLegislation);
      console.log('Setting bottomHtmlContent with LegislationInfo:', Legislation);
      updateBottomHtmlContent(<LegislationInfo legislationInfo={Legislation} />);
    } else {
      updateBottomHtmlContent(<p>{section}</p>);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setTopHtmlContent('<p>No Results Found.</p>');
    }, 1000);
  }, []);

  const handleLinkClick = (e) => {
    e.preventDefault();
    const hrefData = e.target.getAttribute('data-href');
    if (hrefData) {
      updateBottomHtmlContent(hrefData);
    }
  };

  const handleClearAll = () => {
    setTopHtmlContent('');
    setBottomHtmlContent(null);
  };

  return (
    <div className={styles.fullcontainer}>
      <SidePanel 
        onBareActSelect={updateTopHtmlContent} 
        onSectionSelect={updateTopHtmlContent} 
        setLegislation={setLegislation}
        onClear={handleClearAll}
      />
      <div className={styles.frame}>
        <div className={styles.topframe}>
          <FrontDBS />
          <div className={`${styles.textStyles} ${styles.scrollableContent}`}>
            {topHtmlContent && <div>{parse(topHtmlContent)}</div>}
          </div>
        </div>
        <div className={styles.bottomframe}>
          <RearDBS onSectionClick={handleSectionClick} />
          <div className={`${styles.textStyles} ${styles.scrollableContent}`}>
            {bottomHtmlContent}
          </div>
        </div>
        <div className={styles.pagebox}></div>
      </div>
    </div>
  );
};

export default Statutes;
