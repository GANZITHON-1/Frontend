import { Routes, Route } from "react-router-dom";
import SplashPage from "./pages/splash/entry/SplashPage";
import ScrollToTop from "./hook/useScrollTop";
import ReportPage from "./pages/report/entry/ReportPage";
import ReportSearchPage from "./pages/report-search/entry/ReportSearchPage";
import ReportEditPage from "./pages/report-edit/entry/ReportEditPage";

function App() {
  return (
    <div className="app-container">
      <div className="scroll-area">
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<SplashPage />} />
          <Route path="/report" element={<ReportPage />} />
          <Route path="/report-search" element={<ReportSearchPage />} />
          <Route path="/report-edit" element={<ReportEditPage />} />

          {/* #1 지도 페이지 (이영규) */}
          <Route path="/map" element={<MapPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
