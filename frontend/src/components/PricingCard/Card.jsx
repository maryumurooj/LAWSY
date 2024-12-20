import React from 'react';
import styles from './PricingCard.module.css';
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

// CardAction Component with navigate fixed
function CardAction({ clickMe }) {
  const navigate = useNavigate(); // Correctly call the hook inside the component

  const handleNavigation = (path) => {
    navigate(path); // Use navigate correctly to go to the path
  };

  return (
    <div className={styles.cardAction}>
      <button onClick={() => handleNavigation("/BillAdd")}>Start 14 Day Trial</button>
    </div>
  );
}

// PricingCard Component
export default function PricingCard(props) {	
  const { 
    type,
    title,
    description,
    price,
    recurrency,
    mostPopular,
    data
  } = props;

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
