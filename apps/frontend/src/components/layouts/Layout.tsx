import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

const Layout = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden m-8 ">
        {/* Top Bar */}
        <Header />

        {/* Page Content */}
        <main className="flex-1 bg-white overflow-auto mt-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
