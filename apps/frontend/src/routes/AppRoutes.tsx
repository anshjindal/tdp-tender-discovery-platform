import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "../components/layouts/Layout";
import TenderData from "../features/tender-data/TenderData";
import LgMain from "../features/tdp-lg/lg-main";
import CaMain from "../features/tdp-ca/ca-main";
import BmMain from "../features/tdp-bm/bm-main";
import {AiSearchTender} from "../features/tdp-lg/pages/AiTenderSearch";
import UploadDoc from '../features/tdp-ca/pages/UploadDoc' // Import UploadDoc from tdp-ca
import ForgotResetPassword from "../auth/pages/ForgotResetPassword";
import Login from "../auth/pages/login";
import SignUp from "../auth/pages/SignUp";
import {SearchTender} from "../features/tdp-lg/pages/TenderSearch"
// "../features/tdp-lg/pages/TenderSearch";
import TenderDetails from "../features/tdp-lg/components/SubmittedTenderDetails";
import TenderDashboard from "../features/tdp-lg/pages/TenderDashboard";
import BidStatusUpdates from '../features/tdp-lg/pages/BidStatusUpdates';
import MyBids from "../features/tdp-lg/pages/MyBids";
const AppRoutes = () => {
  return (
    <Routes>
    {/* Redirect root to /tenderdata */}
    <Route path="/" element={<Navigate to="/tenderdata" />} />

    {/* All pages under Layout */}
    <Route path="/" element={<Layout />}>
      <Route path="/tenderdata" element={<TenderData />} />
      <Route path="login" element={<Login />} />
      <Route path="forgot-reset-password" element={<ForgotResetPassword />} />
      <Route path="forgot-reset-password/:token" element={<ForgotResetPassword />} />
      <Route path="signup" element={<SignUp />} />

      {/* TDP-LG Feature Routes */}
      <Route path="lg" element={<Navigate to="/lg/search-tender" />} />
      <Route path="lg/search-tender" element={<SearchTender />} />
        <Route path="tender/:subId" element={<TenderDetails />} />
        <Route path="lg/my_tenders" element={<TenderDashboard />} />
        <Route path="/bidupdates" element={<BidStatusUpdates />} />
        <Route path="lg/my_bids" element={<MyBids />} />
      <Route path="lg/ai-search-tender" element={<AiSearchTender />} />

      {/* Other Feature Routes */}
      <Route path="ca" element={<CaMain />} />
      <Route path="ca/UploadDoc" element={<UploadDoc />} />
      
      <Route path="bm" element={<BmMain />} />
    </Route>
  </Routes>
  );
};

export default AppRoutes;
