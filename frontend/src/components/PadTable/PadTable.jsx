import React from "react";
import Styles from "./PadTable.module.css";

function PadTable({ savedData }) {
  const formatDate = (dateString) => {
    if (!dateString || dateString.length !== 8) return dateString;
    const day = dateString.slice(0, 2);
    const month = dateString.slice(2, 4);
    const year = dateString.slice(4, 8);
    return `${day}-${month}-${year}`;
  };

  return (
    <div id="padTable" className={Styles.tableContainer}>
      <table className={Styles.table}>
        <thead>
          <tr className={Styles.tr}>
            <th>SL</th>
            <th>Date of Judgment</th>
            <th>Citation</th>
            <th>Parties</th>
            <th>Court</th>
          </tr>
        </thead>
        <tbody>
          {savedData.length > 0 ? (
            savedData.map((judgment, index) => (
              <tr key={index} className={Styles.tr}>
                <td className={Styles.td}>{index + 1}</td>
                <td className={Styles.td}>{formatDate(judgment.judgmentDOJ)}</td>
                <td className={Styles.td}>{judgment.judgmentCitation}</td>
                <td className={Styles.td}>{judgment.judgmentParties}</td>
                <td className={Styles.td}>{judgment.judgmentNo}</td>
              </tr>
            ))
          ) : (
            <tr className={Styles.tr}>
              <td colSpan="5">No data saved to Pad</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default PadTable;
