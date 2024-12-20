import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, updateDoc, doc, getDoc } from 'firebase/firestore'; // Firestore methods
import { db } from '../../services/firebaseConfig'; // Firestore config
import styles from './SubscriptionTable.module.css';
import { PDFDownloadLink, pdf } from '@react-pdf/renderer';
import MyDocument from '../PrintComps/SubPrintComp.jsx';

const SubscriptionTable = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [filteredSubscriptions, setFilteredSubscriptions] = useState([]);
  const [selectedSubscriptions, setSelectedSubscriptions] = useState([]);
  const [printData, setPrintData] = useState(null); // For PDF data
  const [filters, setFilters] = useState({
    planName: '',
    status: '',
    creationDate: '',
    endingDate: '',
    username: '', // New filter for username
  });

  const [updatePlan, setUpdatePlan] = useState('');
  const [updateStatus, setUpdateStatus] = useState('');
  const [usernames, setUsernames] = useState({}); // Store usernames by uid

  // Function to format dates
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    // Formatting the date and time on separate lines
    return `${day}/${month}/${year}\n${hours}:${minutes}:${seconds}`;
  };

  // Fetch the subscriptions and corresponding usernames
  useEffect(() => {
    const fetchSubscriptions = async () => {
      const unsubscribe = onSnapshot(collection(db, 'subscriptions'), async (querySnapshot) => {
        const subscriptionsList = [];
        const usernamesMap = {};

        for (const docSnapshot of querySnapshot.docs) {
          const subData = docSnapshot.data();
          const subscription = { id: docSnapshot.id, ...subData };
          subscriptionsList.push(subscription);

          // Fetch the username from the users collection using uid
          if (subData.uid) {
            const userDoc = await getDoc(doc(db, 'users', subData.uid));
            if (userDoc.exists()) {
              usernamesMap[subData.uid] = userDoc.data().username || 'Unknown User';
            } else {
              usernamesMap[subData.uid] = 'Unknown User'; // Handle case if user is not found
            }
          }
        }

        setSubscriptions(subscriptionsList);
        setFilteredSubscriptions(subscriptionsList);
        setUsernames(usernamesMap); // Store the usernames in state
      }, (error) => {
        console.error('Error fetching subscriptions:', error);
      });

      return () => unsubscribe();
    };

    fetchSubscriptions();
  }, []);

  useEffect(() => {
    const filtered = subscriptions.filter((sub) => {
      const matchesPlan =
        filters.planName === '' || sub.planName === filters.planName;
      const matchesStatus =
        filters.status === '' || sub.subscriptionStatus === filters.status;

      const creationDate = new Date(sub.creationDate);
      const endingDate = new Date(sub.endingDate);

      const matchesCreationDate =
        filters.creationDate === '' || creationDate.toLocaleDateString() === new Date(filters.creationDate).toLocaleDateString();

      const matchesEndingDate =
        filters.endingDate === '' || endingDate.toLocaleDateString() === new Date(filters.endingDate).toLocaleDateString();

      // Filter by username
      const matchesUsername = 
        filters.username === '' || (usernames[sub.uid] && usernames[sub.uid].toLowerCase().includes(filters.username.toLowerCase()));

      return matchesPlan && matchesStatus && matchesCreationDate && matchesEndingDate && matchesUsername;
    });
    setFilteredSubscriptions(filtered);
  }, [filters, subscriptions, usernames]); // Added usernames as a dependency


  // Function to handle changes in the filter inputs
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value
    }));
  };

  const handleCheckboxChange = (id) => {
    setSelectedSubscriptions((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((subId) => subId !== id)
        : [...prevSelected, id]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = filteredSubscriptions.map((sub) => sub.id);
      setSelectedSubscriptions(allIds);
    } else {
      setSelectedSubscriptions([]);
    }
  };

  const handleUpdatePlan = (e) => {
    setUpdatePlan(e.target.value);
  };

  const handleUpdateStatus = (e) => {
    setUpdateStatus(e.target.value);
  };
  const getPlanDetails = (planName) => {
    let durationDays, priceValue;
    switch (planName.toLowerCase()) {
      case 'bronze plan':
        durationDays = 60;
        priceValue = 99;
        break;
      case 'silver plan':
        durationDays = 130;
        priceValue = 399;
        break;
      case 'gold plan':
        durationDays = 360;
        priceValue = 699;
        break;
      case 'free plan': // Correct casing for consistency with other plans
        durationDays = 14;
        priceValue = 0;
        break;
      default:
        durationDays = 0;
        priceValue = 0;
    }
    return { durationDays, priceValue };
  };


  const handleUpdateSubscriptions = async () => {
    const updates = selectedSubscriptions.map(async (subId) => {
      const subRef = doc(db, 'subscriptions', subId);
      const { durationDays, priceValue } = getPlanDetails(updatePlan);

      const currentSub = subscriptions.find(sub => sub.id === subId);

      if (!currentSub) return;

      const currentDate = new Date();
      const creationDate = currentDate.toISOString();
      let endingDate;

      if (currentSub.endingDate) {
        const currentEndingDate = new Date(currentSub.endingDate);
        endingDate = new Date(currentEndingDate);
        endingDate.setDate(currentEndingDate.getDate() + (durationDays - currentSub.duration));
      } else {
        endingDate = new Date(currentDate);
        endingDate.setDate(currentDate.getDate() + durationDays);
      }

      await updateDoc(subRef, {
        planName: updatePlan,
        subscriptionStatus: updateStatus,
        price: priceValue,
        duration: durationDays,
        creationDate: creationDate,
        endingDate: endingDate.toISOString(),
      });
    });

    await Promise.all(updates);
    setSelectedSubscriptions([]);
    setUpdatePlan('');
    setUpdateStatus('');
  };

  // Clear filter fields and selected subscriptions
  const handleClearFilters = () => {
    setFilters({
      planName: '',
      status: '',
      creationDate: '',
      endingDate: ''
    });
    setSelectedSubscriptions([]);
  };

  // Refresh subscriptions
  const handleRefreshSubscriptions = () => {
    setSubscriptions([]); // Clear current subscriptions to trigger re-fetching
    const fetchSubscriptions = () => {
      const unsubscribe = onSnapshot(collection(db, 'subscriptions'), (querySnapshot) => {
        const subscriptionsList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSubscriptions(subscriptionsList);
        setFilteredSubscriptions(subscriptionsList);
      }, (error) => {
        console.error('Error fetching subscriptions:', error);
      });

      return () => unsubscribe();
    };

    fetchSubscriptions();
  };

  const handlePrint = async () => {
    const formattedData = filteredSubscriptions.map(sub => ({
      username: usernames[sub.uid] || 'Unknown User',
      planName: sub.planName,
      subscriptionStatus: sub.subscriptionStatus,
      price: sub.price,
      duration: sub.duration,
      creationDate: formatDate(sub.creationDate),
      endingDate: formatDate(sub.endingDate),
    }));
  
    // Generate the PDF document component with formatted data
    const MyDocumentComponent = (
      <MyDocument data={formattedData} timestamp={new Date().toLocaleString()} />
    );
  
    // Generate the PDF as a blob
    const pdfBlob = await pdf(MyDocumentComponent).toBlob();
    const url = URL.createObjectURL(pdfBlob);
  
    // Open the blob in a new tab for preview
    window.open(url);
  };
  

  return (
    <div>
      <h2>Subscription Plans</h2>

      

      {/* Filter Input Fields */}
      <div style={{ marginBottom: '20px' }}>
      <input
        className={styles.inputField} // Use the new class
        type="text"
        name="username"
        value={filters.username}
        onChange={handleFilterChange}
        placeholder="Filter by Username"
    />
        <label>
          <select 
            name="planName" 
            value={filters.planName} 
            onChange={handleFilterChange}
            className={styles.inputField}
          >
            <option value="">Search By Plan</option>
            <option value="Gold Plan">Gold</option>
            <option value="Silver Plan">Silver</option>
            <option value="Bronze Plan">Bronze</option>
            <option value="Free Plan">Free</option>

          </select>
        </label>
        <label>
          <select 
            name="status" 
            value={filters.status} 
            onChange={handleFilterChange}
            className={styles.inputField}
          >
            <option value="">Search By Status</option>
            <option value="pending">Pending</option>
            <option value="active">Active</option>
          </select>
        </label>
        <label>
          Creation Date: 
          <input 
            type="date" 
            name="creationDate" 
            value={filters.creationDate} 
            onChange={handleFilterChange}
            className={styles.inputField}
          />
        </label>
        <label>
          Ending Date: 
          <input 
            type="date" 
            name="endingDate" 
            value={filters.endingDate} 
            onChange={handleFilterChange}
            className={styles.inputField}
          />
        </label>
      </div>

      {/* Update and Control Options */}
      <div style={{ marginBottom: '20px' }}>
        <label>
          <select value={updatePlan} onChange={handleUpdatePlan} className={styles.inputField}>
            <option value="">Select Plan To Update</option>
            <option value="Gold Plan">Gold</option>
            <option value="Silver Plan">Silver</option>
            <option value="Bronze Plan">Bronze</option>
            <option value="Free Plan">Free</option>

          </select>
        </label>
        <label>
          <select value={updateStatus} onChange={handleUpdateStatus} className={styles.inputField}>
            <option value="">Select Status To Update</option>
            <option value="pending">Pending</option>
            <option value="active">Active</option>
          </select>
        </label>
        <button onClick={handleUpdateSubscriptions} className={styles.subscriptionButton}>Update Selected</button>
        <button onClick={handleClearFilters} className={styles.subscriptionButton}>Clear Filters</button>
        <button onClick={handleRefreshSubscriptions} className={styles.subscriptionButton}>Refresh Subscriptions</button>
        <button onClick={handlePrint} className={styles.subscriptionButton}>Print Subscriptions</button>

      </div>

      {/* Subscription Table */}
      <table className={styles.subscriptionTable}>
        <thead>
          <tr>
            <th>
              <input 
                type="checkbox" 
                onChange={handleSelectAll} 
                checked={selectedSubscriptions.length === filteredSubscriptions.length && filteredSubscriptions.length > 0}
              />
            </th>
            <th>User</th>
            <th>Plan</th>
            <th>Status</th>
            <th>Price</th>
            <th>Duration (Days)</th>
            <th>Creation Date</th>
            <th>Ending Date</th>
          </tr>
        </thead>
        <tbody>
          {filteredSubscriptions.map((sub) => (
            <tr key={sub.id} className={selectedSubscriptions.includes(sub.id) ? styles.selectedRow : ''}>
              <td>
                <input 
                  type="checkbox" 
                  checked={selectedSubscriptions.includes(sub.id)}
                  onChange={() => handleCheckboxChange(sub.id)} 
                />
              </td>
              <td>{usernames[sub.uid] || 'Loading...'}</td> {/* Display the username */}
              <td>{sub.planName}</td>
              <td>{sub.subscriptionStatus}</td>
              <td>{sub.price}</td>
              <td>{sub.duration}</td>
              <td>{formatDate(sub.creationDate)}</td>
              <td>{formatDate(sub.endingDate)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SubscriptionTable;
