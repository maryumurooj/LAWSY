import React, { useState, useEffect } from 'react';
import { Link, Navigate } from "react-router-dom";
import * as classes from "./Header.module.css";
import Navbar from "./Navbar";
import Ham from './Ham';
import titleImage from "../../assets/aldtitle.png";
import logo from "../../assets/logo.png";
import { useAuth } from '../../services/AuthContext';
import pic from '../../assets/male.png';
import Dropdown from 'react-bootstrap/Dropdown';

const HeaderComponent = () => {

  const [isMobile, setIsMobile] = useState(false);
  const [showHamMenu, setShowHamMenu] = useState(false);

  const { user } = useAuth();
  const [profilePic, setProfilePic] = useState(pic);

  useEffect(() => {
    if (user?.photoURL) {
      setProfilePic(user.photoURL);
    }
    checkWindowSize();
    window.addEventListener('resize', checkWindowSize);
    return () => window.removeEventListener('resize', checkWindowSize);
  }, [user]);

  const checkWindowSize = () => {
    if (window.innerWidth < 768) {
      setIsMobile(true);
      setShowHamMenu(false); // Close Ham menu on smaller screens
    } else {
      setIsMobile(false);
    }
  };

  const handleHamMenuToggle = () => {
    setShowHamMenu(!showHamMenu);
  };

  const CustomToggle = React.forwardRef(({ onClick }, ref) => (
    <img
      ref={ref}
      src={profilePic}
      alt="Profile"
      className={classes.profilePicture}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
    />
  ));

  return (
    <div className={classes.headerComponent}>
      <div className={classes.titlelogo}>
        <img onClick={Navigate("/home")} className={classes.logoImage} src={logo} alt="Logo" />
        <img className={classes.titleImage} src={titleImage} alt="Title" />
      </div>

      <div className={classes.headerComponentInner}>
        {isMobile ? (
          <>
            <Ham 
              showMenu={showHamMenu} 
              onToggleMenu={handleHamMenuToggle} 
              className={classes.Ham}
            />
            
          </>
        ) : (
          <Navbar className={classes.navBarDefault} />
        )}
      </div>

      <div className={classes.profilebutton}>
      {user ? (
          <Dropdown>
            <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components" />
            <Dropdown.Menu>
              <Dropdown.Item eventKey="1">Profile</Dropdown.Item>
              <Dropdown.Item eventKey="2">Admin</Dropdown.Item>
              <Dropdown.Item eventKey="3">Logout</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        ) : (
          <Link to="/auth">
            <button className={classes.loginButton}>LOGIN</button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default HeaderComponent;
