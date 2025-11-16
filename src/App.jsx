import { Routes, Route } from "react-router-dom";
import SplashPage from "./pages/splash/entry/SplashPage";
import ScrollToTop from "./hook/useScrollTop";
import ReportPage from "./pages/report/entry/ReportPage";
import ReportSearchPage from "./pages/report-search/entry/ReportSearchPage";
import ReportEditPage from "./pages/report-edit/entry/ReportEditPage";
import MapPage from "./pages/map/entry/mapPage";
import ReportMapPage from "./pages/report-map/entry/ReportMapPage";
import OnboardingPage from "./pages/onboarding/entry/OnboardingPage";
import SignupPage from "./pages/signup/entry/SignupPage";
import SignupPage1 from "./pages/signup/entry/SignupPage1";
import SignupPage2 from "./pages/signup/entry/SignupPage2";
import SignupPage3 from "./pages/signup/entry/SignupPage3";
import LoginPage from "./pages/signup/entry/LoginPage";
import MyPage from "./pages/mypage/entry/MyPage";
import MyReportsPage from "./pages/mypage/entry/MyReportsPage";
import EditPage from "./pages/mypage/entry/EditPage";
import EditNamePage from "./pages/mypage/entry/EditNamePage";
import EditEmailPage from "./pages/mypage/entry/EditEmailPage";

function App() {
  return (
    <div className="app-container">
      <div className="scroll-area">
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<SplashPage />} />

          {/* #1 지도 페이지 (이영규) */}
          <Route path="/map" element={<MapPage />} />

          {/* #2 제보 페이지 (엄태성 */}
          <Route path="/report" element={<ReportPage />} />
          <Route path="/report-search" element={<ReportSearchPage />} />
          <Route path="/report-edit" element={<ReportEditPage />} />
          <Route path="/report-map" element={<ReportMapPage />} />

          {/* #3 로그인/회원가입, 마이페이지 (송이림) */}
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/signup1" element={<SignupPage1 />} />
          <Route path="/signup2" element={<SignupPage2 />} />
          <Route path="/signup3" element={<SignupPage3 />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/mypage/reports" element={<MyReportsPage />} />
          <Route path="/mypage/edit" element={<EditPage />} />
          <Route path="/mypage/edit/name" element={<EditNamePage />} />
          <Route path="/mypage/edit/email" element={<EditEmailPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
