import React, { useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth, db } from '../../services/firebaseConfig.js';
import { doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore'; // Include onSnapshot
import { v4 as uuidv4 } from 'uuid';
import styles from './Auth.module.css';
import LoginPageImage from '../../assets/bookcase.jpg';
import { FaUser } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [user, setUser] = useState(null);
  const provider = new GoogleAuthProvider();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    // Firestore listener for user data
    const unsubscribeUserData = () => {
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        return onSnapshot(userDocRef, (doc) => {
          if (doc.exists()) {
            setUsername(doc.data().username || ''); // Update username from Firestore
          }
        });
      }
    };

    // Clean up listeners on unmount
    return () => {
      unsubscribeAuth();
      unsubscribeUserData && unsubscribeUserData();
    };
  }, [user]); // Add user as a dependency

  const saveUserInfo = async (user) => {
    const deviceId = uuidv4();

    try {
      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnapshot = await getDoc(userDocRef);

      // Check if the user already exists
      if (userDocSnapshot.exists()) {
        console.log('User already exists, not overwriting data.');
        return;
      } else {
        // User does not exist, create new user info
        await setDoc(userDocRef, {
          username: username || user.displayName,
          email: user.email,
          role: 'user',
          deviceId: deviceId,
          creationDate: new Date().toISOString(),
          subscriptionStatus: 'inactive',
        });
      }

      // Sync with MySQL via backend API
      const response = await fetch('http://localhost:3000/sync-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            uid: user.uid,
            username: username || user.displayName || 'Anonymous',
            email: user.email,
        }),
    });

    if (!response.ok) {
        throw new Error('Failed to sync with MySQL');
    }

    console.log('User data synced with MySQL');


    } catch (error) {
      console.error('Error saving user info:', error.message);
    }
  };

  const handleEmailAuth = async () => {
    if (isSignUp && password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    try {
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await saveUserInfo(userCredential.user);
        alert('User signed up successfully');
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        alert('User signed in successfully');
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      const result = await signInWithPopup(auth, provider);

      // Check if the user already exists in Firestore
      const userDocRef = doc(db, 'users', result.user.uid);
      const userDocSnapshot = await getDoc(userDocRef);

      // If the user document does not exist, prompt for username and save
      if (!userDocSnapshot.exists()) {
        const enteredUsername = prompt('Enter your username:');
        setUsername(enteredUsername);
        await saveUserInfo(result.user);
      } else {
        console.log('User already exists, role will not be overwritten.');
      }

      alert('User signed in with Google');
    } catch (error) {
      alert(error.message);
    }
  };

  const handleLogOut = async () => {
    try {
      await signOut(auth);
      alert('User logged out successfully');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div
      className={styles.authContainer}
      style={{
        backgroundImage: `url(${LoginPageImage})`,
        backgroundSize: 'cover',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {user ? (
        <div className={styles.authContent}>
          <h1>Welcome, {username || 'User'}!</h1> {/* Use username from Firestore */}
          <button className={styles.button} onClick={handleLogOut}>
            Log Out
          </button>
        </div>
      ) : (
        <div className={styles.authContent}>
          <h1>{isSignUp ? 'Sign Up' : 'Log In'}</h1>

          {isSignUp && (
            <div className={styles.inputContainer}>
              <FaUser className={styles.LOGicon} />
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={styles.inputField}
              />
            </div>
          )}

          <div className={styles.inputContainer}>
            <FaUser className={styles.LOGicon} />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.inputField}
            />
          </div>
          <div className={styles.inputContainer}>
            <RiLockPasswordFill className={styles.LOGicon} />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.inputField}
            />
          </div>
          {isSignUp && (
            <div className={styles.inputContainer}>
              <RiLockPasswordFill className={styles.LOGicon} />
              <input
                type="password"
                placeholder="Re-type Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={styles.inputField}
              />
            </div>
          )}

          <button className={styles.button} onClick={handleEmailAuth}>
            {isSignUp ? 'Sign Up' : 'Log In'}
          </button>

          <button className={styles.googleBtn} onClick={handleGoogleAuth}>
            <img className={styles.icon}  alt="Google Icon" />
            Sign In with Google
          </button>

          <p className={styles.switchAuth} onClick={() => setIsSignUp(!isSignUp)}>
            {isSignUp ? 'Already have an account? Log In' : "Don't have an account? Sign Up"}
          </p>
        </div>
      )}
    </div>
  );
};

export default Auth;