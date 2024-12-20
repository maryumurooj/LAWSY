import React, { useEffect, useState, useRef } from "react";
import styles from "./Loader.module.css";

function Loader() {
  return (
    <div class="loader">
      <div className={styles.circle}></div>
      <div className={styles.circle}></div>
      <div className={styles.circle}></div>
      <div className={styles.circle}></div>
    </div>
  );
}

export default Loader;
