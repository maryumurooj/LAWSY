// src/components/Price.jsx
import React, { useState } from 'react';
import { db } from '../services/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import { useAuth } from '../services/AuthContext';
import BillingAddress from './SignupForm/BillAddform/Form'; // Import the BillingForm component

const SubscriptionTier = () => {
  const { user } = useAuth();
  const [selectedTier, setSelectedTier] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subscriptionId, setSubscriptionId] = useState(null); // Store the subscriptionId

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedTier) {
      alert('Please select a subscription tier.');
      return;
    }

    if (!user) {
      alert('You must be logged in to subscribe. Please log in or sign up first.');
      return;
    }

    setIsSubmitting(true);

    const creationDate = new Date();
    const deadline = new Date();
    let durationDays;
    let price;
    let planName;

    switch (selectedTier) {
      case 'bronze':
        durationDays = 60;
        price = 99;
        planName = 'Bronze Plan';
        break;
      case 'silver':
        durationDays = 130;
        price = 399;
        planName = 'Silver Plan';
        break;
      case 'gold':
        durationDays = 360;
        price = 699;
        planName = 'Gold Plan';
        break;
      default:
        return;
    }

    deadline.setDate(creationDate.getDate() + durationDays);

    const subscriptionData = {
      uid: user.uid,
      planName,
      duration: durationDays,
      price,
      subscriptionStatus: 'pending',
      creationDate: creationDate.toISOString(),
      endingDate: deadline.toISOString(),
    };

    try {
      // Add subscription data to Firestore and capture the document ID (subscriptionId)
      const docRef = await addDoc(collection(db, 'subscriptions'), subscriptionData);
      setSubscriptionId(docRef.id); // Store the subscription ID
      alert('Subscription successful! Proceed with billing information.');
    } catch (error) {
      console.error('Error saving subscription data:', error);
      alert('Failed to save subscription data. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h1>Select Subscription Tier</h1>
      <form onSubmit={handleSubmit}>
        {/* Radio buttons for subscription tiers */}
        <div>
          <label>
            <input 
              type="radio" 
              value="bronze" 
              checked={selectedTier === 'bronze'} 
              onChange={(e) => setSelectedTier(e.target.value)} 
            />
            Bronze (60 Days) - ₹99
          </label>
        </div>
        <div>
          <label>
            <input 
              type="radio" 
              value="silver" 
              checked={selectedTier === 'silver'} 
              onChange={(e) => setSelectedTier(e.target.value)} 
            />
            Silver (130 Days) - ₹399
          </label>
        </div>
        <div>
          <label>
            <input 
              type="radio" 
              value="gold" 
              checked={selectedTier === 'gold'} 
              onChange={(e) => setSelectedTier(e.target.value)} 
            />
            Gold (360 Days) - ₹699
          </label>
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit Subscription'}
        </button>
      </form>

      {/* Pass the subscriptionId to BillingForm if available */}
      {subscriptionId && <BillingAddress subscriptionId={subscriptionId} />}
    </div>
  );
};

export default SubscriptionTier;