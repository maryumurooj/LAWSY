import React, { useState, useEffect } from "react";
import PadTable from "../components/PadTable/PadTable";
import FrontDBPad from "../components/PadTable/FrontDBPad";

export default function PadPage() {
  const [savedData, setSavedData] = useState([]);

  // Function to load data from local storage
  useEffect(() => {
    const data = localStorage.getItem("padData");
    if (data) {
      setSavedData(JSON.parse(data));
    }
  }, []);

  // Function to clear data from local storage and state
  const clearData = () => {
    localStorage.removeItem("padData");
    setSavedData([]);
  };

  // Function to print only the PadTable
  const printPadTable = () => {
    const originalContent = document.body.innerHTML;
    const tableContent = document.getElementById("padTable").outerHTML;
    document.body.innerHTML = tableContent;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload(); // Reload to reapply event listeners
  };

  return (
    <>
      <div>
        <FrontDBPad clearData={clearData} printPadTable={printPadTable} />
        <PadTable savedData={savedData} />
      </div>
    </>
  );
}
