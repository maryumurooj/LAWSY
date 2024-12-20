import React, { useState, useEffect } from 'react';
import styles from './BillAdd.module.css';
import { useNavigate } from 'react-router-dom';
import { db } from '../../services/firebaseConfig'; // Firestore config
import { doc, setDoc } from 'firebase/firestore';
import { useAuth } from '../../services/AuthContext'; // Auth context
import LoginPageImage from '../../assets/LoginPage.png'; // Import the image file

const BillingForm = ({ subscriptionId }) => {
  const navigate = useNavigate();
  const { user } = useAuth(); // Get the logged-in user's UID

  // State for handling form input data
  const [billingData, setBillingData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    alternatePhone: '',
    email: '',
    fullAddress: '',
    city: '',
    district: '',
    pincode: '',
    paymentMethod: 'online', // Default to 'online' payment
    representative: null,
    payment: 'pending',
    subscriptionId: subscriptionId || '', // Subscription ID passed from props
  });

  useEffect(() => {
    setBillingData((prevData) => ({ ...prevData, subscriptionId })); // Update subscriptionId dynamically
  }, [subscriptionId]);

  // Handle input change for form fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBillingData({ ...billingData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !billingData.subscriptionId) {
      alert('User must be logged in and subscription ID is required.');
      return;
    }

    const finalBillingData = {
      ...billingData,
      uid: user.uid, // Add the current user's UID
      creationDate: new Date().toISOString(), // Add a timestamp
    };

    try {
      await setDoc(doc(db, 'billing', user.uid), finalBillingData); // Save to Firestore
      alert('Billing information saved successfully!');
      navigate('/DashBoard'); // Redirect after successful submission
    } catch (error) {
      console.error('Error saving billing info:', error);
      alert('Failed to save billing information. Please try again.');
    }
  };

  return (
    <div 
      className={styles.billingContainer}
      style={{
        backgroundImage: `url(${LoginPageImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center 80%',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div className={styles.signupForm}>
        <h2 className={styles.signupTitle}>Billing Address</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputContainer}>
            <input
              type="text"
              name="firstName"
              className={styles.inputField}
              placeholder="First Name"
              value={billingData.firstName}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="lastName"
              className={styles.inputField}
              placeholder="Last Name"
              value={billingData.lastName}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className={styles.inputContainer}>
            <input
              type="text"
              name="phone"
              className={styles.inputField}
              placeholder="Phone"
              value={billingData.phone}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="alternatePhone"
              className={styles.inputField}
              placeholder="Alternate Phone"
              value={billingData.alternatePhone}
              onChange={handleInputChange}
            />
          </div>

          <div className={styles.inputContainer}>
            <input
              type="email"
              name="email"
              className={styles.inputField}
              placeholder="Email"
              value={billingData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className={styles.inputContainer}>
            <input
              type="text"
              name="fullAddress"
              className={styles.inputField}
              placeholder="Full Address"
              value={billingData.fullAddress}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className={styles.inputContainer}>
            <input
              type="text"
              name="city"
              className={styles.inputField}
              placeholder="City"
              value={billingData.city}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="district"
              className={styles.inputField}
              placeholder="District"
              value={billingData.district}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="pincode"
              className={styles.inputField}
              placeholder="Pincode"
              value={billingData.pincode}
              onChange={handleInputChange}
              required
            />
          </div>

          <h3>Select Payment Method</h3>
          <div className={styles.inputContainer}>
            <label>
              <input
                type="radio"
                name="paymentMethod"
                value="cash"
                checked={billingData.paymentMethod === 'cash'}
                onChange={handleInputChange}
              />
              Cash
            </label>
            <label>
              <input
                type="radio"
                name="paymentMethod"
                value="online"
                checked={billingData.paymentMethod === 'online'}
                onChange={handleInputChange}
              />
              Online
            </label>
          </div>

          <button type="submit" className={styles.submitButton}>
            Submit Billing Info
          </button>
        </form>
      </div>
    </div>
  );
};

export default BillingForm;
