import React from 'react';
import styles from './Pricing.module.css';
import { useNavigate } from "react-router-dom";

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
          Billed Annually or ₹ {recurrency}/monthly
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

// CardAction Component with navigation
function CardAction() {
  const navigate = useNavigate(); // Use hook to navigate

  const handleNavigation = (path) => {
    navigate(path); // Navigate to the billing form or another route
  };

  return (
    <div className={styles.cardAction}>
      <button onClick={() => handleNavigation("/BillAdd")}>
        Start 14 Day Trial
      </button>
    </div>
  );
}

// PricingCard Component
function PricingCard({
  type,
  title,
  description,
  price,
  recurrency,
  mostPopular,
  data
}) {
  return (
    <div className={`${styles.card} ${styles[type]}`}>
      {mostPopular && <span className={styles.mostPopular}>Most Popular</span>}
      <CardDescription title={title} description={description} />
      <CardBilling price={price} recurrency={recurrency} />
      <CardFeatures data={data} />
      <CardAction />
    </div>
  );
}

// Main Pricing Page
function Price() {
  const cardsData = [
    {
      id: 1,
      type: 'Bronze',
      title: 'Bronze Plan',
      description: '60 Days',
      price: 9.99,
      recurrency: 0,
      mostPopular: false,
      data: ['Headnotes', 'Notes'],
    },
    {
      id: 2,
      type: 'Silver',
      title: 'Silver Plan',
      description: '130 Days',
      price: 29.99,
      recurrency: 24.99,
      mostPopular: false,
      data: [ '100 Searches monthly', '10 Accounts'],
    },
    {
      id: 3,
      type: 'Gold',
      title: 'Gold Plan',
      description: '360 Days',
      price: 69.99,
      recurrency: 59.99,
      mostPopular: true,
      data: [ '500 Searches monthly', '20 Accounts', '24/7 Support'],
    },
  ];

  return (
    <div className={styles.appWrapper}>
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
        />
      ))}
    </div>
  );
}

export default Price;
