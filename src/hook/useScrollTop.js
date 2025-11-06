// ScrollToTop.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      // hash가 있을 때 해당 id로 스크롤 이동
      const element = document.getElementById(hash.replace("#", ""));
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      // hash가 없을 때만 맨 위로 이동
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null; // 아무 것도 렌더하지 않음
};

export default ScrollToTop;
