import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from "./Home2.module.css";
import SupremeCourt from "../assets/Supremecourt.png";
import HighCourtPhoto from "../assets/Highcourt.png";
import image8 from "../assets/image8.png";
import image10 from "../assets/image10.png";
import image11 from "../assets/image11.png";

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
  const settings = {
    dots: true,
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

  return (
    <div className={styles.home}>
      <div className={styles.LeftCol}>
        <div className={styles.box1}>
          <div className={styles.label}></div>
          <Slider {...settings}>
            
            <div>
              <img
                className={styles.image}
                src={HighCourtPhoto}
                alt="High Court of Andhra Pradesh"
              />
            </div>
            <div>
              <img
                className={styles.image}
                src={SupremeCourt}
                alt="Supreme Court"
              />
            </div>
          </Slider>
        </div>

        <div className={styles.box45}>
          <div className={styles.box4}>
            <div className={styles.bookContainer}>
              <button
                className={`${styles.arrowButton} ${styles.leftArrow}`}
                onClick={handlePrev}
              >
                &#129168; {/* Left Arrow */}
              </button>
              <div className={styles.book}>
                <img
                  src={books[currentbook].src}
                  alt={books[currentbook].title}
                  className={styles.bookImage}
                />
                <div className={styles.overlay}>
                  <h4 className={styles.bookTitle}>
                    {books[currentbook].title}
                  </h4>
                  <p className={styles.bookPrice}>{books[currentbook].price}</p>
                </div>
              </div>
              <button
                className={`${styles.arrowButton} ${styles.rightArrow}`}
                onClick={handleNext}
              >
                &#129170; {/* Right Arrow */}
              </button>
            </div>
          </div>
          <div className={styles.box5}>
            <p>
              Our platform provides lawyers with detailed case information,
              accessible through various user-friendly search methods. Start
              your journey with a 14-day free trial to explore all features.
              After the trial, you can continue accessing the information you
              need by selecting one of our affordable subscription plans.{" "}
            </p>
            <button className={styles.subbutton}>Choose your Plan</button>
          </div>
        </div>
      </div>
      <div className={styles.RightCol}>
        <div className={styles.box2}>
          <h2>Latest Judgments</h2>
          <div className={styles.judgmentsList}>
            {judgments.map((judgment) => (
              <div key={judgment.judgmentId} className={styles.judgment}>
                <h3>{judgment.newCitation || judgment.judgmentCitation}</h3>
                <p>{judgment.judgmentJudges}</p>
                <span>{judgment.formattedDOJ}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.box6}>
          <iframe
            className={styles.maps}
            width="100%"
            height="190"
            src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=en&amp;q=No.%2021,%20Ald%20Publications,%201-990,%20Ghansi%20Bazaar,%20Hyderabad,%20Telangana%20500066+(ALD%20Publications)&amp;t=&amp;z=17&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
            title="ALD Publications Location"
          ></iframe>
          <p className={styles.overlay}>
            Gate No. 5, 21-1-985, opp. High Court Road, Ghansi Bazaar,
            Hyderabad, Telangana 500002
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;
