import React from "react";
import Header from "./components/Header/Header";
import { Route, Routes } from "react-router-dom";
import SubFooter from "./components/SubFooter/SubFooter";
import Home from "./pages/Home1.jsx"; // Ensure Home1.jsx is correctly imported
import IndexPage from "./pages/IndexPage";
import JudgesProfile from "./pages/JudgesProfile";
import Pad from "./pages/PadPage";

import ArticleResults from "./pages/ArticleResult.jsx";
import Statutes from "./pages/Statutes.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import SignUp from "./pages/SignupPage.jsx";
import CaseFinder from "./pages/CaseFinder.jsx";
import Login from "./pages/LoginPage.jsx";
import FAQ from "./pages/FAQ.jsx";
import JudgeRead from "./pages/JudgeRead.jsx";  
import ArticleRead from "./pages/ArticleRead.jsx";
import Pricing from "./pages/Pricing.jsx";
import SigninPopup from "./components/Popups/SigninPop.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import BillAdd from "./pages/BillAddPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import LJ from "./pages/LJReplace.jsx"

import Auth from './components/Authentication/Auth.jsx';

import SubscriptionTier from './components/Authentication/SubscriptionTier';
import Profile from "./components/Authentication/Profile.jsx";

import BillingAddress from "./components/Authentication/BillAdd.jsx";
import ProtectedRoute from "./components/Authentication/ProtectedRoute.jsx";

import AdminDashboard from "./pages/AdminDashboard.jsx";
import ProfileDashboard from "./pages/ProfileDashboard.jsx";

import Bookmarktest from "../src/components/Bookmarkstest/dashboard.jsx"
import Homes from "./pages/Home2.jsx"; // Ensure Home1.jsx is correctly imported
import Home3 from "./pages/Home3.jsx"; // Ensure Home1.jsx is correctly imported


  import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthProvider } from './services/AuthContext'
import axios from "axios"; // Install axios if not already done (npm install axios)
import "./App.css";

const App = () => {
    return (
        <div className="App">
            <Header />
            <div className="Content">
            <AuthProvider>
                <Routes>
                    {/* Set the default route to Home */}
                    <Route path="/" element={<Home />} />
                    <Route path="/home" element={<Homes />} />
                    <Route path="/Home3" element={<Home3 />} />


                    <Route path="/index" element={<IndexPage />} />
                    
                    <Route path="/judges-profile" element={<JudgesProfile />} />
                    <Route path="/pad" element={<Pad />} />
                    <Route path="/articles" element={<ArticleResults />} />
                    <Route path="/judge-read/:fileName" element={<JudgeRead />} />
                    <Route path="/article-read/:fileName" element={<ArticleRead />} />
                    <Route path="/statutes" element={<Statutes />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/FAQ" element={<FAQ />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/casefinder" element={<CaseFinder />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/Price" element={<Pricing />} />
                    <Route path="/Price" element={<SigninPopup/>}/>
                    <Route path="/Dashboard" element={<Dashboard/>}/>
                    <Route path="/BillAdd" element={<BillAdd/>}/>
                    <Route path="/ProfilePage" element={<ProfilePage/>}/>
                    <Route path="/Profile" element={<Profile/>}/>
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/subscription-tier" element={<SubscriptionTier />} />
                    <Route path="/billingAddress" element={<BillingAddress />} />
                    <Route path="/LJ" element={<LJ />} />

                    <Route path="/AdminDashboard" element={<AdminDashboard />}  />
                    <Route path="/ProfileDashboard" element={<ProfileDashboard />}  />
                    <Route path="/bookmarktest" element={<Bookmarktest />}  />

                    {/* Add more routes as needed */}
                </Routes>
            </AuthProvider>
            </div>
            <SubFooter />
        </div>
    );
};

export default App;






