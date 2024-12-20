import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import styles from "./Popup.module.css";
import Modal from 'react-bootstrap/Modal';
import icon from '/logo.svg';
import { useNavigate } from "react-router-dom";

export default function SigninPopup({ setPopupVisible }) {
  const [show, setShow] = useState(true);
  const navigate = useNavigate();
 

  document.body.classList.add('active-Popup'); // Add the active class when Popup is open

  // Close popup when the button is clicked
  const closePopup = () => {
    setShow(false);
    setPopupVisible(false); // This keeps the visibility control intact
    document.body.classList.remove('active-Popup');
  };

  // Add class to the body when the popup is visible
  useEffect(() => {
    document.body.classList.add('active-Popup');
    return () => {
      document.body.classList.remove('active-Popup');
    };
  }, []);

  const handleNavigation = (path) => () => {
    navigate(path);
  };

  return (
    <div className={styles.Popup}>
      <div className={styles.overlay}></div>
      <Modal show={show}
        onHide={closePopup}
        backdrop="static" // This prevents closing the modal by clicking outside
        keyboard={false}  // This prevents closing with the escape key
        className={styles.Popupcontent} > <Modal.Header>
      <Modal.Title><img src={icon}></img><h1>Sign Up to Continue</h1></Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <p>You've reached the preview limit. Please sign in to read the full article and enjoy unlimited access to our content.</p>
    </Modal.Body>
    <Modal.Footer className={styles.footer}>
      <Button className={styles.button} variant="primary" onClick={handleNavigation("/signup")}>
        Sign Up
      </Button>
      <Button className={styles.sbutton} variant="secondary" onClick={handleNavigation("/Price")}>
        Already a Member? Subcribe.
      </Button>
    </Modal.Footer>

      </Modal>
      
           
    </div>
  );
}
