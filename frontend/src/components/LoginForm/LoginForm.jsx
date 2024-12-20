import React from 'react';
import styles from './LoginForm.module.css';

const LoginForm = () => {
  return (
    <div className={styles.loginForm}>
      <h2>Log In</h2>
      <form>
        <div className={styles.inputContainer}>
          <label>Email</label>
          <input type="email" placeholder="Enter your email" />
        </div>
        <div className={styles.inputContainer}>
          <label>Password</label>
          <input type="password" placeholder="Enter your password" />
        </div>
        <button type="submit" className={styles.loginBtn}>Log In</button>
        <div className={styles.or}>or</div>
        <button type="button" className={styles.googleBtn}>
          <img className={styles.icon} src="/google.png" alt="Google Icon" /> Continue with Google
        </button>
        <div className={styles.signup}>
          Don't have an account? <a href="/signup">SignUp</a>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
