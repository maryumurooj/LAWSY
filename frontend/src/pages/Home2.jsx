import React, { useEffect, useState, useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from "./Home2.module.css";
import SupremeCourt from "../assets/Supremecourt.png";
import HighCourtPhoto from "../assets/Highcourt.png";
import image8 from "../assets/image8.png";
import image10 from "../assets/image10.png";
import image11 from "../assets/image11.png";
import { Button, Container, Row, Col } from "react-bootstrap";
import { useAuth } from "./../services/AuthContext";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loaders/Loader";
import { Spinner } from "react-bootstrap";

const books = [
  {
    src: image8,
    alt: "Book 1",
    title: "First Edition",
    author: "Author Name",
    edition: "Edition 1",
    price: "",
  },
  {
    src: image10,
    alt: "Book 2",
    title: "second Edition",
    author: "Author Name",
    edition: "Edition 2",
    price: "",
  },
  {
    src: image11,
    alt: "Book 3",
    title: "Third Edition",
    author: "Author Name",
    edition: "Edition 3",
    price: "",
  },
  {
    src: image8,
    alt: "Book 4",
    title: "Forth Edition",
    author: "Author Name",
    edition: "Edition 4",
    price: "",
  },
];

function Home() {
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
          "http://localhost:3000/api/latest-judgments"
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

  return (
    <div className={styles.home}>
      <div class={styles.marqueecontainer}>
  <div class={styles.marquee}>
    <span>🔥 Flash Sale: 50% off on selected items! | 🎉 New Year Offers: Don't miss out! | 📢 Latest Updates: Check out our blog for more info!</span>
  </div>
</div>

      <div className={styles.layer1}></div>
      
      <section
        ref={section2Ref}
        className={`${styles.section2} ${styles.sectionscroll}`}
      >
        <div className={styles.WelcomeContainer}>
          {" "}
          {/* New container for Welcome phrase */}
          <h1 className={styles.Welcome}>
            Welcome{user ? `, ${user.displayName || "User"}` : " to ALD ONLINE✌️"}
          </h1>
        </div>
        {/* Rest of Section 2 content */}
        <div className={styles.content}>
        <div className={styles.LeftCol}>
          <div
            ref={(el) => (boxesRef.current[1] = el)}
            className={`${styles.box3} ${boxVisible ? styles.boxVisible : ""}`}
          >
            <h2>Latest Judgments</h2>
            <div className={styles.judgmentsList}>
              {judgments.map((judgment) => (
                <div key={judgment.judgmentId} className={styles.judgment}>
                  <p className={styles.topline}>
                    <span className={styles.citation}>
                      {judgment.newCitation || judgment.judgmentCitation}
                    </span>
                    <p className={styles.judges}>{judgment.judgmentJudges}</p>
                  </p>
                  <p className={styles.bottomline}>
                    <span className={styles.parties}>
                      {" "}
                      {judgment.judgmentParties}
                    </span>
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
            className={`${styles.box2} ${boxVisible ? styles.boxVisible : ""}`}
          >
            <div className={styles.homeSlider}>
              <Slider {...settings}>
                <div>
                  <img
                    className={styles.image}
                    src={SupremeCourt}
                    alt="Supreme Court"
                  />
                </div>
                <div>
                  <img
                    className={styles.image}
                    src={HighCourtPhoto}
                    alt="High Court of Andhra Pradesh"
                  />
                </div>
              </Slider>
            </div>
          </div>
          <div
            ref={(el) => (boxesRef.current[3] = el)}
            className={`${styles.box4} ${boxVisible ? styles.boxVisible : ""}`}
          >
            <iframe
              width="100%"
              height="100%"
              src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=en&amp;q=No.%2021,%20Ald%20Publications,%201-990,%20Ghansi%20Bazaar,%20Hyderabad,%20Telangana%20500066+(ALD%20Publications)&amp;t=&amp;z=17&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
              title="ALD Publications Location"
            ></iframe>
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
        <div className={styles.box5}>
          <h2 className="mb-3">Discover Our Subscription Plans</h2>
          <p className={styles.pricepara}>
            Since 1995, <strong>Andhra Legal Decisions</strong> has been a
            trusted companion for the legal community, providing precise,
            well-indexed, and reader-friendly legal reporting. From print to
            digital, we’ve grown alongside your needs—offering comprehensive
            coverage of Civil, Criminal, and Statutory law.
          </p>
          <ul className={styles.pricepara}>
            <li>
              Access <strong>thousands of judgments</strong> from 1995 onward,
              complete with headnotes and indexing.
            </li>
            <li>
              Enjoy <strong>advanced search features</strong> tailored for busy
              legal professionals: search by topic, statute, case name, judge,
              and more.
            </li>
            <li>
              <strong>Hyperlinked citations</strong>, bookmarking, and easy
              navigation make legal research seamless.
            </li>
          </ul>
          <div className="text-center mt-4">
            <button
              className="btn btn-primary"
              onClick={() => {
                const pricingSection =
                  document.getElementById("pricing-section");
                if (pricingSection) {
                  pricingSection.scrollIntoView({ behavior: "smooth" });
                }
              }}
            >
              View Pricing Plans
            </button>
          </div>
        </div>
        <div className={styles.box6}>
          <div className={styles.booksWrapper}>
            <h2>Our Editions</h2>
            <div className={styles.booksContainer}>
              {books.map((book, index) => (
                <div key={index} className={styles.bookCard}>
                  <img
                    src={book.src}
                    alt={book.alt}
                    className={styles.bookImage}
                  />
                  <div className={styles.bookDetails}>
                    <h3 className={styles.bookTitle}>{book.title}</h3>
                    <p className={styles.bookAuthor}>{book.author}</p>
                    <p className={styles.bookEdition}>{book.edition}</p>
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
