import React, { useState, useEffect } from 'react';
import SubHeader from "../components/SubHeader/SubHeader.jsx";
import FrontDashboard from "../components/FrontDashboard/FrontDashboard";
import EditBar from "../components/EditBar/EditBar.jsx";
import RearDashboard from "../components/RearDashboard/RearDashboard";
import styles from "./IndexPage.module.css";
import SidePanel from "../components/SidePanel/SidePanel";
import JudgmentsTable from "../components/JudgmentsTable/JudgmentsTable.jsx";

const IndexPage = () => {
    const [judgmentData, setJudgmentData] = useState(null);
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

    const toOrdinal = (num) => {
        const suffixes = ["th", "st", "nd", "rd"];
        const v = num % 100;
        return num + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
    };

    const handleJudgmentSearch = async (judgmentId) => {
        console.log('Fetching data for judgmentId:', judgmentId);
        try {
            const response = await fetch(`http://localhost:3000/api/judgments/${judgmentId}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log("Received data:", data);
            setJudgmentData(data);
        } catch (error) {
            console.error('Error fetching judgment:', error);
            setError(error);
            setJudgmentData(null);
        }
    };

    const handleRowClick = (data) => {
        console.log('Row clicked with data:', data);
        handleJudgmentSearch(data.judgmentId);
    };

    useEffect(() => {
        console.log("Judgment data updated:", judgmentData);
    }, [judgmentData]);

    return (
        <div>
            <SubHeader judgmentData={judgmentData} />
            <FrontDashboard />
            
            {error && <p>Error: {error.message}</p>}
            <div className={styles.sideNscroll}>
                <SidePanel setResults={setResults} setJudgmentCount={setJudgmentCount} setError={setError} />

                <div className={styles.scrollableText}>
                    <h3 className={styles.centered}>
                         
                            <>
                                judgmentCitation
                                judgmentCourtText
                                <br /><br /><br />
                               judgmentJudges
                               

                                { judgmentNo ||  judgmentDOJ ? (
                                    <>{ judgmentNo || formatDate( judgmentDOJ)}</>
                                ) : (
                                    <></>
                                )}
=
                                judgmentNoText
                                <br /><br />
                                judgmentParties
                                <br /><br />
                            </>
                        ) : (
                            'Please select a judgment from the table'
                        )
                    </h3>

                    {/* Short Notes */}
                    <div>
                        {
                            
                                short note and long notes here
                        ) : (
                            'No short notes available'
                        )}
                    </div>

                    {/* Citations */}
                    <div>
                        
                                                        {  judgmentsCitedParties}
                                                        {  judgmentsCitedEqualCitation}
                                                        {  judgmentsCitedRefferedCitation  judgmentsCitedRefferedCitation}
                                                        {  judgmentsCitedParaLink 
                                                        judgmentsCitedParaLink})`} from judgmentsCited table here
                                                 
                        ) : (
                            'No judgment text available'
                        )}
                    </div>

                    {/* Judgment Texts */}
                    <div>
                        judgmenttexxtpara from judgementtext  table here
                    </div>
                </div>
                <EditBar />
            </div>
            <RearDashboard />
            <div>
                <div>Judgments retrieved: {judgmentCount}</div>
                {results.length > 0 ? (
                    <JudgmentsTable judgmentData={results} onRowClick={handleRowClick} />
                ) : (
                    <p>No results found</p>
                )}
            </div>
        </div>
    );
};

export default IndexPage;
