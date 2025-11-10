import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import confetti from "canvas-confetti";
import "../ui/SignupPage.css";

export function SignupPage3() {
  useEffect(() => {
    confetti({
      particleCount: 15, // 폭죽 조각 개수
      spread: 200, // 퍼지는 각도
      startVelocity: 18, // 발사 속도
      origin: { x: 0.5, y: 0.48 }, // 중앙 기준
      colors: ["#F97316", "#2563EB", "#22C55E"],
      scalar: 1.2, // 크기
      ticks: 80, // 수명
    });
  }, []);

  return (
    <div className="welcomeText">
      <div>반가워요!</div>
    </div>
  );
}

export default SignupPage3;
