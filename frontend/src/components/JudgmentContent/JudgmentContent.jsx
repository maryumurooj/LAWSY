import React, { useRef, useEffect } from "react";
import styles from "./JudgmentContent.module.css";

const JudgmentContent = ({ judgmentData, setReferredCitation  ,searchTerms = [] }) => {
  const paraRefs = useRef({});

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

  const toOrdinal = (num) => {
    const suffixes = ["th", "st", "nd", "rd"];
    const v = num % 100;
    return num + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
  };

  const scrollToPara = (paraNo) => {
    const paraElement = paraRefs.current[paraNo];
    if (paraElement) {
      setTimeout(() => {
        paraElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        paraElement.classList.add(styles.pop);
        setTimeout(() => {
          paraElement.classList.remove(styles.pop);
        }, 1000);
      }, 0);
    } else {
      console.warn(`Paragraph number ${paraNo} not found in references.`);
    }
  };

  const extractNumbersFromLink = (text) => {
    const regex = /\d+/g;
    const matches = text.match(regex);
    return matches ? matches.map(Number) : [];
  };

const renderLongNoteParas = (longNoteParas, searchTerms) => {
  return longNoteParas.map((longNotePara) => (
    <p key={longNotePara.longNoteParaId}>
      {extractAndRenderLongNoteLinks(longNotePara.longNoteParaText).map((element, index) =>
        React.isValidElement(element) ? (
          <React.Fragment key={index}>
            {element}
          </React.Fragment>
        ) : (
          isHtml(element) ? (
            <div dangerouslySetInnerHTML={{ __html: element }} key={index} />
          ) : (
            <span key={index}>{highlightText(element, searchTerms)}</span>
          )
        )
      )}
    </p>
  ));
};
  

  const extractAndRenderLongNoteLinks = (text) => {
    const regex = /(?:\[Para\s*(\d+(?:,\s*\d+)*?)\])|(?:Para\s*(\d+)(?:\s+and\s+(\d+))?)|(?:\(Para\s*(\d+)\s+and\s+Para\s*(\d+)\))/g;
    let match;
    const elements = [];

    let lastIndex = 0;

    while ((match = regex.exec(text)) !== null) {
      const paraNos = match[1] ? match[1].split(',').map((n) => n.trim()) :
                     match[2] ? [match[2], match[3]].filter(Boolean) :
                     match[4] ? [match[4], match[5]] : [];

      elements.push(text.substring(lastIndex, match.index));

      paraNos.forEach((paraNo, index) => {
        elements.push(
          <a
            key={`${match.index}_${index}`}
            href="#"
            onClick={() => scrollToPara(paraNo)}
          >
            {`Para ${paraNo}`}
          </a>
        );

        if (index === 0 && paraNos.length === 2) {
          elements.push(" and ");
        }

        if (index < paraNos.length - 1 && paraNos.length > 2) {
          elements.push(", ");
        }
      });

      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      elements.push(text.substring(lastIndex));
    }

    return elements;
  };

  const highlightText = (text, searchTerms) => {
    if (!text || !searchTerms.length) return text;

    const regexPattern = searchTerms.map(term => term.replace(/[()]/g, '\\$&')).join('|');
    const regex = new RegExp(`(${regexPattern})`, 'gi');

    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? <mark key={index}>{part}</mark> : part
    );
  };

  useEffect(() => {
    console.log('Current paragraph refs:', paraRefs.current);
  }, [judgmentData]);

  
  const generateNewCitation = (originalCitation, judgmentData) => {
    console.log('generateNewCitation called with:', { originalCitation, judgmentData });
  
    // Split original citation by spaces assuming citation format
    const parts = originalCitation.split(' ');
    
    // Extracting the courtInfo from the originalCitation
    const courtInfo = originalCitation.match(/\(([^0-9)]+)\)/g);
    
    //extracting the last for digits for the year
    // Extract year from judgmentDOJ (assuming judgmentDOJ format is ddmmyyyy)
  const year = judgmentData.judgmentDOJ.substring(4); // Extracts the last 4 characters as year

    let newCitation = `${year} ALD Online`; // Replace 'year' with 'judgmentData.judgmentDOJ'
  
    // Add citation serial number if available
    if (judgmentData && judgmentData.CitationSerialNo && judgmentData.CitationSerialNo.serialNumber !== undefined) {
      newCitation = ` ${newCitation} ${judgmentData.CitationSerialNo.serialNumber}`;
    }
  
    if (courtInfo) {
      newCitation += ` ${courtInfo.join(' ')}`;
    }
  
    return newCitation;
  };
  

  const handleCitationClick = (citation) => {
    console.log("Clicked Citation", citation);
    setReferredCitation(citation);
  };

  const isHtml = (text) => /<\/?[a-z][\s\S]*>/i.test(text);


