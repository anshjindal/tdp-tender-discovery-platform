import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "../components/layouts/Layout";

// Auth
import ForgotResetPassword from "../auth/pages/ForgotResetPassword";
import Login from "../auth/pages/login";
import SignUp from "../auth/pages/SignUp";

// TDP-LG
import TenderData from "../features/tdp-lg/pages/TenderData";
import { AiSearchTender } from "../features/tdp-lg/pages/AiTenderSearch";
import { SearchTender } from "../features/tdp-lg/pages/TenderSearch";
import LgMain from "../features/tdp-lg/lg-main";

// TDP-TM
import TenderDetails from "../features/tdp-tm/components/SubmittedTenderDetails";
import TenderDashboard from "../features/tdp-tm/pages/TenderDashboard";
import BidStatusUpdates from "../features/tdp-tm/pages/BidStatusUpdates";
import MyBids from "../features/tdp-tm/pages/MyBids";

// TDP-CA
import CaMain from "../features/tdp-ca/pages/ca-main";
import UploadDoc from "../features/tdp-ca/pages/UploadDoc";

// TDP-BM & KB
import BmMain from "../features/tdp-bm/pages/bm-main";
import KbMain from "../features/tdp-kb/pages/kb-main";


const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="lg/search-tender" />} />
      <Route path="/" element={<Layout />}>

        {/* Auth Routes */}
        <Route path="login" element={<Login />} />
        <Route path="forgot-reset-password" element={<ForgotResetPassword />} />
        <Route path="forgot-reset-password/:token" element={<ForgotResetPassword />} />
        <Route path="signup" element={<SignUp />} />

        {/* TDP-LG */}
        <Route path="lg" element={<Navigate to="/lg/search-tender" />} />
        <Route path="lg/search-tender" element={<SearchTender />} />
        <Route path="lg/tenderdata" element={<TenderData />} />
        <Route path="lg/ai-search-tender" element={<AiSearchTender />} />

        {/* TDP-TM */}
        <Route path="tm/my_bids" element={<MyBids />} />
        <Route path="tm/my_tenders" element={<TenderDashboard />} />
        <Route path="/bidupdates" element={<BidStatusUpdates />} />
        <Route path="tender/:subId" element={<TenderDetails />} />

        {/* Other Features */}
        <Route path="ca/camain" element={<CaMain />} />
        <Route path="ca/UploadDoc" element={<UploadDoc />} />
        <Route path="bm" element={<BmMain />} />
        <Route path="kb/kbmain" element={<KbMain />} />
      </Route>
    </Routes>
  );
};


export default AppRoutes;
