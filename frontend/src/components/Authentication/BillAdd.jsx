import React, { useState, useEffect } from 'react';
import styles from './BillAdd.module.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { db } from '../../services/firebaseConfig';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../../services/AuthContext'; 
import LoginPageImage from '../../assets/bookcase.jpg';
import { getFirestore } from 'firebase/firestore'; // Import Firebase Firestore
import CustomPopup from './PaymentPopup';

const stateCityDistrictMap = {
  "Andhra Pradesh": {
    cities: ["Visakhapatnam", "Vijayawada", "Guntur", "Tirupati", "Nellore"],
    districts: ["Visakhapatnam", "Krishna", "Guntur", "Chittoor", "Nellore"]
  },
  "Arunachal Pradesh": {
    cities: ["Itanagar", "Naharlagun", "Pasighat", "Tezpur", "Ziro"],
    districts: ["Itanagar", "Pasighat", "Lower Subansiri", "West Kameng", "Papum Pare"]
  },
  "Assam": {
    cities: ["Guwahati", "Dibrugarh", "Silchar", "Nagaon", "Tezpur"],
    districts: ["Guwahati", "Dibrugarh", "Tinsukia", "Nagaon", "Karimganj"]
  },
  "Bihar": {
    cities: ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Darbhanga"],
    districts: ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Darbhanga"]
  },
  "Chhattisgarh": {
    cities: ["Raipur", "Bhilai", "Durg", "Bilaspur", "Korba"],
    districts: ["Raipur", "Durg", "Bilaspur", "Korba", "Rajnandgaon"]
  },
  "Goa": {
    cities: ["Panaji", "Margao", "Mapusa", "Ponda", "Verna"],
    districts: ["North Goa", "South Goa"]
  },
  "Gujarat": {
    cities: ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Gandhinagar"],
    districts: ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Gandhinagar"]
  },
  "Haryana": {
    cities: ["Gurugram", "Faridabad", "Hisar", "Rohtak", "Ambala"],
    districts: ["Gurugram", "Faridabad", "Hisar", "Rohtak", "Ambala"]
  },
  "Himachal Pradesh": {
    cities: ["Shimla", "Dharamshala", "Kullu", "Manali", "Solan"],
    districts: ["Shimla", "Kullu", "Mandi", "Solan", "Dharamshala"]
  },
  "Jharkhand": {
    cities: ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Deoghar"],
    districts: ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Deoghar"]
  },
  "Karnataka": {
    cities: ["Bengaluru", "Mysuru", "Mangalore", "Hubli", "Belgaum"],
    districts: ["Bengaluru", "Mysuru", "Mangalore", "Hubli", "Belgaum"]
  },
  "Kerala": {
    cities: ["Thiruvananthapuram", "Kochi", "Kozhikode", "Kollam", "Malappuram"],
    districts: ["Thiruvananthapuram", "Kochi", "Kozhikode", "Kollam", "Malappuram"]
  },
  "Madhya Pradesh": {
    cities: ["Bhopal", "Indore", "Gwalior", "Jabalpur", "Ujjain"],
    districts: ["Bhopal", "Indore", "Gwalior", "Jabalpur", "Ujjain"]
  },
  "Maharashtra": {
    cities: ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad"],
    districts: ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad"]
  },
  "Manipur": {
    cities: ["Imphal", "Thoubal", "Kakching", "Churachandpur", "Ukhrul"],
    districts: ["Imphal East", "Imphal West", "Thoubal", "Churachandpur", "Kakching"]
  },
  "Meghalaya": {
    cities: ["Shillong", "Tura", "Jowai", "Nongstoin", "Bhoi"],
    districts: ["East Khasi Hills", "West Khasi Hills", "Jaintia Hills", "Garo Hills"]
  },
  "Mizoram": {
    cities: ["Aizawl", "Lunglei", "Saiha", "Kolasib", "Champhai"],
    districts: ["Aizawl", "Lunglei", "Saiha", "Kolasib", "Champhai"]
  },
  "Nagaland": {
    cities: ["Kohima", "Dimapur", "Mokokchung", "Tuensang", "Wokha"],
    districts: ["Kohima", "Dimapur", "Mokokchung", "Tuensang", "Wokha"]
  },
  "Odisha": {
    cities: ["Bhubaneswar", "Cuttack", "Sambalpur", "Rourkela", "Berhampur"],
    districts: ["Khordha", "Cuttack", "Sambalpur", "Ganjam", "Balasore"]
  },
  "Punjab": {
    cities: ["Chandigarh", "Amritsar", "Ludhiana", "Jalandhar", "Patiala"],
    districts: ["Amritsar", "Ludhiana", "Jalandhar", "Patiala", "Mohali"]
  },
  "Rajasthan": {
    cities: ["Jaipur", "Udaipur", "Jodhpur", "Ajmer", "Bikaner"],
    districts: ["Jaipur", "Udaipur", "Jodhpur", "Ajmer", "Bikaner"]
  },
  "Sikkim": {
    cities: ["Gangtok", "Namchi", "Pakyong", "Gyalshing", "Mangan"],
    districts: ["East Sikkim", "West Sikkim", "South Sikkim", "North Sikkim"]
  },
  "Tamil Nadu": {
    cities: ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem"],
    districts: ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem"]
  },
  "Telangana": {
    cities: ["Hyderabad", "Warangal", "Khammam", "Nizamabad", "Rangareddy"],
    districts: ["Hyderabad", "Warangal", "Khammam", "Nizamabad", "Rangareddy"]
  },
  "Tripura": {
    cities: ["Agartala", "Belonia", "Dharmanagar", "Udaipur", "Kailashahar"],
    districts: ["West Tripura", "South Tripura", "Dhalai", "North Tripura"]
  },
  "Uttar Pradesh": {
    cities: ["Lucknow", "Kanpur", "Agra", "Varanasi", "Ghaziabad"],
    districts: ["Lucknow", "Kanpur", "Agra", "Varanasi", "Ghaziabad"]
  },
  "Uttarakhand": {
    cities: ["Dehradun", "Haridwar", "Nainital", "Rudrapur", "Haldwani"],
    districts: ["Dehradun", "Nainital", "Haridwar", "Udhamsingh Nagar"]
  },
  "West Bengal": {
    cities: ["Kolkata", "Siliguri", "Howrah", "Durgapur", "Asansol"],
    districts: ["Kolkata", "Howrah", "Birbhum", "Murshidabad", "North 24 Parganas"]
  },
};

const BillingForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const subscriptionId = location.state?.subscriptionId || '';
  const [price, setPrice] = useState(0);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [subscription, setSubscription] = useState({
    planName: '',
    duration: '',
    price: 0,
  });
  const [loading, setLoading] = useState(true);
  const [billingData, setBillingData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    alternatePhone: '',
    email: '',
    fullAddress: '',
    state: '',
    city: '',
    district: '',
    pincode: '',
    paymentMethod: '',
    representative: null,
    payment: 'pending',
    subscriptionId: subscriptionId,
  });

  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);

  useEffect(() => {
    setBillingData((prevData) => ({ ...prevData, subscriptionId }));
  }, [subscriptionId]);

  useEffect(() => {
    const fetchBillingAddress = async () => {
      if (user) {
        const billingRef = doc(db, 'billing', user.uid);
        const billingSnap = await getDoc(billingRef);
        
        if (billingSnap.exists()) {
          const savedBillingData = billingSnap.data();
          setBillingData((prevData) => ({
            ...prevData,
            ...savedBillingData, // Merge saved data into the existing state
          }));
        }
      }
    };

    fetchBillingAddress();
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBillingData({ ...billingData, [name]: value });

    // If state is changed, reset city and district
    if (name === "state") {
      setCities(stateCityDistrictMap[value]?.cities || []);
      setDistricts(stateCityDistrictMap[value]?.districts || []);
      setBillingData({ ...billingData, city: '', district: '' }); // Reset city and district
    }
  };

  const handleStateChange = (e) => {
    const selectedState = e.target.value;
    setBillingData((prev) => ({ ...prev, state: selectedState, city: '', district: '' }));
    setCities(stateCityDistrictMap[selectedState]?.cities || []);
    setDistricts(stateCityDistrictMap[selectedState]?.districts || []);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBillingData((prev) => ({ ...prev, [name]: value }));
  };

  //RazorPay

// Fetch subscription price from Firestore
useEffect(() => {
  const fetchPrice = async () => {
    if (!subscriptionId) {
      setLoading(false);
      return;
    }

    try {
      const db = getFirestore();
      const subscriptionRef = doc(db, 'subscriptions', subscriptionId);
      const subscriptionSnap = await getDoc(subscriptionRef);

      if (subscriptionSnap.exists()) {
        const data = subscriptionSnap.data();
        setSubscription({
          planName: data.planName,
          duration: data.duration,
          price: data.price,
        });
        setPrice(data.price);

        // Update billingData with subscriptionId
        setBillingData((prev) => ({
          ...prev,
          subscriptionId: subscriptionId,
        }));
      } else {
        console.error('No such subscription!');
        setSubscription({
          planName: '',
          duration: '',
          price: 0,
        });
        setPrice(0);
      }
    } catch (error) {
      console.error('Error fetching subscription details:', error);
    } finally {
      setLoading(false);
    }
  };

  fetchPrice(); // Corrected function call
}, [subscriptionId]);




const handleCheckout = async (e) => {
  e.preventDefault();


  if (price <= 0) {
    alert('Invalid subscription or price not available.');
    return;
  }

  // Validate required fields in billingData
  const requiredFields = [
    'firstName',
    'lastName',
    'phone',
    'email',
    'fullAddress',
    'state',
    'city',
    'district',
    'pincode',
    'paymentMethod',
  ];

  for (let field of requiredFields) {
    if (!billingData[field]) {
      alert(`Please fill in the ${field}.`);
      return;
    }
  }

  const { paymentMethod } = billingData;

  // Prepare final billing data
  const finalBillingData = {
    ...billingData,
    uid: user.uid,
    creationDate: new Date().toISOString(),
  };

  try {
    // Save billing information to Firestore only if all fields are filled
    await setDoc(doc(db, 'billing', user.uid), finalBillingData);
    console.log('Billing information saved successfully.');

    if (paymentMethod === 'cash') {
      // Show popup for cash payment
      setIsPopupOpen(true);
      return;
    } else if (paymentMethod === 'online') {
      // Trigger Razorpay checkout
      proceedToRazorpayCheckout();
    } else {
      alert('Invalid payment method selected.');
    }
  } catch (error) {
    console.error('Error during checkout process:', error);
    alert('An error occurred while processing your checkout. Please try again.');
  }
};

// Function to proceed with Razorpay
const proceedToRazorpayCheckout = async () => {
  try {
    // Update the paymentMethod to 'online' in Firestore
    const billingDocRef = doc(db, 'billing', user.uid);
    await updateDoc(billingDocRef, {
      paymentMethod: 'online', // Set payment method to online
    });

    // Proceed to Razorpay checkout
    const response = await fetch('http://61.246.67.74:3000/api/payment/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: price,
        currency: 'INR',
        receipt: `receipt_${billingData.subscriptionId}`,
      }),
    });

    const data = await response.json();

    const options = {
      key: 'rzp_live_qMTTMOsAEnmxqj', // Your Razorpay API key
      amount: price * 100, // Amount in paise (multiply by 100 to convert to INR)
      currency: 'INR',
      name: `${billingData.firstName} ${billingData.lastName}`,
      description: `Billing for: ${billingData.fullAddress}`,
      order_id: billingData.orderId, // Optional order ID
      handler: async (response) => {
        try {
          console.log('Payment response:', response);
      
          const paymentStatus = 'Successful'; // Mark payment as received
      
          // Update payment status in 'billing' collection
          await updateDoc(billingDocRef, {
            payment: paymentStatus,
          });
      
          // Update subscription status in the 'subscriptions' collection
          const subscriptionDocRef = doc(db, 'subscriptions', billingData.subscriptionId);
          await updateDoc(subscriptionDocRef, {
            subscriptionStatus: 'active', // Set subscriptionStatus to active
          });
      
          // Optionally, update the subscriptionStatus in the 'users' collection
          const subscriptionDocSnap = await getDoc(subscriptionDocRef);
          if (subscriptionDocSnap.exists()) {
            const subscriptionData = subscriptionDocSnap.data();
      
            // Get the user UID from the subscription data
            const userUid = subscriptionData.uid;
      
            const userDocRef = doc(db, 'users', userUid);
            await updateDoc(userDocRef, {
              subscriptionStatus: 'active', // Set subscriptionStatus in the user's document
            });
          } else {
            console.error('No subscription document found for ID:', billingData.subscriptionId);
          }
         navigate('/');
          
        } catch (error) {
          console.error('Error updating Firestore:', error);
          alert('An error occurred while updating Firestore.');
        }
      },
      modal: {
        ondismiss: () => {
          console.log('Payment process was cancelled by the user');
        },
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  } catch (error) {
    console.error('Razorpay error:', error);
    alert('Payment failed. Please try again.');
  }
};



