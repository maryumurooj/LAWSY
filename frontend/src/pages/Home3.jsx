import React from "react";
import Navbar from "../components/HomePage/Navbar.jsx";
import HeroBanner from "../components/HomePage/HeroBanner.jsx";
import AboutUs from "../components/HomePage/AboutUs.jsx";
import PracticeAreas from "../components/HomePage/PracticeAreas.jsx";

const HomePage = () => {
  return (
    <div>      
        <HeroBanner />
       <AboutUs />
      <PracticeAreas />
    </div>
  );
};

export default HomePage;
