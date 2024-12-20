// src/components/Statutes/SearchResultsTable.jsx
import React from 'react';
import styles from './Table.module.css';

const SearchResultsTable = ({ uniqueResults }) => {
  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.customTh}>Date of Judgment</th>
            <th className={styles.customTh} >Citation</th>
            <th className={styles.customTh} >Parties</th>
            <th className={styles.customTh} >Court</th>
          </tr>
        </thead>
        <tbody>
          {uniqueResults.map((result, index) => (
            <tr key={index} className={`${styles.customTr}`} >
              <td className={styles.customTd} >{result.judgmentDOJ}</td>
              <td className={styles.customTd}>{result.judgmentCitation}</td>
              <td className={styles.customTd}>{result.judgmentParties}</td>
              <td className={styles.customTd}>{result.courtName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SearchResultsTable;
