import { Routes, Route } from "react-router-dom";
import SplashPage from "./pages/splash/entry/SplashPage";
import MapPage from "./pages/map/entry/mapPage";
import ScrollToTop from "./hook/useScrollTop";

function App() {
  return (
    <div className="app-container">
      <div className="scroll-area">
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<SplashPage />} />

          {/* #1 지도 페이지 (이영규) */}
          <Route path="/map" element={<MapPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
