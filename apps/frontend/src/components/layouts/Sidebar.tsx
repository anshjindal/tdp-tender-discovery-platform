import { Link } from "react-router-dom";
import logo from "../../assets/wouessi-new-logo.png";

const Sidebar = () => {
  return (
    <nav className="w-64 bg-gray-800 text-white p-5 space-y-4">
      <img src={logo} alt="Wouessi Logo" className="w-32 h-auto" />
      <ul className="space-y-3">
        <li>
          <Link to="/tenderdata" className="block p-3 bg-gray-700 rounded">
            Tender Data
          </Link>
        </li>
        <li>
          <Link to="/lg" className="block p-3 bg-gray-700 rounded">
            Lead Generation
          </Link>
        </li>
        <li>
          <Link to="/ca" className="block p-3 bg-gray-700 rounded">
            Capability Assessment
          </Link>
        </li>
        <li>
          <Link to="/bm" className="block p-3 bg-gray-700 rounded">
            Benchmarking
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;