if (loading) {
  return <div>Loading subscription details...</div>;
}


  return (
    
    <div 
      className={styles.billingContainer}
      style={{
        backgroundImage: `url(${LoginPageImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center 80%',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <CustomPopup 
  isOpen={isPopupOpen} 
  onClose={() => setIsPopupOpen(false)} 
  onContinue={proceedToRazorpayCheckout} 
/>
      <div className={styles.billingForm}>
        <h2 className={styles.title}>Billing Address</h2>
        <form>
          <div className={styles.inputContainer}>
            <input
              type="text"
              name="firstName"
              className={styles.BillingInputField}
              placeholder="First Name"
              value={billingData.firstName}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="lastName"
              className={styles.BillingInputField}
              placeholder="Last Name"
              value={billingData.lastName}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className={styles.inputContainer}>
            <input
              type="text"
              name="phone"
              className={styles.BillingInputField}
              placeholder="Phone"
              value={billingData.phone}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="alternatePhone"
              className={styles.BillingInputField}
              placeholder="Alternate Phone"
              value={billingData.alternatePhone}
              onChange={handleInputChange}
            />
          </div>

          <div className={styles.inputContainer}>
            <input
              type="email"
              name="email"
              className={styles.BillingInputField}
              placeholder="Email"
              value={billingData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className={styles.inputContainer}>
            <input
              type="text"
              name="fullAddress"
              className={styles.BillingInputField}
              placeholder="Full Address"
              value={billingData.fullAddress}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className={styles.inputContainer}>
          <select name="state" value={billingData.state} onChange={handleStateChange} required className={styles.BillingInputField}>
            <option value="">Select State</option>
            {Object.keys(stateCityDistrictMap).map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>

            <select name="city" value={billingData.city} onChange={handleChange} required className={styles.BillingInputField}>
              <option value="">Select City</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>

          <select name="district" value={billingData.district} onChange={handleChange} required className={styles.BillingInputField}>
            <option value="">Select District</option>
            {districts.map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>
        </div>
          <div className={styles.inputContainer}>
            <input
              type="text"
              name="pincode"
              className={styles.BillingInputField}
              placeholder="Pincode"
              value={billingData.pincode}
              onChange={handleInputChange}
              required
            />
          </div>
            {/* Plan Details Box */}
                    <div className={styles.subscriptionContainer}>
          <div className={styles.subscriptionTile}>
            <h3>Selected Plan Details</h3>
            <p>
              <strong>Plan:</strong> <span className={styles.highlight}>{subscription.planName || 'Not Selected'}</span>
            </p>
            <p>
              <strong>Duration:</strong> <span className={styles.highlight}>{subscription.duration || 'Not Selected'} Days</span>
            </p>
            <p>
              <strong>Price:</strong> <span className={styles.highlight}>₹{subscription.price || '0'}</span>
            </p>
          </div>
        </div>
          <h3>Select Payment Method</h3>
          <div className={styles.paymentOptions}>
            <label>
              <input
                type="radio"
                name="paymentMethod"
                value="cash"
                checked={billingData.paymentMethod === 'cash'}
                onChange={handleInputChange}
              />
              Cash
            </label>
            <label>
              <input
                type="radio"
                name="paymentMethod"
                value="online"
                checked={billingData.paymentMethod === 'online'}
                onChange={handleInputChange}
              />
              Online
            </label>
          </div>
          <button onClick={handleCheckout} className={styles.submitButton} >Proceed to Checkout</button>

        </form>
      </div>
    </div>
  );
};

export default BillingForm;