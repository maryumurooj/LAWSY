import React, { useState } from 'react';
import styles from './SubscriptionTier.module.css';
import { useNavigate } from "react-router-dom";
import { db } from '../../services/firebaseConfig';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore'; // Import necessary Firestore functions
import { useAuth } from '../../services/AuthContext';

// CardDescription Component
function CardDescription({ title, description }) {	
  return (
    <div className={styles.cardDescription}>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
}

// CardBilling Component
function CardBilling({ price, recurrency }) {
  return (
    <div className={styles.cardBilling}>
      <p>
        <strong className={styles.price}>₹ {price}</strong>
        <strong> / mo.</strong>
      </p>
      <p>
        <span className={styles.recurrency}>
          {recurrency > 0 ? `Billed Annually or ₹ ${recurrency}/monthly` : 'One-time payment'}
        </span>
      </p>
    </div>
  );
}

// CardFeatures Component
function CardFeatures({ data }) {	
  return (
    <div className={styles.cardFeatures}>
      <ul>
        {data.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

// PricingCard Component with subscription handling
function PricingCard({
  type,
  title,
  description,
  price,
  recurrency,
  mostPopular,
  data
}) {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subscriptionId, setSubscriptionId] = useState(null);
  const navigate = useNavigate();

  const handleSubscription = async () => {
    if (!user) {
      alert('You must be logged in to subscribe. Please log in or sign up first.');
      navigate('/login'); // Redirect to login page
      return;
    }

    setIsSubmitting(true);

    // Check if the user already has an active subscription
    const subscriptionQuery = query(
      collection(db, 'subscriptions'),
      where('uid', '==', user.uid)
    );

    const subscriptionSnapshot = await getDocs(subscriptionQuery);
    if (!subscriptionSnapshot.empty) {
      alert('You already have an active subscription. Please manage your subscription in your account settings.');
      setIsSubmitting(false);
      return;
    }

    const creationDate = new Date();
    const deadline = new Date();
    let durationDays;
    let priceValue;
    let planName;

    switch (type.toLowerCase()) {
      case 'bronze':
        durationDays = 60;
        priceValue = 1;
        planName = 'Bronze Plan';
        break;
      case 'silver':
        durationDays = 130;
        priceValue = 1;
        planName = 'Silver Plan';
        break;
      case 'gold':
        durationDays = 360;
        priceValue = 1;
        planName = 'Gold Plan';
        break;
      default:
        alert('Invalid subscription type.');
        setIsSubmitting(false);
        return;
    }

    deadline.setDate(creationDate.getDate() + durationDays);

    const subscriptionData = {
      uid: user.uid,
      planName,
      duration: durationDays,
      price: priceValue,
      subscriptionStatus:'pending',
      creationDate: creationDate.toISOString(),
      endingDate: deadline.toISOString(),
    };

    try {
      // Add subscription data to Firestore and capture the document ID (subscriptionId)
      const docRef = await addDoc(collection(db, 'subscriptions'), subscriptionData);
      setSubscriptionId(docRef.id); // Store the subscription ID
      alert('Subscription successful! Proceeding to billing information.');
      navigate('/billingAddress', { state: { subscriptionId: docRef.id } }); // Navigate to billing form with subscriptionId
    } catch (error) {
      console.error('Error saving subscription data:', error);
      alert('Failed to save subscription data. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`${styles.card} ${styles[type]}`}>
      {mostPopular && <span className={styles.mostPopular}>Most Popular</span>}
      <CardDescription title={title} description={description} />
      <CardBilling price={price} recurrency={recurrency} />
      <CardFeatures data={data} />
      <div className={styles.cardAction}>
        <button onClick={handleSubscription} disabled={isSubmitting}>
          {isSubmitting ? 'Processing...' : 'Purchase Now'}
        </button>
      </div>
    </div>
  );
}

// FeaturesCard Component
function FeaturesCard() {
  const features = [
    'Access to advanced search functionality',
    'Multiple user accounts for team collaboration',
    'Seamless integration with external tools',
    'Real-time data updates and notifications',
  ];

  return (
    <div className={styles.featuresCard}>
      <h3>Features of the Software</h3>
      <ul>
        {features.map((feature, index) => (
          <li key={index}><div>{feature}</div></li>
        ))}
      </ul>
    </div>
  );
}

// Main Pricing Page
function Price() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const handleSubscription = (planName, price) => {
    if (!user) {
      alert('You must be logged in to subscribe. Please log in or sign up first.');
      navigate('/login');
    } else {
      navigate('/billingAddress', { state: { planName, price } });
    }
  };

  const cardsData = [
    {
      id: 1,
      type: 'Bronze',
      title: 'Bronze Plan',
      description: '60 Days',
      price: 99,
      recurrency: 0,
      mostPopular: false,
      data: [],
    },
    {
      id: 2,
      type: 'Silver',
      title: 'Silver Plan',
      description: '130 Days',
      price: 199,
      recurrency: 24.1,
      mostPopular: false,
      data: [],
    },
    {
      id: 3,
      type: 'Gold',
      title: 'Gold Plan',
      description: '360 Days',
      price: 499,
      recurrency: 59.1,
      mostPopular: true,
      data: [],
    },
  ];

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.cardsWrapper}>
        {cardsData.map((card) => (
          <PricingCard
            key={card.id}
            type={card.type}
            title={card.title}
            description={card.description}
            price={card.price}
            recurrency={card.recurrency}
            mostPopular={card.mostPopular}
            data={card.data}
            onSubscribe={() => handleSubscription(card.title, card.price)}
          />
        ))}
      </div>
      <div className={styles.featuresWrapper}>
        <FeaturesCard />
      </div>
    </div>
  );
}

export default Price;