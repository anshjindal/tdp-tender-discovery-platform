// trial file
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import BidStatusUpdates from "./features/tdp-lg/pages/BidStatusUpdates";
import NotificationSidebar from "./components/NotificationSidebar";

const App: React.FC = () => {
  return (
    <Router>
      <div style={{ display: "flex" }}>
        {/* Sidebar for notifications */}
        <NotificationSidebar />
        
        {/* Main Content */}
        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/bid-updates" element={<BidStatusUpdates />} />
          </Routes>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={5000} />
    </Router>
  );
};

export default App;
