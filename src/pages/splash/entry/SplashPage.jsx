import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../ui/SplashPage.css";
import splashImage from "../../../assets/images/splashImage.png";

// 3초 후 온보딩화면 이동
const AUTO_REDIRECT_DELAY = 3000;
const FADE_OUT_DURATION = 500;

export function SplashPage() {
  const navigate = useNavigate();
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const fadeOutTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, AUTO_REDIRECT_DELAY - FADE_OUT_DURATION);

    const redirectTimer = setTimeout(() => {
      navigate("/onboarding");
    }, AUTO_REDIRECT_DELAY);

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(redirectTimer);
    };
  }, [navigate]);

  return (
    <div className={`splash-container ${isFadingOut ? "fade-out" : ""}`}>
      <img src={splashImage} className="splashText" />
    </div>
  );
}

export default SplashPage;
