import { Routes, Route } from "react-router-dom";
import SplashPage from "./pages/splash/entry/SplashPage";
import ScrollToTop from "./hook/useScrollTop";
import ReportPage from "./pages/report/entry/ReportPage";
import OnboardingPage from "./pages/onboarding/entry/OnboardingPage";

function App() {
  return (
    <div className="app-container">
      <div className="scroll-area">
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<SplashPage />} />
          <Route path="/report" element={<ReportPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
