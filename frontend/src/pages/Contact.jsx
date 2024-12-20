import React from "react";
import ContactForm from "../components/Contact/ContactForm";
import MainFooter from "../components/MainFooter/MainFooter";
import LoginPageImage from "../assets/LoginPage.png"; // Import the image file

const Contact = () => {
  return (
      <div
        style={{
          backgroundImage: `url(${LoginPageImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center 80%",
            minHeight: "20vh",
        }}
      >
    
        <ContactForm/>
      <MainFooter/>
    </div>
  );
};

export default Contact;