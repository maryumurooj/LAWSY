import React, { useState, useEffect } from "react";
import styles from "./SidePanel.module.css";
import HighlightWords from 'react-highlight-words';



const SidePanel = ({ setResults, setJudgmentCount, setError, setSearchTerms, onSearch, fullCitation,
  setFullCitation, onClear }) => {

  const [legislationName, setLegislationName] = useState('');
  const [subsection, setSubsection] = useState('');
  const [topic, setTopicName] = useState('');
  const [year, setYear] = useState('');
  const [volume, setVolume] = useState('');
  const [publicationName, setPublicationName] = useState('');
  const [pageNo, setPageNo] = useState('');
  const [nominal, setNominal] = useState('');
  const [nominals, setNominals] = useState('');
  const [caseType, setCaseType] = useState('');
  const [caseNo, setCaseNo] = useState('');
  const [caseYear, setCaseYear] = useState('');
  const [legislationNames, setLegislationNames] = useState([]);
  const [sections, setSections] = useState([]);
  const [subsections, setSubsections] = useState([]);
  const [topics, setTopics] = useState([]);
  const [judges, setJudges] = useState([]);
  const [judgeName, setJudgeName] = useState('');
  const [advocates, setAdvocates] = useState([]);
  const [advocateName, setAdvocateName] = useState('');
  const [sectionName, setSectionName] = useState('');
  const [subsectionName, setSubsectionName] = useState('');
  const [openIndex, setOpenIndex] = useState(0);
  const [section, setSection] = useState('');
  const [judge, setJudge] = useState('');
  const [advocate, setAdvocate] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [court, setCourt] = useState('');
  const [publication, setPublication] = useState('');
  const [acts, setActs] = useState([]);
  const [query, setQuery] = useState(''); 
  const [caseNos, setCaseNos] = useState([]);
  const [filteredCaseNos, setFilteredCaseNos] = useState([]);
  const [caseInfo, setCaseInfo] = useState([]);
  const [filteredCaseInfo, setFilteredCaseInfo] = useState([]);
  const [sectionterm, setsectionterm] = useState('');
  const [caseinfo, setCaseinfo] = useState('');  // Added from code 1
  const [caseNumber, setCaseNumber] = useState('');  // Added from code 1
  const [citations, setCitations] = useState('');  // Added from code 1
  const [filteredCitations, setFilteredCitations] = useState([]);  // Added from code 1
  const [equals, setEquals] = useState([]);  // Added from code 1
  const [equivalents, setEquivalents] = useState([]);  // Added from code 1
  const [filteredEquivalents, setFilteredEquivalents] = useState([]);  // Added from code 1
  const [citation, setCitation] = useState("");
  const [completeCitation, setCompleteCitation] = useState("");

  
  const toggleIndex = (index) => {
      setOpenIndex(openIndex === index ? null : index);
    };

const handleSearch = async () => {
    try {
        const response = await fetch(`http://localhost:3000/api/search?legislationName=${legislationName}&section=${section}&subsection=${subsection}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const uniqueResults = Array.from(new Set(data.map(result => result.judgmentId)))
            .map(judgmentId => data.find(result => result.judgmentId === judgmentId));
        setResults(uniqueResults);
        setJudgmentCount(uniqueResults.length);

      const sectionHighlight = (text) => {
          return text.replace(/[()]/g, '\\$&').split('|').join('');
        };

        // Add this to store search terms for highlighting
        setSearchTerms([
        legislationName,
            sectionHighlight(section), // Apply custom highlighting to the section term
            subsection 
        ].filter(term => term));

    } catch (err) {
        console.error('Error fetching data:', err);
        setError(err);
        setResults([]);
        setJudgmentCount(0);
    }
};


const handleTopicSearch = async () => {
  try {
    const response = await fetch(
      `http://localhost:3000/api/searchByTopic?topic=${topic}`,
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    const uniqueResults = Array.from(
      new Set(data.map((result) => result.judgmentId)),
    ).map((judgmentId) =>
      data.find((result) => result.judgmentId === judgmentId),
    );
    setResults(uniqueResults);
    setJudgmentCount(uniqueResults.length);
    console.log("Search results:", data);

    // Add this to store search terms for highlighting
    setSearchTerms([topic].filter(term => term));
  } catch (err) {
    console.error("Error fetching data:", err);
    setError(err);
    setResults([]);
    setJudgmentCount(0);
  }
};



const handleNominalSearch = async () => {
  try {
    const nominalValue = nominal || "";

    const response = await fetch(
      `http://localhost:3000/api/searchByNominal?nominal=${nominalValue}`,
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    const uniqueResults = Array.from(
      new Set(data.map((result) => result.judgmentId)),
    ).map((judgmentId) =>
      data.find((result) => result.judgmentId === judgmentId),
    );
    setResults(uniqueResults);
    setJudgmentCount(uniqueResults.length);

    // Add this to store search terms for highlighting
    setSearchTerms([nominalValue].filter(term => term));
  } catch (err) {
    console.error("Error fetching data:", err);
    setError(err);
    setResults([]);
    setJudgmentCount(0);
  }
};

//search by CaseNo
const handleCaseNoSearch = async (selectedCase) => {
  try {
    const caseNoText = selectedCase.judgmentNoText || '';
    const response = await fetch(`http://localhost:3000/api/searchByCaseNo?caseinfo=${caseNoText}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    const uniqueResults = Array.from(new Set(data.map(result => result.judgmentId)))
      .map(judgmentId => data.find(result => result.judgmentId === judgmentId));
    setResults(uniqueResults);
    setJudgmentCount(uniqueResults.length);
    setSearchTerms([caseNoText].filter(term => term));
  } catch (err) {
    console.error('Error fetching data:', err);
    setError(err);
    setResults([]);
    setJudgmentCount(0);
  }
};
const handleCaseNoSelect = (selectedCase) => {
  handleCaseNoSearch(selectedCase);
};

//search by Advocate
const handleAdvocateSearch = async () => {
  try {
      const advocateNameValue = advocateName || '';

      const response = await fetch(`http://localhost:3000/api/searchByAdvocate?advocateName=${advocateNameValue}`);
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      const data = await response.json();
      const uniqueResults = Array.from(new Set(data.map(result => result.judgmentId)))
          .map(judgmentId => data.find(result => result.judgmentId === judgmentId));
      setResults(uniqueResults);
      setJudgmentCount(uniqueResults.length);
          setSearchTerms([advocateNameValue].filter(term => term));

  } catch (err) {
      console.error('Error fetching data:', err);
      setError(err);
      setResults([]);
      setJudgmentCount(0);
  }
};


//search by Judge
const handleJudgeSearch = async () => {
  try {
      const response = await fetch(`http://localhost:3000/api/searchByJudge?judge=${judge}`);
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      const data = await response.json();
      const uniqueResults = Array.from(new Set(data.map(result => result.judgmentId)))
          .map(judgmentId => data.find(result => result.judgmentId === judgmentId));
      setResults(uniqueResults);
      setJudgmentCount(uniqueResults.length);
          setSearchTerms([judge].filter(term => term));

  } catch (err) {
      console.error('Error fetching data:', err);
      setError(err);
      setResults([]);
      setJudgmentCount(0);
  }
};


//Citation search
const handleCitationSearch = async (selectedCitation) => {
  try {
    const CitationText = selectedCitation.judgmentCitation || '';
    const response = await fetch(`http://localhost:3000/api/searchByCitation?CitationText=${CitationText}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    const uniqueResults = Array.from(new Set(data.map(result => result.judgmentId)))
      .map(judgmentId => data.find(result => result.judgmentId === judgmentId));
    setResults(uniqueResults);
    setJudgmentCount(uniqueResults.length);
    setSearchTerms([CitationText].filter(term => term));
  } catch (err) {
    console.error('Error fetching data:', err);
    setError(err);
    setResults([]);
    setJudgmentCount(0);
  }
};

useEffect(() => {
  if (citation && onSearch) {
    // Perform search action here using onSearch function
    console.log("Searching for citation:", citation);
    onSearch(citation); // Example: Call onSearch function with citation as argument
  }
}, [citation, onSearch]);

//Equals Search
const handleEquivalentSearch = async (selectedEqual) => {
  try {
    const EqualText = selectedEqual.equalCitationText || '';
    const response = await fetch(`http://localhost:3000/api/searchByEquivalent?EqualText=${EqualText}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    const uniqueResults = Array.from(new Set(data.map(result => result.judgmentId)))
      .map(judgmentId => data.find(result => result.judgmentId === judgmentId));
    setResults(uniqueResults);
    setJudgmentCount(uniqueResults.length);
    setSearchTerms([EqualText].filter(term => term));

  } catch (err) {
    console.error('Error fetching data:', err);
    setError(err);
    setResults([]);
    setJudgmentCount(0);
  }
};

//fetching DropDowns

//Caseno
const fetchCaseNo = async () => {
  try {
    const response = await fetch("http://localhost:3000/api/all-caseno");
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    setCaseNos(data);
     console.log(' fetched:', data);
  } catch (error) {
    console.error("Error fetching CaseNo:", error);
  }
};
useEffect(() => {
  fetchCaseNo();
}, []);

useEffect(() => {
  let filtered = [...caseNos];
  if (typeof caseInfo === 'string') {
    filtered = filtered.filter((caseNo) =>
      caseNo.judgmentNoText.toLowerCase().includes(caseInfo.toLowerCase())
    );
  }
  if (typeof caseYear === 'string') {
    filtered = filtered.filter((caseNo) =>
      caseNo.judgmentNoText.toLowerCase().includes(caseYear.toLowerCase())
    );
  }
  if (typeof caseNumber === 'string') {
    filtered = filtered.filter((caseNo) =>
      caseNo.judgmentNoText.toLowerCase().includes(caseNumber.toLowerCase())
    );
  }
  setFilteredCaseNos(filtered);
}, [caseInfo, caseYear, caseNumber, caseNos]);

//Citation List
useEffect(() => {
  const fetchCitation = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/all-citation`);
      if (!response.ok) {
        throw new Error("Failed to fetch Citation");
      }
      const data = await response.json();
      setCitations(data);console.log("Citation fetched:", data);
    } catch (error) {
      console.error("Error fetching Citation:", error);
    }
  };
  fetchCitation();
}, []);





useEffect(() => {
  let filtered = [...citations];
  if (typeof year === 'string') {
    filtered = filtered.filter((citation) =>
      citation.judgmentCitation.toLowerCase().includes(year.toLowerCase())
    );
  }
  if (typeof volume === 'string') {
    filtered = filtered.filter((citation) =>
      citation.judgmentCitation.toLowerCase().includes(volume.toLowerCase())
    );
  }
  if (typeof pageNo === 'string') {
    filtered = filtered.filter((citation) =>
      citation.judgmentCitation.toLowerCase().includes(pageNo.toLowerCase())
    );
  }

  if (typeof completeCitation === 'string') {
    filtered = filtered.filter((citation) =>
      citation.judgmentCitation.toLowerCase().includes(completeCitation.toLowerCase())
    );
  }
  

  // Filter by full citation
  if (typeof fullCitation === 'string' && fullCitation.trim() !== '') {
    filtered = filtered.filter((citation) =>
      citation.judgmentCitation.toLowerCase().includes(fullCitation.toLowerCase())
    );
  }


  setFilteredCitations(filtered);
}, [year, volume, publicationName, pageNo, , completeCitation, fullCitation, citations]);


useEffect(() => {
  if (fullCitation && fullCitation.trim() !== '') {
    handleCitationSearch({ judgmentCitation: fullCitation }); // Call handleCitationSearch with a mock object
  }
}, [fullCitation, handleCitationSearch]);

 // Function to search when the judgmentreferredcitation is referred as a prop(fullCitation)
 useEffect(() => {
  if (fullCitation && fullCitation.trim() !== '') {
    handleCitationSearch({ judgmentCitation: fullCitation }); // Call handleCitationSearch with a mock object
    setFullCitation(''); // Clear fullCitation state to prevent repeated searches
  }
}, [fullCitation, handleCitationSearch]);


//this was the function which was used to search citation through input field itself
{/* 
const handleFullCitationChange = (e) => {
  const { value } = e.target;
  setFullCitation(value); // Update state with the new value
};*/}

const handleCitationSelect = (selectedCitation) => {
  handleCitationSearch(selectedCitation);
};

//Equals
useEffect(() => {
  const fetchEquivalent = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/all-equivalent`);
      if (!response.ok) {
        throw new Error("Failed to fetch Equivalent");
      }
      const data = await response.json();
      setEquivalents(data);
      console.log("Equivalent fetched:", data);
    } catch (error) {
      console.error("Error fetching Equivalent:", error);
    }
  };
  fetchEquivalent();
}, []);

const handleEqualSelect = (selectedEqual) => {
  handleEquivalentSearch(selectedEqual);
};


useEffect(() => {
    let filtered = [...equivalents];
    if (typeof year === 'string' && year.trim() !== '') {
      filtered = filtered.filter((equivalent) =>
        equivalent.judgmentYear && equivalent.judgmentYear.toLowerCase().includes(year.toLowerCase())
      );
    }
    if (publicationName && publicationName !== 'ALL') {
      filtered = filtered.filter((equivalent) =>
        equivalent.judgmentPublication && equivalent.judgmentPublication.toLowerCase() === publicationName.toLowerCase()
      );
    }
    if (typeof pageNo === 'string' && pageNo.trim() !== '') {
      filtered = filtered.filter((equivalent) =>
        equivalent.judgmentPage && equivalent.judgmentPage.toString().includes(pageNo)
      );
    }
    setFilteredEquivalents(filtered);
  }, [year, publicationName, pageNo, equivalents]);



// Act(Legislation Name) DropDown
useEffect(() => {
  const fetchLegislationNames = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/all-legislation`);
      if (!response.ok) {
        throw new Error('Failed to fetch legislation names');
      }
      const data = await response.json();
      setLegislationNames(data);
    } catch (error) {
      console.error('Error fetching legislation names:', error);
    }
  };
  // Fetch legislation names when component mounts
  fetchLegislationNames();
}, []);

  // Section Fetching
  const fetchSections = async (legislationId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/sections?legislationId=${legislationId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch sections');
      }
      const data = await response.json();
      setSections(data);
    } catch (error) {
      console.error('Error fetching sections:', error);
    }
  };

  // SubSection Fetching
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
  
  // ACT handling 
  const handleLegislationChange = (e) => {
    const selectedLegislation = e.target.value;
    setLegislationName(selectedLegislation);
  
    // Find the selected legislation object based on legislationName
    const selectedLegislationObj = legislationNames.find(leg => leg.legislationName === selectedLegislation);
    if (selectedLegislationObj) {
      fetchSections(selectedLegislationObj.legislationId);
    }
  };
  
  // Section Handling with Combination
  const handleSectionChange = (e) => {
    const selectedSection = e.target.value;
    setSection(selectedSection);
  
    // Find the selected section object based on legislationSectionCombined
    const selectedSectionObj = sections.find(sec => sec.legislationSectionCombined === selectedSection);
  
    if (selectedSectionObj) {
      fetchSubsections(selectedSectionObj.legislationSectionId);
    }
  };

//Judges DropDown
useEffect(() => {
  const fetchJudges = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/all-judge`);
      if (!response.ok) {
        throw new Error('Failed to fetch judges');
      }
      const data = await response.json();
      setJudges(data);
      console.log('Judges fetched:', data); // Log data
    } catch (error) {
      console.error('Error fetching judges:', error);
    }
  };
  fetchJudges();
}, []);

