import React, { useState } from 'react';
import styles from './ProfilePage.module.css';
import { Link } from 'react-router-dom';

export default function ProfilePage() {
  // State for edit mode and profile details
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingBilling, setIsEditingBilling] = useState(false); // Separate state for billing edit mode
  const [profile, setProfile] = useState({
    name: 'User Name',
    email: 'mi@xpaytech.co',
    phoneNumber: '+20-01274318900',
    address: '285 N Broad St, Elizabeth, NJ 07208, USA',
    billingAddress: {
      firstName: 'John',
      lastName: 'Doe',
      phone: '+20-01274318900',
      alternatePhone: '+20-01270000000',
      email: 'billing@example.com',
      fullAddress: '123 Billing St, New York, NY, 10001',
      city: 'New York',
      district: 'Manhattan',
      pincode: '10001',
      paymentMethod: 'cash',
    },
  });

  // Handle input changes for editable fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile({
      ...profile,
      [name]: value,
    });
  };

  // Handle input changes for billing fields
  const handleBillingChange = (e) => {
    const { name, value } = e.target;
    setProfile({
      ...profile,
      billingAddress: {
        ...profile.billingAddress,
        [name]: value,
      },
    });
  };

  // Toggle between edit and view mode for profile
  const toggleEditProfileMode = () => {
    setIsEditingProfile(!isEditingProfile);
  };

  // Toggle between edit and view mode for billing details
  const toggleEditBillingMode = () => {
    setIsEditingBilling(!isEditingBilling);
  };

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <ul>
          <li>
            <Link to="/Home">
              <img className={styles.img} src="/home-icon.png" alt="Home" /> 
            </Link>
          </li>
          <li>
            <Link to="/ProfilePage">
              <img className={styles.img} src="/profile-icon.png" alt="Profile" /> 
            </Link>
          </li>
          <li>
            <Link to="/dashboard">
              <img className={styles.img} src="/dashboard-icon.png" alt="Dashboard" /> 
            </Link>
          </li>
        </ul>
      </aside>

      {/* Main Profile Section */}
      <div className={styles.profiledetails}>
      
        <main className={styles.profileSection}>
          <h1>Profile</h1>
          <div className={styles.profileCard}>
            <div className={styles.profileDetails}>
              {isEditingProfile ? (
                <>
                <div className={styles.input}>
                  <label>Name:</label>
                  <input
                    type="text"
                    name="name"
                    value={profile.name}
                    onChange={handleInputChange}
                  />
                  </div>
                  <div className={styles.input}>
                  <label>Email:</label>
                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleInputChange}
                  /></div>
                  <div className={styles.input}>
                  <label>Phone Number:</label>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={profile.phoneNumber}
                    onChange={handleInputChange}
                  /></div>
                  <div className={styles.input}>
                  <label>Address:</label>
                  <input
                    type="text"
                    name="address"
                    value={profile.address}
                    onChange={handleInputChange}
                  />
                  </div>
                </>
              ) : (
                <>
                  <p><strong>Name:</strong> {profile.name}</p>
                  <p><strong>Email:</strong> {profile.email}</p>
                  <p><strong>Phone Number:</strong> {profile.phoneNumber}</p>
                  <p><strong>Address:</strong> {profile.address}</p>
                </>
              )}
            </div>
            {/* Edit/Save Button for Profile */}
            <button className={styles.editProfileButton} onClick={toggleEditProfileMode}>
              {isEditingProfile ? 'Save Profile' : 'Edit Profile'}
            </button>
          </div>
        </main>

        {/* Billing Section */}
        <main className={styles.profileSection}>
          <h1>Billing Details</h1>
          <div className={styles.profileCard}>
            <div className={styles.profileDetails}>
              {isEditingBilling ? (
                <>
                <div className={styles.input}>
                  <label>First Name:</label>
                  <input
                    type="text"
                    name="firstName"
                    value={profile.billingAddress.firstName}
                    onChange={handleBillingChange}
                  /></div><div className={styles.input}>
                  <label>Last Name:</label>
                  <input
                    type="text"
                    name="lastName"
                    value={profile.billingAddress.lastName}
                    onChange={handleBillingChange}
                  /></div>
                  <div className={styles.input}>
                  <label>Phone:</label>
                  <input
                    type="text"
                    name="phone"
                    value={profile.billingAddress.phone}
                    onChange={handleBillingChange}
                  /></div>
                  <div className={styles.input}>
                  <label>Alternate Phone:</label>
                  <input
                    type="text"
                    name="alternatePhone"
                    value={profile.billingAddress.alternatePhone}
                    onChange={handleBillingChange}
                  /></div>
                  <div className={styles.input}>
                  <label>Email:</label>
                  <input
                    type="email"
                    name="email"
                    value={profile.billingAddress.email}
                    onChange={handleBillingChange}
                  /></div><div className={styles.input}>
                  <label>Full Address:</label>
                  <input
                    type="text"
                    name="fullAddress"
                    value={profile.billingAddress.fullAddress}
                    onChange={handleBillingChange}
                  /></div> 
                  <div className={styles.input}>
                  <label>City:</label>
                  <input
                    type="text"
                    name="city"
                    value={profile.billingAddress.city}
                    onChange={handleBillingChange}
                  /></div> 
                  <div className={styles.input}>
                  <label>District:</label>
                  <input
                    type="text"
                    name="district"
                    value={profile.billingAddress.district}
                    onChange={handleBillingChange}
                  /></div> 
                  <div className={styles.input}>
                  <label>Pincode:</label>
                  <input
                    type="text"
                    name="pincode"
                    value={profile.billingAddress.pincode}
                    onChange={handleBillingChange}
                  /></div> 

                  <h3>Select Payment Method</h3>
                  <label>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash"
                      checked={profile.billingAddress.paymentMethod === 'cash'}
                      onChange={handleBillingChange}
                    />
                    Cash
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="online"
                      checked={profile.billingAddress.paymentMethod === 'online'}
                      onChange={handleBillingChange}
                    />
                    Online
                  </label>
                </>
              ) : (
                <>
                  <p><strong>First Name:</strong> {profile.billingAddress.firstName}</p>
                  <p><strong>Last Name:</strong> {profile.billingAddress.lastName}</p>
                  <p><strong>Phone:</strong> {profile.billingAddress.phone}</p>
                  <p><strong>Alternate Phone:</strong> {profile.billingAddress.alternatePhone}</p>
                  <p><strong>Email:</strong> {profile.billingAddress.email}</p>
                  <p><strong>Full Address:</strong> {profile.billingAddress.fullAddress}</p>
                  <p><strong>City:</strong> {profile.billingAddress.city}</p>
                  <p><strong>District:</strong> {profile.billingAddress.district}</p>
                  <p><strong>Pincode:</strong> {profile.billingAddress.pincode}</p>
                  <p><strong>Payment Method:</strong> {profile.billingAddress.paymentMethod}</p>
                </>
              )}
            </div>
            {/* Edit/Save Button for Billing */}
            <button className={styles.editProfileButton} onClick={toggleEditBillingMode}>
              {isEditingBilling ? 'Save Billing Info' : 'Edit Billing Info'}
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
