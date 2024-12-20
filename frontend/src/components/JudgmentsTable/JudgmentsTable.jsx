import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Table } from 'reactstrap';
import styles from './JudgmentsTable.module.css';

const JudgmentsTable = ({ judgmentData, onRowClick, selectedRow, court, fromDate, toDate }) => {
    const [sortedData, setSortedData] = useState(judgmentData);
    const [sortDirection, setSortDirection] = useState('desc');

    useEffect(() => {
        const filterData = () => {
            return judgmentData.filter(judgment => {
                const judgmentDate = judgment.judgmentDOJ; // assuming judgmentDOJ is in YYYYMMDD format
                const formattedJudgmentDate = `${judgmentDate.slice(4, 8)}-${judgmentDate.slice(2, 4)}-${judgmentDate.slice(0, 2)}`;
                const judgmentDateObj = new Date(formattedJudgmentDate);
                const fromDateObj = fromDate ? new Date(fromDate) : new Date('1900-01-01');
                const toDateObj = toDate ? new Date(toDate) : new Date();

                return (!court || judgment.courtName === court) &&
                    (!fromDate || judgmentDateObj >= fromDateObj) &&
                    (!toDate || judgmentDateObj <= toDateObj);
            });
        };

        setSortedData(filterData());
    }, [judgmentData, court, fromDate, toDate]);

    const handleSort = () => {
        const direction = sortDirection === 'desc' ? 'asc' : 'desc';
        const sorted = [...sortedData].sort((a, b) => {
            if (direction === 'asc') {
                return a.judgmentCitation.localeCompare(b.judgmentCitation);
            } else {
                return b.judgmentCitation.localeCompare(a.judgmentCitation);
            }
        });
        setSortedData(sorted);
        setSortDirection(direction);
    };

    const formatDate = (dateString) => {
        if (!dateString || dateString.length !== 8) return dateString;
        const day = dateString.slice(0, 2);
        const month = dateString.slice(2, 4);
        const year = dateString.slice(4, 8);
        return `${day}/${month}/${year}`;
    };

    const handleRowClick = (judgment, index) => {
        onRowClick(judgment); // Notify parent component with selected judgment
        window.scrollTo({
            top: 120,
            behavior: 'smooth'
        });
    };

    return (
        <div className={styles.tableContainer}>
            <Table striped bordered hover className={styles.table}>
                <thead>
                    <tr>
                        <th className={styles.customTh} onClick={handleSort} style={{ cursor: 'pointer' }}>
                            Date of Judgment {sortDirection === 'asc' ? '↑' : '↓'}
                        </th>
                        <th className={styles.customTh} onClick={handleSort} style={{ cursor: 'pointer' }}>
                            Citation {sortDirection === 'asc' ? '↑' : '↓'}
                        </th>
                        <th className={styles.customTh}>Parties</th>
                        <th className={styles.customTh}>Court</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedData.length > 0 ? (
                        sortedData.map((judgment, index) => (
                            <tr
                                key={index}
                                className={`${styles.customTr} ${selectedRow === judgment ? styles.clicked : ''}`}
                                onClick={() => handleRowClick(judgment)}
                            >
                                <td className={styles.customTd}>{formatDate(judgment.judgmentDOJ)}</td>
                                <td className={styles.customTd}>{judgment.judgmentCitation}</td>
                                <td className={styles.customTd}>{judgment.judgmentParties}</td>
                                <td className={styles.customTd}>{judgment.courtName}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4">No results found</td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </div>
    );
};

JudgmentsTable.propTypes = {
    judgmentData: PropTypes.array.isRequired,
    onRowClick: PropTypes.func.isRequired,
    selectedRow: PropTypes.object, // PropType for selectedRow
    court: PropTypes.string, // PropType for court
    fromDate: PropTypes.string, // PropType for fromDate
    toDate: PropTypes.string // PropType for toDate
};

export default JudgmentsTable;
