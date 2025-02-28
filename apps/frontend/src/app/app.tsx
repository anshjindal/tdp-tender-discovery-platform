import { Route, Routes, Link} from "react-router-dom"
import TenderData from "./pages/TenderData"
import LeadGenChatV2 from "./pages/LeadGenChatV2"
import Rfp from "./pages/Rfp"
export function App() {

  return (
    <>
      <nav className="flex flex-col gap-12 text-5xl font-bold">
        <Link to="/tenderdata">Check out Tender Data</Link>
        <Link to="/leadgenchatv2">
          Go to prompt page to filter leads, generation, v2
        </Link>
        <Link to="rfp">Testing page for RFP</Link>
      </nav>
      <Routes>
        <Route path="/tenderdata" element={<TenderData />} />
        <Route path="/leadgenchatv2" element={<LeadGenChatV2 />} />
        <Route path="/rfp" element={<Rfp />} />
      </Routes>
    </>
  )
}

export default App
