import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Table } from 'reactstrap';
import styles from './JudgmentsTable.module.css';

const JudgmentsTable = ({ judgmentData, onRowClick, selectedRow }) => {
    const [sortedData, setSortedData] = useState(judgmentData);
    const [sortDirection, setSortDirection] = useState('desc');

    useEffect(() => {
        setSortedData(judgmentData);
    }, [judgmentData]);

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
                        <th className={styles.customTh} style={{ cursor: 'pointer' }}>S.No.</th>
                        <th className={styles.customTh} onClick={handleSort} style={{ cursor: 'pointer' }}>
                            DOJ {sortDirection === 'asc' ? '↑' : '↓'}
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
                                <td className={styles.customTd}>{index + 1}</td> {/* Serial number */}
                                <td className={styles.customTd}>{formatDate(judgment.judgmentDOJ)}</td>
                                <td className={`${styles.customTd} ${styles.citationColumn}`}>{judgment.judgmentCitation}</td>
                                <td className={styles.customTd}>{judgment.judgmentParties}</td>
                                <td className={`${styles.customTd} ${styles.courtColumn}`}>{judgment.courtName}</td>
                                </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5">No results found</td>
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
};

export default JudgmentsTable;
