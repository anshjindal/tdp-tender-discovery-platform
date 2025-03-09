import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TenderData from "./pages/TenderData";
import LeadGenChat from "./pages/LeadGenChat";
import LeadGenChatV2 from "./pages/LeadGenChatV2";
import Rfp from "./pages/Rfp";
import Login from './pages/Login';
import ForgotResetPassword from './pages/ForgotResetPassword';
import SignUp from "./pages/SignUp";
import Navbar from './component/Navbar';
import { useAuth } from './component/AuthContext'; 
import { getaccountAPI } from '../api'; 
import { useEffect, useState } from "react";
import TenderSearch from './pages/TenderSearch';

export function App() {
  const { auth, setAuth } = useAuth();
  const [appLoading, setAppLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setAppLoading(false);
        return; // No token means no authentication, stop execution
      }

      try {
        const response = await getaccountAPI(); // Fetch user data
        setAuth({
          isAuthenticated: true,
          user: {
            email: response.user.email,
            name: response.user.name || response.user.email, // Fallback to email if name is missing
          },
        });
      } catch (error) {
        console.error("Failed to fetch user account:", error);
        setAuth({ isAuthenticated: false, user: { email: "", name: "" } });
      } finally {
        setAppLoading(false); // Ensure loading state ends
      }
    };

    fetchUser();
  }, [setAuth]); // Ensure this runs when `setAuth` changes

  // Show loading state while fetching user info
  if (appLoading) {
    return (
      <div style={{
        display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'
      }}>
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div style={{ padding: '1rem' }}>
        {auth.isAuthenticated ? `Welcome, ${auth.user.name}` : 'Welcome to Wouessi'}
      </div>
      <Routes>
        <Route path="/tenderdata" element={<TenderData />} />
        <Route path="/leadgenchat" element={<LeadGenChat />} />
        <Route path="/leadgenchatv2" element={<LeadGenChatV2 />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-reset-password" element={<ForgotResetPassword />} />
        <Route path="/forgot-reset-password/:token" element={<ForgotResetPassword />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/tendersearch" element={<TenderSearch />} />
        <Route path="/rfp" element={<Rfp />} />
      </Routes>
    </>
  );
}

export default App;
