import React from "react";
import styles from "./SubFooter.module.css"; // Ensure this import points to the correct file

function SubFooter() {
  // Define contact information and icons in an array for better structure
  const contacts = [
    {
      id: "phone",
      icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/ec91ef924739e4c75925054f1c1af4bcacf2b004dac26d3835e371caa38ccadf?apiKey=b9b3791eaabb44ab9bdada092d210e01&",
      text: "Ph: 8374289998, 8374389998",
      alt: "Phone Icon",
    },
    {
      id: "email",
      icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/519ef4ce98eb85111f3f837fecfa30b8ad00e8da91ce7f0899ef76ac2b96c7a1?apiKey=b9b3791eaabb44ab9bdada092d210e01&",
      text: "sales@aldonline.in",
      alt: "Email Icon",
    },
  ];

  return (
    <div className={styles.subFooterFrame}>
      <hr className={styles.horizontalLine} />
      <div className={styles.contentContainer}>
        <div className={styles.textContent}>
          <i className="fas fa-copyright"></i>
          <span> Copyright © Andhra Legal Decisions</span>
        </div>
        {contacts.map((contact) => (
          <div key={contact.id} className={styles.contactInfo}>
            <img className={styles.icon} src={contact.icon} alt={contact.alt} />
            <span className={styles.text}>{contact.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SubFooter;
