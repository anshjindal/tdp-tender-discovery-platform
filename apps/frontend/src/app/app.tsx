import { Route, Routes, Link, Outlet } from "react-router-dom";
import TenderData from "./pages/TenderData";
import LeadGen from "./pages/LeadGen";
import Rfp from "./pages/Rfp";
import logo from "../assets/wouessi-new-logo.png";
import { Navigate } from 'react-router-dom';



function Layout() {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <nav className="w-64 bg-gray-800 text-white p-5 space-y-4">
        <img src={logo} alt="Wouessi Logo" className="w-32 h-auto" />
        <ul className="space-y-3">
          <li>
            <Link to="/tenderdata" className="block p-3 bg-gray-700 rounded">
              Tender Data
            </Link>
          </li>
          <li>
            <Link to="/leadgen" className="block p-3 bg-gray-700 rounded">
              Lead Generation
            </Link>
          </li>
          <li>
            <Link to="/rfp" className="block p-3 bg-gray-700 rounded">
              Capability Assessment
            </Link>
          </li>
          <li>
            <Link to="/rfp" className="block p-3 bg-gray-700 rounded">
              Benchmarking
            </Link>
          </li>
        </ul>
      </nav>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-gray-900 text-white p-4 text-xl font-bold">
          Tender Discovery Platform
        </header>

        {/* Page Content */}
        <main className="p-6 flex-1 bg-gray-100 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}


export function App() {
  return (
    <Routes>
      {/* Redirect from the root path to /tenderdata */}
      <Route path="/" element={<Navigate to="/tenderdata" />} />
      
      {/* Apply Layout to all pages */}
      <Route path="/" element={<Layout />}>
        <Route path="tenderdata" element={<TenderData />} />
        <Route path="leadgen" element={<LeadGen />} />
        <Route path="rfp" element={<Rfp />} />
      </Route>
    </Routes>
  );
}

export default App;
