import React, { useState, useRef, useEffect } from 'react';
import SidePanel from "../components/SidePanel/CFSidePanel";
import SubHeader from "../components/SubHeader/SubHeader.jsx";
import FrontDashboard from "../components/FrontDashboard/FrontDashboard";
import EditBar from "../components/EditBar/EditBar.jsx";
import RearDashboard from "../components/RearDashboard/RearDashboard";
import JudgmentContent from "../components/JudgmentContent/JudgmentContent";
import HeadnotesContent from "../components/HeadnotesContent/HeadnotesContent";
import StatusContent from "../components/StatusContent/StatusContent";
import EqualsContent from "../components/EqualsContent/EqualsContent";
import CitedContent from "../components/CitedContent/CitedContent";
import NotesContent from "../components/NotesContent/NotesContent";
import styles from "./IndexPage.module.css";
import { useAuth } from './../services/AuthContext';
//url navigation
import { useNavigate } from 'react-router-dom'; // Import useNavigatez
import { useLocation } from 'react-router-dom';


const CaseFinder = () => {
  const { user } = useAuth();
  const [judgmentId, setJudgmentId] = useState('');
  const [judgmentData, setJudgmentData] = useState(null);
  const [activeContent, setActiveContent] = useState("headnotes");
  const [fontSize, setFontSize] = useState(16); // Default font size in px
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null); // State to track the selected row
  const [showPageUpButton, setShowPageUpButton] = useState(false); // State to show page up button
  const [searchTerms, setSearchTerms] = useState([]); // Add this line
  const [referredCitation, setReferredCitation] = useState(null);
  const [fullCitation, setFullCitation] = useState('');
  const [isFullScreen, setIsFullScreen] = useState(false);// state for full screen
  const [currentJudgmentCitation, setCurrentJudgmentCitation] = useState('');
  const navigate = useNavigate();
  const location = useLocation(); // Access the current location for URL parameters
  const [judgmentCitation, setJudgmentCitation] = useState(''); // Use judgmentCitation state
 //Url declarations
  const queryParams = new URLSearchParams(location.search);
  const contentFromUrl = queryParams.get('content');
  const judgmentCitationFromUrl = queryParams.get('judgmentCitation');

  const contentRef = useRef();

  // Adding state for results, error, and judgment count
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [judgmentCount, setJudgmentCount] = useState(0);

  const formatDate = (dateString) => {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    const day = parseInt(dateString.substring(0, 2), 10);
    const monthIndex = parseInt(dateString.substring(2, 4), 10) - 1;
    const year = parseInt(dateString.substring(4), 10);

    const formattedDate = `${toOrdinal(day)} day of ${months[monthIndex]}, ${year}`;
    return formattedDate;
  };

  useEffect(() => {
    // Sync judgment data based on citation from URL
    if (judgmentCitationFromUrl && judgmentCitationFromUrl !== judgmentCitation) {
      const storedJudgmentData = sessionStorage.getItem(judgmentCitationFromUrl);
  
      if (storedJudgmentData) {
        const parsedData = JSON.parse(storedJudgmentData);
        setJudgmentCitation(parsedData.judgmentCitation);
        setJudgmentData(parsedData);
  
        // Do not reset activeContent when data is found in sessionStorage
        // Keep the previous state of activeContent
        if (contentFromUrl === activeContent && parsedData[activeContent]) {
          // Replace this with how your data is structured
          setContentData(parsedData[activeContent]);
        }
      } else {
        // If no judgment data found in sessionStorage, fetch it from referredCitation
        setReferredCitation(judgmentCitationFromUrl);
  
        // Only when fetching from the referred citation, set activeContent to 'headnotes'
        setActiveContent('headnotes');
      }
    }
  }, [location, contentFromUrl, judgmentCitationFromUrl]); // Dependencies include location and URL parameter changes
  
  
  
  // Store judgmentData in sessionStorage and update URL
  useEffect(() => {
    if (judgmentData && judgmentData.judgmentCitation) {
      const { judgmentCitation } = judgmentData;

      // Store the entire judgmentData object in sessionStorage using judgmentCitation as the key
      sessionStorage.setItem(judgmentCitation, JSON.stringify(judgmentData));

      // Update the URL with the latest judgmentCitation and activeContent
      navigate(`?content=${activeContent}&judgmentCitation=${judgmentCitation}`, { replace: true });
    }
  }, [judgmentData, activeContent, navigate]);


  // Handle content change and update the URL
  const handleContentChange = (content) => {
    if (!user && content !== 'headnotes') {
      navigate('/auth');
    } else if (content !== activeContent) {
      setActiveContent(content);
      navigate(`?content=${content}&judgmentCitation=${judgmentCitation}`, { replace: true });
    }
  };


  const toOrdinal = (num) => {
    const suffixes = ["th", "st", "nd", "rd"];
    const v = num % 100;
    return num + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
  };

  const handleSearchById = async (judgmentId) => {
    try {
      const response = await fetch(`http://localhost:3000/judgments/${judgmentId}`);
      const data = await response.json();
      console.log("Received data:", data); // Log the received data
      setJudgmentData(data);
    } catch (error) {
      console.error('Error fetching judgment:', error);
    }
  };

  const handleRowClick = (data) => {
    console.log('Row clicked with data:', data);
    setSelectedRow(data); // Update selected row
    handleSearchById(data.judgmentId);
  };

  const scrollToTop = () => {
    if (contentRef.current) {
      contentRef.current.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }
  };

  useEffect(() => {
    // Set selected row to the last row when results are loaded
    if (results.length > 0 && !selectedRow) {
      setSelectedRow(results[0]); // Set to the last row
      handleRowClick(results[0]); // Simulate click on the last row to load its content
    }
  }, [results, selectedRow]);

  useEffect(() => {
    // Scroll to top whenever judgmentData changes
    if (judgmentData) {
      scrollToTop();
    }
  }, [judgmentData]);

  const handleZoom = (type) => {
    setFontSize((prev) => (type === "plus" ? prev + 2 : prev - 2));
  };

  const handlePrint = () => {
    if (contentRef.current) {
      const printContents = contentRef.current.innerHTML;
      const originalContents = document.body.innerHTML;

      document.body.innerHTML = printContents;
      window.print();
      document.body.innerHTML = originalContents;
      window.location.reload(); // Reload to restore the original content
    }
  };

  const handleResultClick = (id) => {
    setJudgmentId(id);
    handleSearchById(id); // Pass the id parameter here
  };

  const handleSaveToPad = () => {
    const dataToSave = { results, selectedRow }; // Customize this according to the data you want to save
    localStorage.setItem("padData", JSON.stringify(dataToSave));
  };

  const handlePageUp = () => {
    if (contentRef.current) {
      contentRef.current.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }
  };

  useEffect(() => {
    // Function to update showPageUpButton state based on scroll position
    const handleScroll = () => {
      if (contentRef.current) {
        const scrollTop = contentRef.current.scrollTop;
        setShowPageUpButton(scrollTop > 100); // Adjust this value as needed
      }
    };

    // Attach scroll event listener to contentRef
    if (contentRef.current) {
      contentRef.current.addEventListener("scroll", handleScroll);
    }

    // Clean up function to remove event listener
    return () => {
      if (contentRef.current) {
        contentRef.current.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

 //judgmentreferredcitation click
 const handleSetCitation = (newCitation) => {
  setCitation(newCitation);
};

  //fullscreen function
  const handleToggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    setIsFullScreen(!isFullScreen);
  };

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullScreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
    };
  }, []);

  const handleClear = () => {
    console.log('Clearing data...');
    setJudgmentData(null); 
    setCurrentJudgmentCitation("");
    setResults([]);
    setJudgmentCount(0);
    setError(null);
    setSearchTerms([]);
  };


  return (
    <div>
      <SubHeader judgmentData={judgmentData} onToggleFullScreen={handleToggleFullScreen} isFullScreen={isFullScreen} /> {/* Pass the toggle function */}
      <FrontDashboard
        onItemSelect={handleContentChange}
        onZoom={handleZoom}
        onPrint={handlePrint}
        judgmentCount={judgmentCount} // Pass the judgmentCount as a prop
      />
      {/* Remove input later */}
      {/* Judgment ID Search */}

      {/* Search Results */}
      {searchResults.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Judgment ID</th>
              <th>Short Notes</th>
            </tr>
          </thead>
          <tbody>
            {searchResults.map(result => (
              <tr key={result.id} onClick={() => handleResultClick(result.id)}>
                <td>{result.id}</td>
                <td>{result.shortNoteText}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

<div className={`${styles.sideNscroll} ${isFullScreen ? styles.fullScreen : ''}`}> {/* Apply full-screen class */}
        {!isFullScreen && (
        <SidePanel 
          setResults={setResults} 
          setJudgmentCount={setJudgmentCount} 
          setError={setError} 
          setSearchTerms={setSearchTerms} 
          fullCitation={referredCitation} 
          setFullCitation={setReferredCitation}
          onClear={handleClear}

        />
      )}<div 
      className={`${styles.scrollableText} ${isFullScreen ? styles.fullScreenText : ''}`} 
      ref={contentRef} 
      style={{ fontSize: `${fontSize}px`, filter: (!user & (results.length > 0)) ? 'blur(4px)' : 'none' }}
    > 
          {activeContent === "judgment" && <JudgmentContent judgmentData={judgmentData} searchTerms={searchTerms} setReferredCitation={setReferredCitation} />}
          {activeContent === "headnotes" && <HeadnotesContent judgmentData={judgmentData} searchTerms={searchTerms} />}
          {activeContent === "status" && <StatusContent judgmentData={judgmentData} searchTerms={searchTerms}/>}
          {activeContent === "equals" && <EqualsContent judgmentData={judgmentData} searchTerms={searchTerms} />}
          {activeContent === "cited" && <CitedContent judgmentData={judgmentData} searchTerms={searchTerms} />}
          {activeContent === "notes" && (<NotesContent uid={user?.uid} judgmentId={selectedRow?.judgmentId}/>)}
        </div>
        {showPageUpButton && (
          <button className={styles.pageUpButton} onClick={handlePageUp}>
            ↑
          </button>
        )}
        
      </div>
      <RearDashboard results={results} onRowClick={handleRowClick} selectedRow={selectedRow} onSaveToPad={handleSaveToPad} judgmentCount={judgmentCount}  currentJudgmentCitation={currentJudgmentCitation}
        setCurrentJudgmentCitation={setCurrentJudgmentCitation} />    </div>
  );
};

export default CaseFinder;
