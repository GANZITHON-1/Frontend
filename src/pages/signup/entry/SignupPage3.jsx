import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import confetti from "canvas-confetti";
import "../ui/SignupPage.css";
import { api } from "../../../api/index";

// 3초 후 메인화면 이동
const AUTO_REDIRECT_DELAY = 3000;

export function SignupPage3() {
  const navigate = useNavigate();
  const location = useLocation();

  // 이전 페이지에서 전달받은 데이터
  const { name, email, nickname, password, passwordConfirm } =
    location.state || {};

  // API 호출 상태 관리
  const [loading, setLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);

  // 회원가입 함수
  useEffect(() => {
    // 필수 정보가 누락된 경우
    if (!name || !email || !nickname || !password || !passwordConfirm) {
      console.error("필수 가입 정보가 누락되었습니다.");
      setLoading(false);
      return;
    }

    const signUp = async () => {
      setLoading(true);

      const payload = {
        name,
        email,
        nickname,
        password,
        passwordConfirm,
      };

      try {
        const response = await api.post("/auth/signup", payload);

        if (response.data.success) {
          // 성공 시
          setIsSuccess(true);
          console.log("회원가입 성공", response.data);

          // 폭죽
          confetti({
            particleCount: 100,
            spread: 90,
            startVelocity: 30,
            origin: { x: 0.5, y: 0.48 },
            colors: ["#F97316", "#2563EB", "#22C55E"],
            scalar: 1.5,
            ticks: 120,
          });

          // 3초 후 메인화면으로 이동
          const timer = setTimeout(() => {
            navigate("/map");
          }, AUTO_REDIRECT_DELAY);

          return () => clearTimeout(timer); // 클린업
        } else {
          console.warn("회원가입 실패", response.data.message);
          setIsSuccess(false);
        }
      } catch (error) {
        console.error("회원가입 실패", error);
        setIsSuccess(false);
      } finally {
        setLoading(false);
      }
    };

    signUp();
  }, [navigate, name, email, nickname, password, passwordConfirm]);

  //로딩중
  if (loading || !isSuccess) {
    return null;
  }
  return (
    <div className="welcomeText">
      <div>반가워요!</div>
    </div>
  );
}

export default SignupPage3;
