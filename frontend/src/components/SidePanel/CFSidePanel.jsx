import React, { useState, useEffect } from "react";
import styles from "./CFSidePanel.module.css";

function SidePanel({ setResults, setJudgmentCount, setError }) {
  const [section, setSection] = useState('');
  const [subsection, setSubsection] = useState('');
  const [judge, setJudge] = useState('');
  const [advocate, setAdvocate] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [court, setCourt] = useState('');
  const [publication, setPublication] = useState('');
  const [acts, setActs] = useState([]);
  const [legislationName, setLegislationName] = useState('');
  const [legislationNames, setLegislationNames] = useState([]);
  const [sections, setSections] = useState([]);
  const [subsections, setSubsections] = useState([]);
  const [topicName, setTopicName] = useState('');
  const [topics, setTopics] = useState([]);
  const [judges, setJudges] = useState([]);
  const [judgeName, setJudgeName] = useState('');
  const [advocates, setAdvocates] = useState([]);
  const [advocateName, setAdvocateName] = useState('');
  const [sectionName, setSectionName] = useState('');
  const [subsectionName, setSubsectionName] = useState('');
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [words, setWords] = useState([]);
  const [wordName, setWordName] = useState('');
  const [addedWords, setAddedWords] = useState([]);
  const [sectionList, setSectionList] = useState([]);
  const [subsectionList, setSubsectionList] = useState([]);
  const [advocateList, setAdvocateList] = useState([]);
  const [topicList, setTopicList] = useState([]);
  const [judgeList, setJudgeList] = useState([]);


  const handleAddAct = () => {
    if (legislationName.trim() !== '') {
      setActs([...acts, legislationName.trim()]);
      setLegislationName('');
    }
  };

  const handleAddSection = () => {
    if (sectionName.trim() !== '') {
      setSections([...sections, sectionName.trim()]);
      setSectionName('');
    }
  };

  const handleAddSubsection = () => {
    if (subsectionName.trim() !== '') {
      setSubsections([...subsections, subsectionName.trim()]);
      setSubsectionName('');
    }
  };

  const handleAddTopic = () => {
    if (topicName.trim() !== '') {
      setTopics([...topics, topicName.trim()]);
      setTopicName('');
    }
  };

  const handleAddJudge = () => {
    if (judgeName.trim() !== '') {
      setJudges([...judges, judgeName.trim()]);
      setJudgeName('');
    }
  };

  const handleAddAdvocate = () => {
    if (advocateName.trim() !== '') {
      setAdvocates([...advocates, advocateName.trim()]);
      setAdvocateName('');
    }
  };

  const handleAdvancedSearch = async () => {
    try {
      const searchParams = new URLSearchParams();

      acts.forEach((act, index) => searchParams.append(`acts[${index}]`, act));
      sections.forEach((section, index) => searchParams.append(`sections[${index}]`, section));
      subsections.forEach((subsection, index) => searchParams.append(`subsections[${index}]`, subsection));
      topics.forEach((topic, index) => searchParams.append(`topics[${index}]`, topic));
      judges.forEach((judge, index) => searchParams.append(`judges[${index}]`, judge));
      advocates.forEach((advocate, index) => searchParams.append(`advocates[${index}]`, advocate));

      const searchUrl = `http://localhost:3000/api/searchAdvanced?${searchParams.toString()}`;

      const response = await fetch(searchUrl);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();

      setResults(data);
      setJudgmentCount(data.length);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err);
      setResults([]);
      setJudgmentCount(0);
    }
  };

  const handleRemoveItem = (indexToRemove, setState) => {
    setState(prevState => prevState.filter((_, index) => index !== indexToRemove));
  };

  useEffect(() => {
    const fetchWords = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/all-words');
        if (!response.ok) {
          throw new Error('Failed to fetch words');
        }
        const data = await response.json();
        setWords(data);
      } catch (error) {
        console.error('Error fetching words:', error);
      }
    };
  
    fetchWords();
  }, []);
  

  const handleWordChange = (e) => {
    setWordName(e.target.value);
  };

  const handleAddWord = () => {
    if (wordName.trim() !== '') {
      setAddedWords([...addedWords, wordName.trim()]);
      setWordName('');
    }
  };

  useEffect(() => {
    const fetchLegislationNames = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/all-legislation');
        if (!response.ok) {
          throw new Error('Failed to fetch legislation names');
        }
        const data = await response.json();
        setLegislationNames(data);
      } catch (error) {
        console.error('Error fetching legislation names:', error);
      }
    };

    fetchLegislationNames();
  }, []);


  useEffect(() => {
    const fetchJudges = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/all-judge`);
        if (!response.ok) {
          throw new Error('Failed to fetch judges');
        }
        const data = await response.json();
        setJudgeList(data);
        console.log('Judges fetched:', data);
      } catch (error) {
        console.error('Error fetching judges:', error);
      }
    };
    fetchJudges();
  }, []);

  useEffect(() => {
      const fetchTopics = async () => {
        try {
          const response = await fetch(`http://localhost:3000/api/all-topic`);
          if (!response.ok) {
            throw new Error("Failed to fetch topics");
          }
          const data = await response.json();
          setTopicList(data);
          console.log("Topics fetched:", data);
        } catch (error) {
          console.error("Error fetching topics:", error);
        }
      };
      fetchTopics();
    }, []);

    useEffect(() => {
      const fetchAdvocates = async () => {
        try {
          const response = await fetch(`http://localhost:3000/api/all-advocate`);
          if (!response.ok) {
            throw new Error("Failed to fetch advocates");
          }
          const data = await response.json();
          setAdvocateList(data);
          console.log("Advocates fetched:", data);
        } catch (error) {
          console.error("Error fetching advocates:", error);
        }
      };
      fetchAdvocates();
    }, []);

    const fetchSections = async (legislationId) => {
      try {
        const response = await fetch(`http://localhost:3000/api/sections?legislationId=${legislationId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch sections');
        }
        const data = await response.json();
        setSectionList(data);
      } catch (error) {
        console.error('Error fetching sections:', error);
      }
    };

  const fetchSubsections = async (legislationSectionId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/subsections?legislationSectionId=${legislationSectionId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch subsections');
      }
      const data = await response.json();
      setSubsections(data);
    } catch (error) {
      console.error('Error fetching subsections:', error);
    }
  };

   const handleLegislationChange = (e) => {
      const selectedLegislation = e.target.value;
      setLegislationName(selectedLegislation);
      const selectedLegislationObj = legislationNames.find(leg => leg.legislationName === selectedLegislation);
      if (selectedLegislationObj) {
        fetchSections(selectedLegislationObj.legislationId);
      }
    };
    const handleSectionChange = (e) => {
      const selectedSection = e.target.value;
      setSectionName(selectedSection);
      const selectedSectionObj = sections.find(sec => sec.legislationSectionName === selectedSection);
      if (selectedSectionObj) {
        fetchSubsections(selectedSectionObj.legislationSectionId);
      }
    };

  const toggleFilterPanel = () => {
    setIsFilterPanelOpen(!isFilterPanelOpen);
  };

  const handleClear = () => {
    setLegislationName(''); // Clear ACT field
    setSectionName(''); // Clear SECTION field
    setSubsectionName(''); // Clear SUB-SECTION field
    setAdvocateName(''); // Clear ADVOCATE field
    setJudgeName(''); // Clear JUDGE field
    setTopicName(''); // Clear TOPIC field
    setActs([]); // Clear added acts
    setSections([]); // Clear added sections
    setSubsections([]); // Clear added subsections
    setTopics([]); // Clear added topics
    setJudges([]); // Clear added judges
    setAdvocates([]); // Clear added advocates
    setError(null); // Clear any errors
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.panelOutline}>
        <div className={styles.subcontainer}>
          <div className={styles.subitem}>
            <div className={styles.rectangleadvancedsearch}></div>
            ADVANCED SEARCH
          </div>
          <div className={styles.subitem}>
            <input
              type="text"
              placeholder="WORD"
              value={wordName}
              onChange={handleWordChange}
              className={styles.searchInput}
              list="words"
            />
            <datalist id="words">
              {words.map((word, index) => (
                <option key={index} value={word.word}>
                  {word.word}
                </option>
              ))}
            </datalist>
            <button className={styles.button} onClick={handleAddWord}>+</button>
          </div>
          
          <div className={styles.subitem}>
            <input
              value={legislationName}
              onChange={handleLegislationChange}
              className={styles.searchInput}
              list="data"
              placeholder="ACT" 
            />
            <datalist id="data">
              {legislationNames.map((name, index) => (
                <option key={index} value={name.legislationName}>
                  {name.legislationName}
                </option>
              ))}
            </datalist>
            <button className={styles.button} onClick={handleAddAct}>+</button>
          </div>
          <div className={styles.subitem}>
            <input
              type="text"
              placeholder="SECTION"
              value={sectionName}
              onChange={handleSectionChange}
              className={styles.searchInput}
              list="datasection"
            />
            <datalist id="datasection">
    {sectionList.map((sec, index) => (
      <option key={index} value={sec.legislationSectionName} >
        {sec.legislationSectionName}
      </option>
    ))}
  </datalist>
            <button onClick={handleAddSection} className={styles.button}>+</button>
          </div>
          <div className={styles.subitem}>
            <input
            list="datasubsection"
              type="text"
              placeholder="SUBSECTION"
              value={subsectionName}
              onChange={(e) => setSubsectionName(e.target.value)}
              className={styles.searchInput}
            />
            <datalist id="datasubsection">
            {subsectionList.map((subsec, index) => (
                <option key={index} value={subsec.legislationSubSectionName}>{subsec.legislationSubSectionName}</option>
            ))}
        </datalist>
            <button onClick={handleAddSubsection} className={styles.button}>+</button>
          </div>
          <div className={styles.subitem}>
            <input
             list="data-topic"
              type="text"
              placeholder="TOPIC"
              value={topicName}
              onChange={(e) => setTopicName(e.target.value)}
              className={styles.searchInput}
            /><datalist id="data-topic">
            {topicList.map((name, index) => (
              <option key={index} value={name.topicName}>
                {name.topicName}
              </option>
            ))}
          </datalist>
            <button onClick={handleAddTopic} className={styles.button}>+</button>
          </div>
          <div className={styles.subitem}>
            <input list="data-j"
              type="text"
              placeholder="JUDGE"
              value={judgeName}
              onChange={(e) => setJudgeName(e.target.value)}
              className={styles.searchInput}
            />
             <datalist id="data-j">
            {judgeList.map((jname, index) => (
              <option key={index} value={jname.judgeName}>
                {jname.judgeName}
              </option>
            ))}
          </datalist>
            <button onClick={handleAddJudge} className={styles.button}>+</button>
          </div>
          <div className={styles.subitem}>
            <input list="advocateList"
              type="text"
              placeholder="ADVOCATE"
              value={advocateName}
              onChange={(e) => setAdvocateName(e.target.value)}
              className={styles.searchInput}
            /> <datalist id="advocateList">
            {advocateList.map((name, index) => (
              <option key={index} value={name.advocateName}>
                {name.advocateName}{" "}
              </option>
            ))}
          </datalist>
            <button onClick={handleAddAdvocate} className={styles.button}>+</button>
          </div>
          <div className={isFilterPanelOpen ? styles.combinedResultsMinimized : styles.combinedResults}>
            {!isFilterPanelOpen && (
              <>
                {acts.map((act, index) => (
                  <div key={index} className={styles.addedItem}>
                    <div>{act}</div>
                    <button className={styles.button} onClick={() => handleRemoveItem(index, setActs)}>-</button>
                  </div>
                ))}
                {sections.map((section, index) => (
                  <div key={index} className={styles.addedItem}>
                    {section}
                    <button className={styles.button} onClick={() => handleRemoveItem(index, setSections)}>-</button>
                  </div>
                ))}
                {subsections.map((subsection, index) => (
                  <div key={index} className={styles.addedItem}>
                    {subsection}
                    <button className={styles.button} onClick={() => handleRemoveItem(index, setSubsections)}>-</button>
                  </div>
                ))}
                {topics.map((topic, index) => (
                  <div key={index} className={styles.addedItem}>
                    {topic}
                    <button className={styles.button} onClick={() => handleRemoveItem(index, setTopics)}>-</button>
                  </div>
                ))}
                {judges.map((judge, index) => (
                  <div key={index} className={styles.addedItem}>
                    {judge}
                    <button className={styles.button} onClick={() => handleRemoveItem(index, setJudges)}>-</button>
                  </div>
                ))}
                {advocates.map((advocate, index) => (
                  <div key={index} className={styles.addedItem}>
                    {advocate}
                    <button className={styles.button} onClick={() => handleRemoveItem(index, setAdvocates)}>-</button>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
        <div className={styles.subitem}>
          <div className={styles.button}>
            <button onClick={handleAdvancedSearch} className={styles.searchButton}>
              Search
            </button>
          </div>
          <div className={styles.button}>
            <button onClick={handleClear} className={styles.clearButton}>
              Clear
            </button>
          </div>
        </div>
      </div>
      <div className={styles.filtercontainer}>
        <div className={styles.subcontainer}>
          <div className={styles.subitem}>
            <button className={styles.filterButton} onClick={toggleFilterPanel}>
              FILTER RESULTS
            </button>
          </div>
          {isFilterPanelOpen && (
            <div>
              <div className={styles.subitem}>
                <input
                  type="date"
                  placeholder="DATE FROM"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className={styles.searchInput}
                />
              </div>
              <div className={styles.subitem}>
                <input
                  type="date"
                  placeholder="DATE TO"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className={styles.searchInput}
                />
              </div>
              <div className={styles.subitem}>
                <select
                  value={court}
                  onChange={(e) => setCourt(e.target.value)}
                  className={styles.searchInput}
                >
                  <option value="">Select Court</option>
                  <option value="Allahabad">Allahabad</option>
                  <option value="Andhra Pradesh">Andhra Pradesh</option>
                  <option value="Bangalore">Bangalore</option>
                  <option value="Bombay">Bombay</option>
                  <option value="Calcutta">Calcutta</option>
                  <option value="Chandigarh">Chandigarh</option>
                </select>
              </div>
              <div className={styles.subitem}>
                <select
                  value={publication}
                  onChange={(e) => setPublication(e.target.value)}
                  className={styles.searchInput}
                >
                  <option value="">Select Publication</option>
                  <option value="All">All</option>
                  <option value="Civil">Civil</option>
                  <option value="Criminal">Criminal</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SidePanel;

