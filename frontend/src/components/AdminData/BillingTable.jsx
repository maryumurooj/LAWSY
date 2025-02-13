import React, { useState, useEffect, useRef } from 'react';
import { db } from '../../services/firebaseConfig'; // Firestore config
import { collection, query, onSnapshot, updateDoc, doc } from 'firebase/firestore'; // Firestore methods
import styles from './BillingTable.module.css'; // BillingTable styles
import { pdf } from '@react-pdf/renderer'; // PDF generation
import BillingPrintComp from '../PrintComps/BillingPrintComp'; // Your Billing Print Component


const BillingTable = () => {
  // State to hold billing data
  const [billingData, setBillingData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  // States for filtering inputs
  const [searchFirstName, setSearchFirstName] = useState('');
  const [searchLastName, setSearchLastName] = useState('');
  const [searchPhone, setSearchPhone] = useState('');
  const [searchAlternatePhone, setSearchAlternatePhone] = useState('');
  const [searchEmail, setSearchEmail] = useState('');
  const [searchCity, setSearchCity] = useState('');
  const [searchDistrict, setSearchDistrict] = useState('');
  const [searchState, setSearchState] = useState('');
  const [searchPincode, setSearchPincode] = useState('');
  const [searchFullAddress, setSearchFullAddress] = useState('');
  const [searchPaymentMethod, setSearchPaymentMethod] = useState('');
  const [searchPaymentStatus, setSearchPaymentStatus] = useState('');
  const [searchRepresentative, setSearchRepresentative] = useState('');
  const [searchCreationDate, setSearchCreationDate] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');

  // Additional states for updating selected rows
  const [selectedRows, setSelectedRows] = useState([]);
  const [updatePaymentStatus, setUpdatePaymentStatus] = useState('');
  const [updateRepresentative, setUpdateRepresentative] = useState('');

  const stateCityDistrictMap = {
    "Andhra Pradesh": {
      cities: ["Visakhapatnam", "Vijayawada", "Guntur", "Tirupati", "Nellore"],
      districts: ["Visakhapatnam", "Krishna", "Guntur", "Chittoor", "Nellore"]
    },
  };

  // Fetch billing data from Firestore
  useEffect(() => {
    const billingQuery = query(collection(db, 'billing'));
    const billingUnsubscribe = onSnapshot(billingQuery, (querySnapshot) => {
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBillingData(data);
      setFilteredData(data); // Set filtered data to the complete list initially
    }, (error) => {
      console.error('Error fetching billing data:', error);
    });

    return () => {
      billingUnsubscribe(); // Cleanup subscription for billing data
    };
  }, []);

  // Filter function based on input fields
  useEffect(() => {
    const filterResults = billingData.filter(bill => {
      return (
        bill.firstName.toLowerCase().includes(searchFirstName.toLowerCase()) &&
        bill.lastName.toLowerCase().includes(searchLastName.toLowerCase()) &&
        bill.phone.includes(searchPhone) &&
        (bill.alternatePhone?.includes(searchAlternatePhone) || 'N/A'.includes(searchAlternatePhone)) &&
        bill.email.toLowerCase().includes(searchEmail.toLowerCase()) &&
        (bill.city && bill.city.toLowerCase().includes(searchCity.toLowerCase())) &&
        (bill.district && bill.district.toLowerCase().includes(searchDistrict.toLowerCase())) &&
        (bill.state && bill.state.toLowerCase().includes(searchState.toLowerCase())) &&
        bill.pincode.includes(searchPincode) &&
        bill.fullAddress.toLowerCase().includes(searchFullAddress.toLowerCase()) &&
        bill.paymentMethod.toLowerCase().includes(searchPaymentMethod.toLowerCase()) &&
        bill.payment.toLowerCase().includes(searchPaymentStatus.toLowerCase()) &&
        (bill.representative?.toLowerCase().includes(searchRepresentative.toLowerCase()) || 'N/A'.includes(searchRepresentative.toLowerCase())) &&
        new Date(bill.creationDate).toLocaleDateString().includes(searchCreationDate)
      );
    });
    setFilteredData(filterResults);
  }, [
    searchFirstName, searchLastName, searchPhone, searchAlternatePhone, searchEmail, searchCity, searchDistrict,
    searchState, searchPincode, searchFullAddress, searchPaymentMethod, searchPaymentStatus, searchRepresentative, 
    searchCreationDate, billingData
  ]);

  // Handle state, city, district changes
  const handleStateChange = (e) => {
    const newState = e.target.value;
    setSelectedState(newState);
    setSelectedCity(''); // Reset city when state changes
    setSelectedDistrict(''); // Reset district when state changes
    setSearchState(newState);
  };

  const handleCityChange = (e) => {
    const newCity = e.target.value;
    setSelectedCity(newCity);
    setSelectedDistrict(''); // Reset district when city changes
    setSearchCity(newCity);
  };

  const handleDistrictChange = (e) => {
    const newDistrict = e.target.value;
    setSelectedDistrict(newDistrict);
    setSearchDistrict(newDistrict);
  };

  // Handle row selection
  const handleRowSelection = (id) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter(rowId => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  // Update selected rows
  const handleUpdate = async () => {
    try {
      for (let rowId of selectedRows) {
        const docRef = doc(db, 'billing', rowId);
        await updateDoc(docRef, {
          payment: updatePaymentStatus,
          representative: updateRepresentative,
        });
      }
      alert('Rows updated successfully');
      setSelectedRows([]); // Clear selection after update
      setUpdatePaymentStatus(''); // Reset update fields
      setUpdateRepresentative('');
    } catch (error) {
      console.error('Error updating rows:', error);
      alert('Failed to update rows');
    }
  };

  //print
  const printInProgress = useRef(false);
  const [loading, setLoading] = useState(false);


  const printBillingData = async () => {
    if (printInProgress.current) return;

    printInProgress.current = true;
    setLoading(true);

    const formattedBillingData = filteredData.map((bill) => ({
      ...bill,
      creationDate: new Date(bill.creationDate).toLocaleDateString(),
    }));

    setLoading(false);
    const timestamp = new Date().toLocaleString();

    const MyDocumentComponent = (
      <BillingPrintComp data={formattedBillingData} timestamp={timestamp} />
    );

    const pdfBlob = await pdf(MyDocumentComponent).toBlob();
    const url = URL.createObjectURL(pdfBlob);
    window.open(url);

    setLoading(false);
    printInProgress.current = false;
  };


  return (
    <div className={styles.billingTableContainer}>
      <h2>Billing Information Table</h2>

      {/* Filtering Input Fields */}
      <div className={styles.filterContainer}>
        {/* Add filtering inputs here (same as before) */}
        <button
        className={styles.printButton}
        onClick={printBillingData}
        disabled={filteredData.length === 0}
      >
        Print Billing Data
      </button>
      
        <input
          type="text"
          className={styles.inputField}
          placeholder="First Name"
          value={searchFirstName}
          onChange={(e) => setSearchFirstName(e.target.value)}
        />
        <input
          type="text"
          className={styles.inputField}
          placeholder="Last Name"
          value={searchLastName}
          onChange={(e) => setSearchLastName(e.target.value)}
        />
        <input
          type="text"
          className={styles.inputField}
          placeholder="Phone"
          value={searchPhone}
          onChange={(e) => setSearchPhone(e.target.value)}
        />
        <input
          type="text"
          className={styles.inputField}
          placeholder="Alternate Phone"
          value={searchAlternatePhone}
          onChange={(e) => setSearchAlternatePhone(e.target.value)}
        />
        <input
          type="text"
          className={styles.inputField}
          placeholder="Email"
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
        />
        <input
          type="text"
          className={styles.inputField}
          placeholder="City"
          value={searchCity}
          onChange={(e) => setSearchCity(e.target.value)}
        />
        <input
          type="text"
          className={styles.inputField}
          placeholder="District"
          value={searchDistrict}
          onChange={(e) => setSearchDistrict(e.target.value)}
        />
        <input
          type="text"
          className={styles.inputField}
          placeholder="State"
          value={searchState}
          onChange={(e) => setSearchState(e.target.value)}
        />
        <input
          type="text"
          className={styles.inputField}
          placeholder="Pincode"
          value={searchPincode}
          onChange={(e) => setSearchPincode(e.target.value)}
        />
        <input
          type="text"
          className={styles.inputField}
          placeholder="Full Address"
          value={searchFullAddress}
          onChange={(e) => setSearchFullAddress(e.target.value)}
        />
        <select
          type="text"
          className={styles.inputField}
          placeholder="Last Name"
          value={searchLastName}
          onChange={(e) => setSearchLastName(e.target.value)}
        />
        {/* Other filtering inputs... */}

        {/* State, City, District Selectors */}
        <select value={selectedState} onChange={handleStateChange} className={styles.inputField}>
          <option value="">Select State</option>
          {Object.keys(stateCityDistrictMap).map(state => (
            <option key={state} value={state}>{state}</option>
          ))}
        </select>
        <select value={selectedCity} onChange={handleCityChange} className={styles.inputField}>
          <option value="">Select City</option>
          {selectedState && stateCityDistrictMap[selectedState].cities.map(city => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
        <select value={selectedDistrict} onChange={handleDistrictChange} className={styles.inputField}>
          <option value="">Select District</option>
          {selectedState && stateCityDistrictMap[selectedState].districts.map(district => (
            <option key={district} value={district}>{district}</option>
          ))}
        </select>

        {/* Add Payment Status and Representative Select */}
        <select
          value={updatePaymentStatus}
          onChange={(e) => setUpdatePaymentStatus(e.target.value)}
          className={styles.inputField}
        >
          <option value="">Select Payment Status</option>
          <option value="Pending">Pending</option>
          <option value="Successful">Successful</option>
        </select>

        <select
          value={updateRepresentative}
          onChange={(e) => setUpdateRepresentative(e.target.value)}
          className={styles.inputField}
        >
          <option value="">Select Representative</option>
          <option value="Yasir">Yasir</option>
          <option value="Maryum">Maryum</option>
          <option value="Affan">Affan</option>
        </select>

        <button onClick={handleUpdate} className={styles.updateButton}>
          Update Selected Rows
        </button>
      </div>

      {/* Billing Data Table */}
      <table className={styles.billingTable}>
        <thead>
          <tr>
            <th>Select</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Phone</th>
            <th>Alternate Phone</th>
            <th>Email</th>
            <th>City</th>
            <th>District</th>
            <th>State</th>
            <th>Pincode</th>
            <th>Full Address</th>
            <th>Payment Method</th>
            <th>Payment Status</th>
            <th>Representative</th>
            <th>Creation Date</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map(bill => (
            <tr key={bill.id}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedRows.includes(bill.id)}
                  onChange={() => handleRowSelection(bill.id)}
                />
              </td>
              <td>{bill.firstName}</td>
              <td>{bill.lastName}</td>
              <td>{bill.phone}</td>
              <td>{bill.alternatePhone || 'N/A'}</td>
              <td>{bill.email}</td>
              <td>{bill.city}</td>
              <td>{bill.district}</td>
              <td>{bill.state}</td>
              <td>{bill.pincode}</td>
              <td>{bill.fullAddress}</td>
              <td>{bill.paymentMethod}</td>
              <td>{bill.payment}</td>
              <td>{bill.representative || 'N/A'}</td>
              <td>{new Date(bill.creationDate).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BillingTable;
