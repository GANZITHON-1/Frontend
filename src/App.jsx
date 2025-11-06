import { Routes, Route } from "react-router-dom";
import SplashPage from "./pages/splash/entry/SplashPage";
import ScrollToTop from "./hook/useScrollTop";

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<SplashPage />} />
      </Routes>
    </>
  );
}

export default App;