//topics DropDown
useEffect(() => {
  const fetchTopics = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/all-topic`);
      if (!response.ok) {
        throw new Error("Failed to fetch topics");
      }
      const data = await response.json();
      setTopics(data);
      console.log("Topics fetched:", data);
    } catch (error) {
      console.error("Error fetching topics:", error);
    }
  };
  fetchTopics();
}, []);

//Advocates DropDown
useEffect(() => {
  const fetchAdvocates = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/all-advocate`);
      if (!response.ok) {
        throw new Error("Failed to fetch advocates");
      }
      const data = await response.json();
      setAdvocates(data);
      console.log("Advocates fetched:", data); // Log data
    } catch (error) {
      console.error("Error fetching advocates:", error);
    }
  };
  fetchAdvocates();
}, []);

//Nominal DropDown
useEffect(() => {
  const fetchNominal = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/all-nominal`);

      if (!response.ok) {
        throw new Error("Failed to fetch topics");
      }
      const data = await response.json();
      setNominals(data);console.log("Nominals fetched:", data);
    } catch (error) {
      console.error("Error fetching Nominal:", error);
    }
  };

  fetchNominal();
}, []);

const handleClear = () => {
  console.log('Handle clear called');
  setLegislationName(''); // Clear ACT field
  setSection(''); // Clear SECTION field
  setSubsection(''); // Clear SUB-SECTION field
  setTopicName('');
  setYear('');
  setVolume('');
  setPublicationName('ALL');
  setPageNo('');
  setCaseInfo("");
  setYear('');
  setPublicationName('ALL');
  setPageNo('');
  setJudge('');
  setAdvocateName('');
  setError(null);
  setResults([]);
  setJudgmentCount(0);
  setSearchTerms([]);
  onClear(); // Call the clear function from the parent component
};


const clearInput = (setter) => {
  setter('');
};

  return (
    <div className={styles.sidebar}>
      <div className={styles.panelOutline}>
        {/* Subject Index */}
        <div className={styles.container}>
<div className={styles.subitem} onClick={() => toggleIndex(0)}>
  <span>SUBJECT INDEX</span>
</div>
{openIndex === 0 && (
  <>
    <div className={styles.subitem}>
      <input
        value={legislationName}
        onChange={handleLegislationChange}
        className={styles.drop}
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
    </div>
    <div className={styles.subitem}>
  <input
    value={section}
    onChange={handleSectionChange}
    className={styles.drop}
    list="datasection"  // Add list attribute here
    placeholder="SECTION"
  />
 <datalist id="datasection">
        {sections.map((sec, index) => (
          <option key={index} value={sec.legislationSectionCombined}> {/*legislationSectionPrefix + legislationSectionNo*/}
            {sec.legislationSectionCombined}
          </option>
        ))}
      </datalist>
</div>

    <div className={styles.searchelement}>
      <input
        type="text"
        placeholder="SUB-SECTION"
         list="datasubsection" 
        value={subsection}
        onChange={(e) => setSubsection(e.target.value)}
        className={styles.searchInput}
      />
      <datalist id="datasubsection">
    {subsections.map((subsec, index) => (
        <option key={index} value={subsec.legislationSubSectionName}>{subsec.legislationSubSectionName}</option>
    ))}
</datalist>
    </div>
    <div className={styles.button}>
      <button onClick={handleSearch}>Search</button>
      <button
  onClick={handleClear}
  className={styles.clearButton}
>
  Clear
</button>
    </div>
  </>
)}
</div>


{/* Topic Index */}
    <div className={styles.container}>
    <div className={styles.subitem} onClick={() => toggleIndex(1)}>
    <span>TOPIC INDEX</span>
  </div>
    {openIndex === 1 && (
      <>
  <div className={styles.subitem}>
    <input
      value={topic}
      onChange={(e) => setTopicName(e.target.value)}
      className={styles.drop}
      list="data-topic"
      placeholder="Topic"
        />
    <datalist id="data-topic">
      {topics.map((name, index) => (
      <option key={index} value={name.topicName}>
        {name.topicName}
      </option>
      ))}
    </datalist>
    </div>
    <div className={styles.button}>
      <button onClick={handleTopicSearch}>Search</button>
      <button
  onClick={handleClear}
  className={styles.clearButton}
>
  Clear
</button>
    </div>

  </>
)}
</div>

{/* Citation Index */}
{}
        <div className={styles.container}>
      <div className={styles.subitem} onClick={() => toggleIndex(2)}>
        <span>CITATION INDEX</span>
      </div>
      {openIndex === 2 && (
        <>
          <div className={styles.subitem}>
            <input
              type="text"
              placeholder="Year"
              className={styles.searchInput}
              value={year}
              onChange={(e) => setYear(e.target.value)}
            />
         
          </div>
          <div className={styles.subitem}>
            <input
              type="text"
              placeholder="Volume No"
              className={styles.searchInput}
              value={volume}
              onChange={(e) => setVolume(e.target.value)}
            />
           
          </div>
          <div className={styles.subitem}>
            <select
              className={styles.searchInput}
              value={publicationName}
              onChange={(e) => setPublicationName(e.target.value)}
            >
              <option value="ALL">ALL</option>
              <option value="ALD">ALD</option>
              <option value="ALD (NOC)">ALD (NOC)</option>
              <option value="ALD (Crl.)">ALD (Crl.)</option>
              <option value="ALD (Crl.) (NOC)">ALD (Crl.) (NOC)</option>
            </select>
          </div>
          <div className={styles.subitem}>
            <input
              type="text"
              placeholder="Page No"
              className={styles.searchInput}
              value={pageNo}
              onChange={(e) => setPageNo(e.target.value)}
            />
            
          </div>
          <div className={styles.subitem}>
          <input
              type="text"
              placeholder="Complete Citation"
              className={styles.searchInput}
              value={completeCitation}
              onChange={(e) => setCompleteCitation(e.target.value)}
            />
          </div>
          <div className={styles.caseNoList}>
            {filteredCitations.map((citation) => (
              <div
                key={citation.judgmentId}
                onClick={() => handleCitationSelect(citation)}
                className={styles.caseNoItem}
              >
                {citation.judgmentCitation}
              </div>
            ))}
          </div>
          <div className={styles.subitem}>
            <div className={styles.button}>
              <button
  onClick={handleClear}
  className={styles.clearButton}
>
  Clear
</button>
            </div>
          </div>
        </>
      )}
    </div>
          {}

  {/* Nominal Index */}
  <div className={styles.container}>
  <div className={styles.subitem} onClick={() => toggleIndex(3)}>
      <span>NOMINAL INDEX</span>
  </div>
  {openIndex === 3 && (
      <>
          <div className={styles.subitem}>
               <input
               list="data-nominal"
                  type="text"
                  placeholder="Nominal Index"
                  className={styles.searchInput}
                  value={nominal}
                  onChange={(e) => setNominal(e.target.value)}
                />
                <datalist id="data-nominal">
                  {nominals.map((name, index) => (
                    <option key={index} value={name.judgmentParties}>
                      {name.judgmentParties}
                    </option>
                  ))}
                </datalist>
            </div>
            <div className={styles.button}>
      <button onClick={handleNominalSearch}>Search</button>
      <button
  onClick={handleClear}
  className={styles.clearButton}
>
  Clear
</button>
      </div>
          </>
        )}
</div>

{/* Case No Index */}
{}
      <div className={styles.container}>
  <div className={styles.subitem} onClick={() => toggleIndex(4)}>
      <span>CASE NO INDEX</span>
  </div>
  {openIndex === 4 && (
      <>
          <div className={styles.subitem}>
          <input
          type="text"
          placeholder="Case Type"
          value={caseInfo}
          onChange={(e) => setCaseInfo(e.target.value)}
          style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
        />
            </div>
            <div className={styles.subitem}>
          <input
          type="text"
          placeholder="Case Year"
          value={caseYear}
          onChange={(e) => setCaseYear(e.target.value)}
          style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
        />
            </div>
            <div className={styles.subitem}>
          <input
          type="text"
          placeholder="Case No"
          value={caseNumber}
          onChange={(e) => setCaseNumber(e.target.value)}
          style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
        />
            </div>
          <div className={styles.caseNoList}>
          {filteredCaseNos.map((caseNo) => (
          <div
            key={caseNo.judgmentId}
            onClick={() => handleCaseNoSelect(caseNo)}
            className={styles.caseNoItem}
          >
            {caseNo.judgmentNoText}
          </div>
        ))}
          </div>
          <div className={styles.button}>
           <button
  onClick={handleClear}
  className={styles.clearButton}
>
  Clear
</button>
          </div>
        </>
      )}
    </div>
{}
{/* Judge Index */}
<div className={styles.container}>
    <div className={styles.subitem} onClick={() => toggleIndex(5)}>
        <span>JUDGE INDEX</span>
    </div>
    {openIndex === 5 && (
        <>
            <div className={styles.subitem}>
                <input
                    list="data-j"
                    type="text"
                    placeholder="Judge"
                    className={styles.searchInput}
                    value={judge}
                    onChange={(e) => setJudge(e.target.value)}
                />
                
                <datalist id="data-j">
                    {judges.map((jname, index) => (
                        <option key={index} value={jname.judgeName}>
                            {jname.judgeName}
                        </option>
                    ))}
                </datalist>
            </div>
            <div className={styles.button}>
                <button onClick={handleJudgeSearch} className={styles.searchButton}>
                    Search
                </button>
                <button
  onClick={handleClear}
  className={styles.clearButton}
>
  Clear
</button>
            </div>
        </>
    )}
</div>



{/* Advocate Index */}
<div className={styles.container}>
<div className={styles.subitem} onClick={() => toggleIndex(6)}>
  <span>ADVOCATE INDEX</span>
</div>
{openIndex === 6 && (
  <>
    <div className={styles.subitem}>
      <input
      list="advocateList"
      type="text"
      placeholder="Advocate Name"
      className={styles.searchInput}
      value={advocateName}
      onChange={(e) => setAdvocateName(e.target.value)}
    />
    <datalist id="advocateList">
      {advocates.map((name, index) => (
        <option key={index} value={name.advocateName}>
          {name.advocateName}{" "}
        </option> 
      ))}
    </datalist>
    </div>
    <div className={styles.button}>
      <button onClick={handleAdvocateSearch}>Search</button>
      <button
  onClick={handleClear}
  className={styles.clearButton}
>
  Clear
</button>
      </div>
  </>
)}
</div>

    {/* Equivalent Index */}
    {}
       <div className={styles.container}>
      <div className={styles.subitem} onClick={() => toggleIndex(7)}>
        <span>EQUIVALENT INDEX</span>
      </div>
      {openIndex === 7 && (
        <>
          <div className={styles.subitem}>
            <input
              type="number"
              placeholder="Year"
              className={styles.searchInput}
              value={year}
              onChange={(e) => setYear(e.target.value)}
            />
            
          </div>
          <div className={styles.subitem}>
            <select
              className={styles.searchInput}
              value={publicationName}
              onChange={(e) => setPublicationName(e.target.value)}
            >
              <option value="ALL">ALL</option>
              <option value="SCC">SCC</option>
              <option value="SCC (Cri.)">SCC (Cri.)</option>
              <option value="SC">AIR SC</option>
              <option value="AIR SCW">AIR SCW</option>
              <option value="AIR %%% AP">AIR AP</option>
              <option value="ALT">ALT</option>
            </select>
          </div>
          <div className={styles.subitem}>
            <input
              type="number"
              placeholder="Page No"
              className={styles.searchInput}
              value={pageNo}
              onChange={(e) => setPageNo(e.target.value)}
            />
          </div>
          <div className={styles.caseNoList}>
            {filteredEquivalents.map((equivalent) => (
              <div
                key={equivalent.equalCitationId}
                onClick={() => handleEqualSelect(equivalent)}
                className={styles.caseNoItem}
              >
                {equivalent.equalCitationText}
              </div>
            ))}
          </div>
          <div className={styles.button}>

            <button
  onClick={handleClear}
  className={styles.clearButton}
>
  Clear
</button>
          </div>
        </>
      )}
    </div>

      </div>
    </div>
  );
}

export default SidePanel;