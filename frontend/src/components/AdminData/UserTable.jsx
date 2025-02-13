import React, { useEffect, useState, useRef } from 'react';
import { collection, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore'; // Import Firestore methods
import { db } from '../../services/firebaseConfig'; // Import your Firestore config
import styles from './UserTable.module.css'; // Import CSS for table styling
import { useReactToPrint } from 'react-to-print'; // Import react-to-print
import PrintComp from '../PrintComps/UsersPrintComp.jsx'; // Import PrintComp
import { pdf } from '@react-pdf/renderer'; // Import PDF generation functionality
import MyDocument from '../PrintComps/UsersPrintComp.jsx'; // Your PDF component


const UsersTable = () => {
  const [users, setUsers] = useState([]); // State to store fetched users
  const [filteredUsers, setFilteredUsers] = useState([]); // State to store filtered users
  const [filters, setFilters] = useState({
    username: '',
    email: '',
    role: '',
    subscriptionStatus: ''
  }); // State to store filter values
  const [selectedUsers, setSelectedUsers] = useState([]); // State to manage selected users for bulk editing


  //print
  const [printData, setPrintData] = useState(null); // State to hold the data for printing
  const printInProgress = useRef(false);
  const [loading, setLoading] = useState(false);
  const [downloadKey, setDownloadKey] = useState(null);
  const printTable = async () => {
    if (printInProgress.current) {
      return; // Prevent multiple print actions simultaneously
    }
  
    printInProgress.current = true;
    setLoading(true);
  
    // Format the user data for printing (similar to the formattedData in Project A)
    const formattedUserData = filteredUsers.map((user) => ({
      ...user,
      creationDate: formatDate(user.creationDate) // Format the date if necessary
    }));
  
    setLoading(false);
  
    const timestamp = new Date().toLocaleString(); // Generate current timestamp
    setDownloadKey(timestamp); // Update the state to trigger re-render
  
    const existingPrintContainer = document.getElementById('print-container');
    if (existingPrintContainer) {
      existingPrintContainer.remove(); // Remove existing print container
    }
  
    const printContainer = document.createElement('div');
    printContainer.id = 'print-container';
    document.body.appendChild(printContainer);
  
    const MyDocumentComponent = (
      <MyDocument data={formattedUserData} timestamp={timestamp} />
    );
  
    // Generate the PDF and open it in a new tab for preview
    const handlePreview = async () => {
      const pdfBlob = await pdf(MyDocumentComponent).toBlob();
      const url = URL.createObjectURL(pdfBlob);
      window.open(url); // Open the PDF in a new tab for preview
  
      setTimeout(() => {
        if (printContainer.parentNode) {
          document.body.removeChild(printContainer);
        }
        // Reset state variables after printing
        setLoading(false);
        setDownloadKey(null);
        printInProgress.current = false; // Allow new print actions
      }, 1000); // Adjust delay as needed
    };
  
    handlePreview();
  };
  


  // Function to fetch users from Firestore
  const fetchUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'users')); // Fetch users from the 'users' collection
      const userData = querySnapshot.docs.map((doc) => ({
        id: doc.id, // Include the document ID for updating
        ...doc.data()
      }));
      setUsers(userData); // Update the state with fetched user data
      setFilteredUsers(userData); // Initialize filtered users
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchUsers(); // Fetch users when the component mounts
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);

    // Extracting day, month, year, hours, minutes, and seconds
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    // Formatting the date and time on separate lines
    return `${day}/${month}/${year}\n${hours}:${minutes}:${seconds}`;
  };





  // Function to handle changes in the filter inputs
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value
    }));
  };

  // Function to apply filters and update the filtered users list
  const applyFilters = () => {
    const filtered = users.filter((user) => {
      return (
        (user.username.toLowerCase().includes(filters.username.toLowerCase()) || filters.username === '') &&
        (user.email.toLowerCase().includes(filters.email.toLowerCase()) || filters.email === '') &&
        (user.role.toLowerCase().includes(filters.role.toLowerCase()) || filters.role === '') &&
        (user.subscriptionStatus.toLowerCase() === filters.subscriptionStatus.toLowerCase() || filters.subscriptionStatus === '') // Exact match for subscriptionStatus
      );
    });
    setFilteredUsers(filtered); // Update filtered users state
  };

  // Reapply filters when the filter inputs change
  useEffect(() => {
    applyFilters();
  }, [filters, users]);

  // Function to toggle role (user/admin)
  const toggleRole = async (userId, currentRole) => {
    const newRole = currentRole === 'user' ? 'admin' : 'user'; // Toggle between user/admin
    try {
      await updateDoc(doc(db, 'users', userId), { role: newRole }); // Update the user's role in Firestore
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      ); // Update the local state and trigger re-filtering
    } catch (error) {
      console.error('Error updating role:', error);
    }
  };

  // Function to toggle subscription status (active/inactive)
  const toggleSubscription = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'inactive' ? 'active' : 'inactive'; // Toggle between active/inactive
    try {
      await updateDoc(doc(db, 'users', userId), { subscriptionStatus: newStatus }); // Update subscription status
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, subscriptionStatus: newStatus } : user
        )
      ); // Update the local state and trigger re-filtering
    } catch (error) {
      console.error('Error updating subscription status:', error);
    }
  };

  // Function to delete a user
  const deleteUser = async (userId) => {
    try {
      await deleteDoc(doc(db, 'users', userId)); // Delete the user from Firestore
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId)); // Remove the user from local state
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  // Function to clear all filter inputs
  const clearFields = () => {
    setFilters({
      username: '',
      email: '',
      role: '',
      subscriptionStatus: ''
    });
    setSelectedUsers([]); // Clear selected users as well
  };

  // Function to refresh the users list
  const refreshUsers = () => {
    fetchUsers();
  };

  // Function to handle checkbox selection
  const handleCheckboxChange = (userId) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId)); // Unselect if already selected
    } else {
      setSelectedUsers([...selectedUsers, userId]); // Select user
    }
  };

