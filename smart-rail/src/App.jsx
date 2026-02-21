import { Routes, Route } from "react-router-dom";
import { SmartRailProvider } from "./hooks/useSmartRail";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import InspectionPage from "./pages/InspectionPage";
import PenaltyPage from "./pages/PenaltyPage";
import RACPage from "./pages/RACPage";
import ReportsPage from "./pages/ReportsPage";
import ReviewsPage from "./pages/ReviewsPage";
import ComplaintsPage from "./pages/ComplaintsPage";
import TrainDirectoryPage from "./pages/TrainDirectoryPage";
import NotificationsPage from "./pages/NotificationsPage";
import SupportPage from "./pages/SupportPage";
import IncidentsPage from "./pages/IncidentsPage";
import HandoverPage from "./pages/HandoverPage";
import SeatManagementPage from "./pages/SeatManagementPage";

function App() {
  return (
    <SmartRailProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/inspection" element={<InspectionPage />} />
          <Route path="/penalties" element={<PenaltyPage />} />
          <Route path="/rac-upgrades" element={<RACPage />} />
          <Route path="/train-directory" element={<TrainDirectoryPage />} />
          <Route path="/reviews" element={<ReviewsPage />} />
          <Route path="/complaints" element={<ComplaintsPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/incidents" element={<IncidentsPage />} />
          <Route path="/seat-management" element={<SeatManagementPage />} />
          <Route path="/handover" element={<HandoverPage />} />
          <Route path="/reports" element={<ReportsPage />} />
        </Route>
      </Routes>
    </SmartRailProvider>
  );
}

export default App;
