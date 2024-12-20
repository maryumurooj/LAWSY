import React from 'react';
import SignupForm from '../components/SignupForm/SignupForm';
import styles from './SignupPage.module.css';

const SignupPage = () => {
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

export default SignupPage;
