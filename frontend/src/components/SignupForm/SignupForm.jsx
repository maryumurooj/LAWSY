import React from "react";
import styles from "./SignupForm.module.css";
import { useNavigate } from "react-router-dom";

function SignupForm() {
  const navigate = useNavigate();

  const handleNavigation = (path) => () => {
    navigate(path);
  };

  return (
    <div className={styles.signupForm}>
      <h2 className={styles.signupTitle}>Sign Up</h2>
      <form>
        <div className={styles.inputContainer}>
          <input
            type="text"
            className={styles.inputField}
            placeholder="Enter Username"
          />
        </div>
        <div className={styles.inputContainer}>
          <input
            type="email"
            className={styles.inputField}
            placeholder="Enter E-Mail"
          />
        </div>
        <div className={styles.inputContainer}>
          <input
            type="password"
            className={styles.inputField}
            placeholder="Enter Password"
          />
          <input
            type="password"
            className={styles.inputField}
            placeholder="Re-Enter Password"
          />
        </div>
        
        
        <button
          className={styles.submitButton}
          onClick={handleNavigation("/Price")}
        >
          Submit
        </button>

        <button type="button" className={styles.googleBtn}>
          <img className={styles.icon} src="/google.png" alt="Google Icon" /> Continue with Google
        </button>
        
        <div className={styles.login}>
          Already have an account? <a href="/login">SignIn</a>
        </div>
      </form>
    </div>
  );
}

export default SignupForm;
