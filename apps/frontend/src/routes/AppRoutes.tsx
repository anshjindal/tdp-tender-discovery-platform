import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "../components/layouts/Layout";
import TenderData from "../features/tender-data/TenderData";
import LgMain from "../features/tdp-lg/lg-main";
import CaMain from "../features/tdp-ca/ca-main";
import BmMain from "../features/tdp-bm/bm-main";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Redirect from the root path to /tenderdata */}
      <Route path="/" element={<Navigate to="/tenderdata" />} />
      
      {/* Apply Layout to all pages */}
      <Route path="/" element={<Layout />}>
        <Route path="tenderdata" element={<TenderData />} />
        <Route path="lg" element={<LgMain />} />
        <Route path="ca" element={<CaMain />} />
        <Route path="bm" element={<BmMain />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