// Function for bulk toggle role to user
const bulkToggleRoleToUser = async () => {
    try {
      await Promise.all(selectedUsers.map(userId => {
        return updateDoc(doc(db, 'users', userId), { role: 'user' });
      }));

      // Update local state
      setUsers(prevUsers => prevUsers.map(user => 
        selectedUsers.includes(user.id) ? { ...user, role: 'user' } : user
      ));
      setSelectedUsers([]); // Clear selection after bulk edit
    } catch (error) {
      console.error('Error updating roles to user:', error);
    }
  };

  // Function for bulk toggle role to admin
  const bulkToggleRoleToAdmin = async () => {
    try {
      await Promise.all(selectedUsers.map(userId => {
        return updateDoc(doc(db, 'users', userId), { role: 'admin' });
      }));

      // Update local state
      setUsers(prevUsers => prevUsers.map(user => 
        selectedUsers.includes(user.id) ? { ...user, role: 'admin' } : user
      ));
      setSelectedUsers([]); // Clear selection after bulk edit
    } catch (error) {
      console.error('Error updating roles to admin:', error);
    }
  };

  // Function for bulk toggle subscription to active
  const bulkToggleSubscriptionToActive = async () => {
    try {
      await Promise.all(selectedUsers.map(userId => {
        return updateDoc(doc(db, 'users', userId), { subscriptionStatus: 'active' });
      }));

      // Update local state
      setUsers(prevUsers => prevUsers.map(user => 
        selectedUsers.includes(user.id) ? { ...user, subscriptionStatus: 'active' } : user
      ));
      setSelectedUsers([]); // Clear selection after bulk edit
    } catch (error) {
      console.error('Error updating subscriptions to active:', error);
    }
  };

  // Function for bulk toggle subscription to inactive
  const bulkToggleSubscriptionToInactive = async () => {
    try {
      await Promise.all(selectedUsers.map(userId => {
        return updateDoc(doc(db, 'users', userId), { subscriptionStatus: 'inactive' });
      }));

      // Update local state
      setUsers(prevUsers => prevUsers.map(user => 
        selectedUsers.includes(user.id) ? { ...user, subscriptionStatus: 'inactive' } : user
      ));
      setSelectedUsers([]); // Clear selection after bulk edit
    } catch (error) {
      console.error('Error updating subscriptions to inactive:', error);
    }
  };

  //funciton for bulk delete users
  const bulkDeleteUsers = async () => {
    try {
      await Promise.all(selectedUsers.map(userId => deleteDoc(doc(db, 'users', userId))));
      setUsers(prevUsers => prevUsers.filter(user => !selectedUsers.includes(user.id))); // Update local state
      setSelectedUsers([]); // Clear selection after bulk delete
    } catch (error) {
      console.error('Error deleting users:', error);
    }
  };




  return (
    <div className={styles.tableContainer}>
      <h2>User Data</h2>

      {/* Filter inputs */}
      <div className={styles.filters}>
      <button className={styles.UserButton} onClick={printTable} disabled={filteredUsers.length === 0}>
  Print Users
</button>
{printData && <PrintComp data={printData} />}



      <input
        className={styles.inputField} // Use the new class
        type="text"
        name="username"
        value={filters.username}
        onChange={handleFilterChange}
        placeholder="Filter by Username"
    />
    <input
        className={styles.inputField} // Use the new class
        type="email"
        name="email"
        value={filters.email}
        onChange={handleFilterChange}
        placeholder="Filter by Email"
    />
    <select
        className={styles.selectField} // Use the new class
        name="role"
        value={filters.role}
        onChange={handleFilterChange}
    >
        <option value="">Select Role</option>
        <option value="admin">Admin</option>
        <option value="user">User</option>
    </select>
    <select
        className={styles.selectField} // Use the new class
        name="subscriptionStatus"
        value={filters.subscriptionStatus}
        onChange={handleFilterChange}
    >
        <option value="">Subscription Status</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
    </select>

        {/* Bulk Action Buttons */}
        <div className={styles.bulkActions}>
    <button className={styles.UserButton} onClick={clearFields}>Clear Fields</button>
    <button className={styles.UserButton} onClick={refreshUsers}>Refresh</button>
    <button className={styles.UserButton} onClick={bulkToggleSubscriptionToActive} disabled={selectedUsers.length === 0}>
        Switch to Active
    </button>
    <button className={styles.UserButton} onClick={bulkToggleSubscriptionToInactive} disabled={selectedUsers.length === 0}>
        Switch to Inactive
    </button>
    <button className={styles.UserButton} onClick={bulkToggleRoleToUser} disabled={selectedUsers.length === 0}>
        Switch to User
    </button>
    <button className={styles.UserButton} onClick={bulkToggleRoleToAdmin} disabled={selectedUsers.length === 0}>
        Switch to Admin
    </button>
    <button className={styles.UserButton} onClick={bulkDeleteUsers} disabled={selectedUsers.length === 0}>
        Delete Selected
    </button>
</div>
      </div>

      {/* Users Table */}
      <table className={styles.userTable}>
        <thead>
          <tr>
            <th>Select</th>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Creation Date</th>
            <th>Subscription Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedUsers.includes(user.id)}
                  onChange={() => handleCheckboxChange(user.id)}
                />
              </td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                {formatDate(user.creationDate).split('\n').map((line, index) => (
                  <div key={index}>{line}</div>
                ))}
              </td>        
              <td>{user.subscriptionStatus}</td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
};

export default UsersTable;
