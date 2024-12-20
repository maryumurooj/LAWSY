import React from "react";
import styles from "./Form.module.css";
import { useNavigate } from "react-router-dom";

function SignupForm() {
  const navigate = useNavigate();

  const handleNavigation = (path) => () => {
    navigate(path);
  };

  return (
    <div className={styles.signupForm}>
      <h2 className={styles.signupTitle}>Billing Address</h2>
      <form>
  <div className={styles.inputContainer}>
    <input
      type="text"
      className={styles.inputField}
      placeholder="First Name"
    />  
    <input
      type="text"
      className={styles.inputField}
      placeholder="Last Name"
    />
  </div>
  <div className={styles.inputContainer}>
    <input
      type="text"
      className={styles.inputField}
      placeholder="Phone"
    />
    <input
      type="text"
      className={styles.inputField}
      placeholder="Alternate Phone"
    />
  </div>
  <div className={styles.inputContainer}>
    <input
      type="email"
      className={styles.inputField}
      placeholder="Email"
    />
  </div>
  <div className={styles.inputContainer}>
    <input
      type="text"
      className={styles.inputField}
      placeholder="Full Address"
    />
  </div>
  <div className={styles.inputContainer}>
    <input
      type="text"
      className={styles.inputField}
      placeholder="City"
    />
    <input
      type="text"
      className={styles.inputField}
      placeholder="District"
    />
    <input
      type="text"
      className={styles.inputField}
      placeholder="Pincode"
    />
  </div>
  <h3>Select Payment Method</h3>
  <div className={styles.inputContainer}>
    <label>
      <input  type="radio" name="paymentMethod" value="cash" />
      Cash
    </label>
    <label>
      <input  type="radio" name="paymentMethod" value="online" />
      Online
    </label>
  </div>
  <button className={styles.submitButton} onClick={handleNavigation("/ProfilePage")}>
    Submit Billing Info
  </button>
</form>
    </div>
  );
}

export default SignupForm;
