import React from 'react';
import LoginForm from '../components/LoginForm/LoginForm';
import styles from './LoginPage.module.css';

const LoginPage = () => {
  return (
    <div className={styles.loginPage}>
      <div className={styles.loginLeft}>
        <LoginForm />
      </div>
      <div className={styles.loginRight}>
        <h1>WELCOME BACK</h1>
        <p>
          Lorem ipsum dolor sit amet consectetur. Nisl feugiat tempor sagittis
          neque risus. Cras aliquet dictum pharetra scelerisque risus.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
