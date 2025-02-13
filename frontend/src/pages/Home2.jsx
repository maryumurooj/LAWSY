import React, { useEffect, useState, useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from "./Home.module.css";
import SupremeCourt from "../assets/Supremecourt.png";
import HighCourtPhoto from "../assets/Highcourt.png";
import image8 from "../assets/image8.png";
import image10 from "../assets/image10.png";
import image11 from "../assets/image11.png";
import { Button, Container, Row, Col } from "react-bootstrap";
import { useAuth } from "./../services/AuthContext";
import { useNavigate } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import axios from "axios"; // Install axios if not already done (npm install axios)
import book13 from "../assets/Books/book1.jpg";
import book14 from "../assets/Books/book2.jpg";
import book15 from "../assets/Books/book3.jpg";
import book16 from "../assets/Books/book4.jpg";
import book11 from "../assets/Books/book11.jpg";



const books = [
  


{
  src: book13,
  alt: "ALD Volume 3",
  title: "Major Criminal Acts",
  author: "Andhra Legal Decisions",
  edition: "2025 Edition",
  price: "₹2595",
},
{
  src: book14,
  alt: "ALD Volume 4",
  title: "Yearly Digest 2024",
  author: "Andhra Legal Decisions",
  edition: "2025 Edition",
  price: "₹3995",
},
{
  src: book15,
  alt: "ALD Volume 5",
  title: "Bare Act",
  author: "Andhra Legal Decisions",
  edition: "2025 Edition",
  price: "₹100",
},
{
  src: book16,
  alt: "ALD Volume 6",
  title: "Premium Binding Court Pocket",
  author: "Andhra Legal Decisions",
  edition: "2025 Edition",
  price: "₹720",
},
{
  src: book11,
  alt: "ALD Volume 11",
  title: "Domestic Artibution",
  author: "Andhra Legal Decisions",
  edition: "2025",
  price: "₹3995",
},

];

function Home() {
  
  const textRef = useRef(null); // Ref for the text element
  const box4Ref = useRef(null); // Ref for box4

  // Function to truncate text
  const truncateText = (element, maxHeight) => {
    const originalText = element.innerText;
    let truncatedText = originalText;

    // Temporarily remove ellipsis to measure the actual text height
    element.innerText = truncatedText;

    // Check if the text overflows the container
    while (element.scrollHeight > maxHeight && truncatedText.length > 0) {
      // Remove the last word
      truncatedText = truncatedText.replace(/\s+\S*$/, "");
      element.innerText = truncatedText + "...";
    }
  };

  // Run the truncation function on mount and window resize
  useEffect(() => {
    const handleResize = () => {
      if (box4Ref.current && textRef.current) {
        // Calculate available space for the text
        const box4Height = box4Ref.current.clientHeight;
        const otherContentHeight = Array.from(box4Ref.current.children)
          .filter((child) => child !== textRef.current)
          .reduce((sum, child) => sum + child.clientHeight, 0);

        const availableHeight = box4Height - otherContentHeight;

        // Truncate the text if it exceeds the available height
        truncateText(textRef.current, availableHeight);
      }
    };

    // Initial truncation
    handleResize();

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const { user, subscriptionStatus } = useAuth();
  const navigate = useNavigate();

  const handleNavigation = (path) => () => {
    navigate(path);
  };

  const boxesRef = useRef([]); // References for box1, box2, box3, box4

  const [boxVisible, setBoxVisible] = useState(false);

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
  };

  const [judgments, setJudgments] = useState([]);
  useEffect(() => {
    const fetchJudgments = async () => {
      try {
        const response = await fetch(
          "http://61.246.67.74:4000/api/latest-judgments"
        );
        const data = await response.json();
        setJudgments(data);
      } catch (error) {
        console.error("Error fetching judgments:", error);
      }
    };

    fetchJudgments();
  }, []);

  const [currentbook, setCurrentbook] = useState(0);

  const handleNext = () => {
    setCurrentbook((prevIndex) =>
      prevIndex === books.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrev = () => {
    setCurrentbook((prevIndex) =>
      prevIndex === 0 ? books.length - 1 : prevIndex - 1
    );
  };

  const section2Ref = useRef(null); // Reference for Section 2

  useEffect(() => {
    const observerOptions = {
      threshold: 0.2, // Trigger when 20% of the target is visible
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setBoxVisible(true); // Trigger animation on entry
        } else {
          setBoxVisible(false); // Reset animation on exit
        }
      });
    }, observerOptions);

    if (section2Ref.current) {
      observer.observe(section2Ref.current);
    }

    return () => observer.disconnect();
  }, []);

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    // Simulate a data fetch
    const fetchData = async () => {
      setLoading(true);
      setTimeout(() => {
        setData("Here is your loaded content!");
        setLoading(false);
      }, 3000); // Simulates 3 seconds of loading
    };

    fetchData();
  }, []);

  //Marquee
  const [currentContent, setCurrentContent] = useState("");
  const [newContent, setNewContent] = useState("");
  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => {
    fetchCurrentContent();
  }, []);

  const fetchCurrentContent = async () => {
    try {
      const response = await axios.get("http://61.246.67.74:4000/api/marquee");
      if (response.data.success) {
        setCurrentContent(response.data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCitationClick = (citation) => {
   if (citation){
    localStorage.setItem("referredCitation", citation);
   }
   navigate("/index");
  };


 
  const booksWrapperRef = useRef(null);
  let scrollInterval = useRef(null);

  useEffect(() => {
    const booksWrapper = booksWrapperRef.current;
    if (!booksWrapper) return;

    let scrollSpeed = 1; // Adjust scroll speed
    let scrollDirection = 1; // 1 for right, -1 for left

    const startScrolling = () => {
      scrollInterval.current = setInterval(() => {
        booksWrapper.scrollLeft += scrollSpeed * scrollDirection;

        // Loop effect when reaching end
        if (booksWrapper.scrollLeft >= booksWrapper.scrollWidth / 2) {
          booksWrapper.scrollLeft = 0;
        }
      }, 30);
    };

    const stopScrolling = () => {
      clearInterval(scrollInterval.current);
    };

    // Start scrolling on mount
    startScrolling();

    // Pause on hover, resume on leave
    booksWrapper.addEventListener("mouseenter", stopScrolling);
    booksWrapper.addEventListener("mouseleave", startScrolling);

    return () => {
      clearInterval(scrollInterval.current); // Cleanup on unmount
      booksWrapper.removeEventListener("mouseenter", stopScrolling);
      booksWrapper.removeEventListener("mouseleave", startScrolling);
    };
  }, []);

  return (
    <div className={styles.home}>
      <div class={styles.marqueecontainer}>
        <div class={styles.marquee}>
          <span>
            {" "}
            {currentContent}
            {" "}
          </span>
        </div>
      </div>

      <div className={styles.layer1}></div>

      <section
        ref={section2Ref}
        className={`${styles.section2} ${styles.sectionscroll}`}
      >
        
        {/* Rest of Section 2 content */}
        <div className={styles.content}>
          <div className={styles.LeftCol}>
            <div
              ref={(el) => (boxesRef.current[1] = el)}
              className={`${styles.box3} ${
                boxVisible ? styles.boxVisible : ""
              }`}
            >
                          <h2>Latest Judgments</h2>
              <div className={styles.judgmentsList}>
                {judgments.map((judgment) => (
                  <div
                    key={judgment.judgmentId}
                    className={styles.judgment}
                    onClick={() => handleCitationClick(judgment.newCitation || judgment.judgmentCitation)} // Box-wide click handler
                    style={{ cursor: "pointer" }} // Ensure the whole box is clickable
                  >
                    <p className={styles.topline}>
                      <span className={styles.citation}>
                        {judgment.newCitation || judgment.judgmentCitation}
                      </span>
                      <p className={styles.judges}>{judgment.judgmentJudges}</p>
                    </p>
                    <p className={styles.bottomline}>
                      <span className={styles.parties}>{judgment.judgmentParties}</span>
                      <span className={styles.doj}>{judgment.formattedDOJ}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className={styles.RightCol}>
            <div
              ref={(el) => (boxesRef.current[2] = el)}
              className={`${styles.box2} ${
                boxVisible ? styles.boxVisible : ""
              }`}
            >
              
                <Slider {...settings}>
                  <div className={styles.imgbox}>
                    <img
                      className={styles.image}
                      src={SupremeCourt}
                      alt="Supreme Court"
                    />
                  </div>
                  <div className={styles.imgbox}>
                    <img
                      className={styles.image}
                      src={HighCourtPhoto}
                      alt="High Court of Andhra Pradesh"
                    />
                  </div>
                </Slider>
              
            </div>
            <div
             ref={box4Ref}
              className={`${styles.box4} ${
                boxVisible ? styles.boxVisible : ""
              }`}
            >
              <h2 className="mb-0">Discover Our Resources</h2>
              <p ref={(el) => (textRef.current = el)}>
              ALD Online is a user-friendly and efficient legal research platform designed for busy lawyers, the Bench, and the Bar. It provides fast and accurate results, 
              helps track binding authorities, assists in case law research, and verifies the current status of judgments. Start your free trial today!{" "}<br/>
              </p>
              <Button variant="light">Start Now</Button>
            </div>
          </div>
        </div>
      </section>

      <section className={`${styles.section3} ${styles.sectionscroll}`}>
        <div className={styles.layer2}>
          <svg preserveAspectRatio="xMidYMid slice" viewBox="-30 -30 80 80">
            <path
              fill="black"
              class={styles.outtop}
              d="M37-5C25.1-14.7,5.7-19.1-9.2-10-28.5,1.8-32.7,31.1-19.8,49c15.5,21.5,52.6,22,67.2,2.3C59.4,35,53.7,8.5,37-5Z"
            />
          </svg>
        </div>

        
        <div className={styles.box6}>
          <h2>Latest Publication</h2>
          <div ref={booksWrapperRef} className={styles.booksWrapper}>
          <div className={styles.booksContainer}>
              {/* First set of books */}
              {books.map((book, index) => (
                <div key={`first-${index}`} className={styles.bookCard}>
                  <img
                    src={book.src}
                    alt={book.alt}
                    className={styles.bookImage}
                  />
                  <div className={styles.bookDetails}>
                  <h3 className={styles.bookAuthor}>{book.title}</h3>
                    <h3 className={styles.bookAuthor}>{book.edition}</h3>
                    <h3 className={styles.bookAuthor}>{book.price}</h3>
                  </div>
                </div>
              ))}
              {/* Duplicate set for seamless loop */}
              {books.map((book, index) => (
                <div key={`second-${index}`} className={styles.bookCard}>
                  <img
                    src={book.src}
                    alt={book.alt}
                    className={styles.bookImage}
                  />
                  <div className={styles.bookDetails}>
                   
                    <h3 className={styles.bookAuthor}>{book.title}</h3>
                    <h3 className={styles.bookAuthor}>{book.edition}</h3>
                    <h3 className={styles.bookAuthor}>{book.price}</h3>
                    
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
