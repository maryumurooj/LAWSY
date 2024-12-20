import React from 'react';
import BillAdd from '../components/SignupForm/BillAddform/Funtionalform';
import styles from './Profile.module.css'
import Tiers from '../components/Sub'
import { useNavigate } from "react-router-dom";
import { db } from '../services/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import { useAuth } from '../services/AuthContext';

const Profile = () => {
    return (
      <>
     
     <div className={styles.Page}>
      
        
      <div className={styles.Right}>
        <BillAdd />
        <Tiers/>
      </div>
    </div>

      </>
     );
    };
    
    export default Profile;