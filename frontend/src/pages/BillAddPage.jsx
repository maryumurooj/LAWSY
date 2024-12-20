import React from 'react';
import SignupForm from '../components/SignupForm/BillAddform/Form';
import styles from './BillAddPage.module.css';

const BillAdd = () => {
  return (
    <div className={styles.signupPage}>
      <div className={styles.signupLeft}>
      <h1>WELCOME BACK</h1><p>
          Lorem ipsum dolor sit amet consectetur. Nisl feugiat tempor sagittis
          neque risus. Cras aliquet dictum pharetra scelerisque risus.
        </p>
      </div>
        
      <div className={styles.signupRight}>
        <SignupForm />
      </div>
    </div>
  );
};

export default BillAdd;