return (
    <div className={styles.scrollableText}>
      {judgmentData ? (
        <>
          {/* Existing code for displaying judgment data */}
          <h3 className={styles.centered}>
            <h4>JUDGEMENT</h4>
            {generateNewCitation(judgmentData.judgmentCitation, judgmentData)}<br /><br /> 
            {highlightText(judgmentData.judgmentCitation, searchTerms)}
            <br /><br/>
            {highlightText(judgmentData.judgmentJudges, searchTerms)}
            <br /><br />
            {judgmentData.judgmentNo || judgmentData.judgmentDOJ ? (
              <>{judgmentData.judgmentNo || formatDate(judgmentData.judgmentDOJ)}</>
            ) : (
              <></>
            )}
            <br /><br />
            {highlightText(judgmentData.judgmentNoText, searchTerms)}
            <br /><br />
            {highlightText(judgmentData.judgmentParties, searchTerms)}
          </h3>
          <div>
            {judgmentData.ShortNotes && judgmentData.ShortNotes.length > 0 ? (
              judgmentData.ShortNotes.map((shortNote) => (
                <div key={shortNote.shortNoteId}>
                  <h4>{extractAndRenderLongNoteLinks(shortNote.shortNoteText).map((element, index) => (
                    React.isValidElement(element) ? (
                      <React.Fragment key={index}>
                        {element}
                      </React.Fragment>
                    ) : (
                      <span key={index}>{highlightText(element, searchTerms)}</span>
                    )
                  ))}</h4>
                  {shortNote.LongNotes && shortNote.LongNotes.map((longNote) => (
                    <React.Fragment key={longNote.longNoteId}>
                      {renderLongNoteParas(longNote.LongNoteParas, searchTerms)}
                    </React.Fragment>
                  ))}
                </div>
              ))
            ) : (
              ''
            )}
          </div>
          <div>
            {judgmentData && judgmentData.judgmentPetitionerCouncil && (
              <h5>Petitioner Counsel: {highlightText(judgmentData.judgmentPetitionerCouncil, searchTerms)}</h5>
            )}
            {judgmentData && judgmentData.judgmentRespondentCouncil && (
              <h5>Respondent Counsel: {highlightText(judgmentData.judgmentRespondentCouncil, searchTerms)}</h5>
            )}
            {judgmentData && judgmentData.judgmentRespondentCouncil && (
              <h5>Counsels Appeared: {highlightText(judgmentData.judgmentRespondentCouncil, searchTerms)}</h5>
            )}
          </div>
          <div>
            {judgmentData && judgmentData.JudgmentTexts ? (
              judgmentData.JudgmentTexts.map((text) => (
                <div key={text.judgementTextId}>
                  <p>{highlightText(text.judgementTextParaText, searchTerms)}</p>
                  {text.judgmentsCiteds && text.judgmentsCiteds.length > 0 && (
                    <div style={{ textAlign: 'left' }}>
                      <h4>Cases Cited:</h4>
                      <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
                        {text.judgmentsCiteds.map((citation, index) => (
                          <li key={index}>
                            {highlightText(citation.judgmentsCitedParties, searchTerms)}
                            <a href="#" onClick={() => handleCitationClick(citation.judgmentsCitedRefferedCitation)}>
                              {highlightText(citation.judgmentsCitedRefferedCitation, searchTerms)}
                            </a>
                            , {highlightText(citation.judgmentsCitedEqualCitation, searchTerms)}
                            {citation.judgmentsCitedParaLink && (
                              <>
                                {extractNumbersFromLink(citation.judgmentsCitedParaLink).map((paraNo, idx) => (
                                  <React.Fragment key={`${index}_${idx}`}>
                                    <a href="#" onClick={() => scrollToPara(paraNo)}>
                                      {`.[Para ${paraNo}]`}
                                    </a>
                                    {idx < extractNumbersFromLink(citation.judgmentsCitedParaLink).length - 1 && ", "}
                                  </React.Fragment>
                                ))}
                              </>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))
            ) : (
              ' '
            )}
          </div>
          <div>
            <h3>JUDGMENT</h3>
            {judgmentData.JudgmentTexts.map((text) =>
              text.JudgmentTextParas.map((para) => (
                <div
                  key={para.judgementTextParaId}
                  ref={(el) => paraRefs.current[para.judgementTextParaNo] = el}
                >
                  {isHtml(para.judgementTextParaText) ? (
                    <div dangerouslySetInnerHTML={{ __html: para.judgementTextParaText }} />
                  ) : (
                    <p>
                      <strong style={{ visibility: 'hidden' }}>{para.judgementTextParaNo}</strong> {highlightText(para.judgementTextParaText, searchTerms)}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </>
      ) : (
        <p>Select a Judgement to View</p>
      )}
    </div>
  );
};

export default JudgmentContent;