import { Routes, Route } from "react-router-dom";
import SplashPage from "./pages/splash/entry/SplashPage";
import MapPage from "./pages/map/entry/mapPage";
import ScrollToTop from "./hook/useScrollTop";

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<SplashPage />} />

        {/* #1 지도 페이지 (이영규) */}
        <Route path="/map" element={<MapPage />} />
      </Routes>
    </>
  );
}

export default App;
