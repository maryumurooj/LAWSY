import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from './firebaseConfig'; // Adjusted path
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore'; // Firestore for user document access
import { db } from './firebaseConfig'; // Firestore database config

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        // Fetch subscription status from 'users' table
        const userDoc = doc(db, 'users', currentUser.uid); // Assuming collection 'users'
        const userSnap = await getDoc(userDoc);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          setSubscriptionStatus(userData.subscriptionStatus); // Assuming 'subscriptionstatus' is the field
        } else {
          setSubscriptionStatus('active'); // Default to 'inactive' if no user data found
        }
      } else {
        setSubscriptionStatus(null); // No user means no subscription status
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = {
    user,
    subscriptionStatus,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom hook for accessing the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};
