import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from "./Home.module.css";
import LatestBooks from "../components/HomeComponenets/LatestBooks";
import FQA from "../components/HomeComponenets/FQA";
import MainFooter from "../components/MainFooter/MainFooter";
import SearchPhoto from "../assets/Search photo.png";
import SupremeCourt from "../assets/Supremecourt.png";
import HighCourtPhoto from "../assets/Highcourt.png";


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

  return (
    <div className={styles.home}>
      {/* Slider */}
      <Slider {...settings}>
        <div>
          <img className={styles.image} src={SearchPhoto} alt="Search Photo" />
        </div>
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

      {/*Search Bar code ahead...*/}
      <div className={styles.searchBar}>
        <input
          type="text"
          placeholder="Search Judgements...."
          className={styles.searchInput}
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          className={styles.searchIcon}
        >
          <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
        </svg>
      </div>
      <div className={styles.latestJudgements}>
        <h2 className={styles.title}>Latest Judgements</h2>
        <div className={styles.judgementGrid}>
          {/* First judgment line container */}
          <div className={styles.judgementlinecontainer}>
            <div className={styles.judgement}>
              <div className={styles.judgementInfo}>
                <div className={styles.judgementTitle}>2024 ALD 106 (SC)</div>
                <div className={styles.judgementDetails}>
                  ABHAY S.OKO and SANJAY KAROL, JJ.
                </div>
                <div className={styles.judgementDate}>
                  First day of March, 2024
                </div>
                <div className={styles.judgementText}>
                  Major gen. darshan singh (D) by LRs. and another v. Brij
                  Bhushan.
                </div>
              </div>
              <div className={styles.readMore}>
                READ MORE <span className={styles.arrow}>➔</span>
              </div>
            </div>
          </div>
          {/* Second judgment line container */}
          <div className={styles.judgementlinecontainer}>
            <div className={styles.judgement}>
              <div className={styles.judgementInfo}>
                <div className={styles.judgementTitle}>2024 ALD 106 (SC)</div>
                <div className={styles.judgementDetails}>
                  ABHAY S.OKO and SANJAY KAROL, JJ.
                </div>
                <div className={styles.judgementDate}>
                  First day of March, 2024
                </div>
                <div className={styles.judgementText}>
                  Major gen. darshan singh (D) by LRs. and another v. Brij
                  Bhushan.
                </div>
              </div>
              <div className={styles.readMore}>
                READ MORE <span className={styles.arrow}>➔</span>
              </div>
            </div>
          </div>
          {/* Third judgment line container */}
          <div className={styles.judgementlinecontainer}>
            <div className={styles.judgement}>
              <div className={styles.judgementInfo}>
                <div className={styles.judgementTitle}>2024 ALD 106 (SC)</div>
                <div className={styles.judgementDetails}>
                  ABHAY S.OKO and SANJAY KAROL, JJ.
                </div>
                <div className={styles.judgementDate}>
                  First day of March, 2024
                </div>
                <div className={styles.judgementText}>
                  Major gen. darshan singh (D) by LRs. and another v. Brij
                  Bhushan.
                </div>
              </div>
              <div className={styles.readMore}>
                READ MORE <span className={styles.arrow}>➔</span>
              </div>
            </div>
          </div>
          {/* Fourth judgment line container */}
          <div className={styles.judgementlinecontainer}>
            <div className={styles.judgement}>
              <div className={styles.judgementInfo}>
                <div className={styles.judgementTitle}>2024 ALD 106 (SC)</div>
                <div className={styles.judgementDetails}>
                  ABHAY S.OKO and SANJAY KAROL, JJ.
                </div>
                <div className={styles.judgementDate}>
                  First day of March, 2024
                </div>
                <div className={styles.judgementText}>
                  Major gen. darshan singh (D) by LRs. and another v. Brij
                  Bhushan.
                </div>
              </div>
              <div className={styles.readMore}>
                READ MORE <span className={styles.arrow}>➔</span>
              </div>
            </div>
          </div>
          <div>
            <LatestBooks />
          </div>
          <div className={styles.aboutTitle}>About ALD</div>
          <div className={styles.Aboutlinecontainer}>
            <p className={styles.aboutPara}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis
              vehicula efficitur magna, quis commodo nisi consequat at. Integer
              interdum luctus sem at sagittis. Sed euismod ligula et tortor
              commodo volutpat. Nulla facilisi. Vivamus sit amet velit
              ultricies, fermentum urna non, aliquet turpis. Nulla facilisi.
              Vestibulum volutpat metus et magna bibendum vehicula. Sed eget
              ultricies diam. Cras at leo in dolor efficitur venenatis.Lorem
              ipsum dolor sit amet, consectetur adipiscing elit. Duis vehicula
              efficitur magna, quis commodo nisi consequat at. Integer interdum
              luctus sem at sagittis. Sed euismod ligula et tortor commodo
              volutpat. Nulla facilisi. Vivamus sit amet velit ultricies,
              fermentum urna non, aliquet turpis. Nulla facilisi. Vestibulum
              volutpat metus et magna bibendum vehicula. Sed eget ultricies
              diam. Cras at leo in dolor efficitur venenatis.
            </p>
            <div className={styles.readMore}>
              READ MORE <span className={styles.arrow}>➔</span>
            </div>
          </div>
          <div className={styles.fqa}>
            <FQA />
          </div>
        </div>
      </div>
      <MainFooter />
    </div>
  );
}

export default Home;
