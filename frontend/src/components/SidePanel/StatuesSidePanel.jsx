import React, { useState, useEffect } from "react";
import axios from "../../axios";
import styles from "./SSPanel.module.css";

function SidePanel({ onBareActSelect, onSectionSelect, setLegislation, setSearchTerm, setSelectedBareActProp, setDefaultSection, setUniqueResults  }) {
  const [bareActs, setBareActs] = useState([]);
  const [selectedBareAct, setSelectedBareAct] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [sectionFilter, setSectionFilter] = useState("");
  const [selectedSection, setSelectedSection] = useState(""); // State for selected section name
  const [searchTerms, setSearchTerms] = useState([]);
  const [judgmentCount, setJudgmentCount] = useState(0);



  useEffect(() => {
    async function fetchBareActs() {
      try {
        const response = await axios.get("/api/all-bareacts");
        setBareActs(response.data.map((bareAct) => bareAct.bareActName));
      } catch (error) {
        console.error("Error fetching bare act names:", error);
      }
    }

    fetchBareActs();
  }, []);

  const handleInputChange = (event) => {
    const { value } = event.target;
    setInputValue(value);
  };

  const handleBareActClick = async (bareActName) => {
    try {
      // Fetch bare act results
      const response = await axios.get("/api/search-bareacts", {
        params: { bareActName },
      });
  
      const results = response.data;
  
      if (results && results.length > 0) {
        const result = results[0];
        console.log("Fetched Data:", result);
  
        setSearchResults(result);
        setSelectedBareAct(bareActName);
        setInputValue(bareActName);
        onBareActSelect(result.bareActIndex);
        setLegislation(result.legislation);
        setSelectedBareActProp(bareActName);
  
        // Fetch legislation details
        const searchResponse = await fetch(
          `http://localhost:3000/api/search?legislationName=${bareActName}&section=${result.section || ''}&subsection=${result.subsection || ''}`
        );
        if (!searchResponse.ok) {
          throw new Error('Network response was not ok');
        }
  
        const data = await searchResponse.json();
  
        // Remove duplicates based on `judgmentId`
        const citationResults = Array.from(new Set(data.map(item => item.judgmentId)))
          .map(judgmentId => data.find(item => item.judgmentId === judgmentId));
  
        console.log("Fetched Search Results:", citationResults);
        setUniqueResults(citationResults);
  
        // Highlight search terms
        const sectionHighlight = text => text.replace(/[()]/g, '\\$&').split('|').join('');
  
        setSearchTerms([
          bareActName,
          sectionHighlight(result.section || ''), // Apply custom highlighting to the section term
          result.subsection || ''
        ].filter(term => term));
  
        // Update judgment count
        setJudgmentCount(citationResults.length);
      } else {
        console.warn("No data found for the given bareActName.");
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  const handleSectionFilterChange = (event) => {
    const { value } = event.target;
    setSelectedSection(value); // Update selectedSection with typed value
    setSectionFilter(value.toLowerCase()); // Convert to lowercase for case-insensitive search
  };

  const handleClear = () => {
    setInputValue("");
    setSearchResults(null); // Reset search results to null or [] depending on your implementation
    setSelectedBareAct(""); // Reset selected bare act
    setSectionFilter("");
    onSectionSelect("");
    setSelectedSection(""); // Reset selected section name
    setLegislation([]); // Reset legislation data
    setSearchTerm(''); // Clear search term in parent component
    setSelectedBareActProp('');

  };

  const handleSectionClick = (section) => {
    const sectionName = `${section.sectionPrefix} ${section.sectionNo}${section.sectionName ? ' - ' + section.sectionName : ''}`;
    setSelectedSection(sectionName); // Concatenate prefix and name
    onSectionSelect(section.sectionText); // Pass section name instead of text
    setSearchTerm(`${section.sectionPrefix} ${section.sectionNo}`); // Set the search term in parent component
    setSelectedBareActProp(selectedBareAct);

  };

  const handleFormClick = (form) => {
    onSectionSelect(form.formHTML);
    setSearchTerm(form.formName); // Set the search term in parent component
    setSelectedBareActProp(selectedBareAct);
  };

  const handleScheduleClick = (schedule) => {
    onSectionSelect(schedule.scheduleHTML);
    setSearchTerm(schedule.scheduleName); // Set the search term in parent component
    setSelectedBareActProp(selectedBareAct);

  };

  const handleNotificationClick = (notification) => {
    onSectionSelect(notification.notificationHTML);
    setSearchTerm(notification.notificationName); // Set the search term in parent component
    setSelectedBareActProp(selectedBareAct);
  };

  const filteredBareActs = bareActs.filter((bareAct) =>
    bareAct.toLowerCase().includes(inputValue.toLowerCase())
  );

  const filteredResults = searchResults
    ? {
        sections: searchResults.sections.filter((section) =>
          section.sectionPrefix.toLowerCase().includes(sectionFilter) ||
          section.sectionNo.toLowerCase().includes(sectionFilter) ||
          (section.sectionName &&
            section.sectionName.toLowerCase().includes(sectionFilter))
        ),
        forms: searchResults.forms.filter((form) =>
          form.formName.toLowerCase().includes(sectionFilter)
        ),
        notifications: searchResults.notifications.filter((notification) =>
          notification.notificationName.toLowerCase().includes(sectionFilter)
        ),
        schedules: searchResults.schedules.filter((schedule) =>
          schedule.scheduleName.toLowerCase().includes(sectionFilter) ||
          schedule.scheduleHTML.toLowerCase().includes(sectionFilter)
        ),
      }
    : null;

  return (
    <div className={styles.sidebar}>
      <div className={styles.panelOutline}>
        <div className={styles.subcontainer}>
          <div className={styles.subitem}>
            <div className={styles.rectanglesubjectindex}></div>
            STATUTES
          </div>
          <div className={styles.subitem}>
            <input
              type="text"
              placeholder="Search or select ACT"
              className={styles.searchInput}
              value={inputValue}
              onChange={handleInputChange}
            />
          </div>
          <div className={styles.subitem}>
            <input
              type="text"
              placeholder="Search or select SECTION"
              className={styles.searchInput}
              value={selectedSection} // Display selected section name here
              onChange={handleSectionFilterChange}
            />
          </div>
          
          <button
            className={styles.clearButton}
            onClick={handleClear}
          >
            Clear
          </button>
          
          <div className={styles.searchResults}>
            <div className={styles.resultContainer}>
              {searchResults ? (
                <div className={styles.resultContainer}>
                  {filteredResults.sections.map((section, secIndex) => (
                    <div
                      key={`sec-${secIndex}`}
                      className={styles.section}
                      onClick={() => handleSectionClick(section)}
                    >
                      {`${section.sectionPrefix} ${section.sectionNo}${section.sectionName ? ' - ' + section.sectionName : ''}`}
                    </div>
                  ))}
                  {filteredResults.forms.map((form, formIndex) => (
                    <div
                      key={`form-${formIndex}`}
                      className={styles.form}
                      onClick={() => handleFormClick(form)}
                    >
                      {form.formName}
                    </div>
                  ))}
                  {filteredResults.notifications.map((notification, notifIndex) => (
                    <div
                      key={`notif-${notifIndex}`}
                      className={styles.notification}
                      onClick={() =>
                        handleNotificationClick(notification)
                      }
                    >
                      {notification.notificationName}
                    </div>
                  ))}
                  {filteredResults.schedules.map((schedule, schedIndex) => (
                    <div
                      key={`sched-${schedIndex}`}
                      className={styles.schedule}
                      onClick={() => handleScheduleClick(schedule)}
                    >
                      {schedule.scheduleName}
                    </div>
                  ))}
                </div>
              ) : (
                filteredBareActs.map((bareActName, index) => (
                  <div
                    key={index}
                    className={`${styles.bareActName} ${
                      bareActName === selectedBareAct ? styles.active : ""
                    }`}
                    onClick={() => handleBareActClick(bareActName)}
                  >
                    {bareActName}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SidePanel;
