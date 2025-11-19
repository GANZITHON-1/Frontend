import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../ui/SignupPage.css";
import { api } from "../../../api/index";
import NavigationBar from "../../../component/NavigationBar/NavigationBar";
import eyeclose from "../../../assets/icons/eyeclose.svg";
import eyeopen from "../../../assets/icons/eyeopen.svg";

export function LoginPage() {
  const navigate = useNavigate();
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가
  const [idError, setIdError] = useState("");
  const [pwError, setPwError] = useState("");

  // 두 입력값이 모두 있을 때만 버튼 활성화
  const isActive = id.trim() !== "" && pw.trim() !== "";

  // 비밀번호 보이기/숨기기 상태
  const [showPw, setShowPw] = useState(false);

  // 비밀번호 보이기/숨기기 토글
  const togglePw = () => setShowPw((prev) => !prev);

  const inputType = showPw ? "text" : "password";

  // 로그인 함수
  const handleLogin = async () => {
    setIdError("");
    setPwError("");

    let isValid = true;
    if (id.trim() === "") {
      setIdError("올바른 아이디를 입력해 주세요.");
      isValid = false;
    }
    if (pw.trim() === "") {
      setPwError("올바른 비밀번호를 입력해 주세요.");
      isValid = false;
    }

    // 유효성 검사 실패 시 API 호출하지 않고 중단
    if (!isValid || isLoading) return;

    setIsLoading(true);

    try {
      const response = await api.post("/auth/login", {
        userId: id,
        password: pw,
      });

      // 응답 데이터에서 success 확인
      if (response.data.success) {
        const { token, userId } = response.data.data;

        // JWT 토큰 저장
        localStorage.setItem("jwt_token", token);

        // ID 저장(탈퇴 기능에 필요)
        localStorage.setItem("user_id", userId.toString());

        // 로그인 성공 후 지도 페이지로 이동
        navigate("/map");
        console.log("로그인 성공", response.data);
      } else {
        setIdError("올바른 아이디를 입력해 주세요.");
        setPwError("올바른 비밀번호를 입력해 주세요.");
      }
    } catch (error) {
      console.error("로그인 API 요청 오류:", error);
      setIdError("올바른 아이디를 입력해 주세요.");
      setPwError("올바른 비밀번호를 입력해 주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="navigationbar">
        <NavigationBar />
      </div>
      <div className="container">
        <div className="title">
          살펴에
          <br /> 오신걸 환영해요
        </div>
        <div className="inputBox">
          <div className="inputTitle-hidden">공간 유지용</div>
          <input
            className={`custom-input ${id.trim() !== "" ? "active" : ""} ${
              idError ? "error" : ""
            }`}
            placeholder="아이디"
            value={id}
            onChange={(e) => setId(e.target.value)}
            disabled={isLoading}
          ></input>
          <div
            className="errorText"
            style={{ display: idError ? "block" : "none" }}
          >
            {idError}
          </div>
          <div className="input-wrapper">
            <input
              type={showPw ? "text" : "password"}
              className={`custom-input ${pw.trim() !== "" ? "active" : ""} ${
                pwError ? "error" : ""
              }`}
              placeholder="비밀번호"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              disabled={isLoading}
            ></input>

            <button type="button" className="eyeIcon2-2" onClick={togglePw}>
              <img src={showPw ? eyeopen : eyeclose} />
            </button>
          </div>
          <div
            className="errorText"
            style={{ display: pwError ? "block" : "none" }}
          >
            {pwError}
          </div>
        </div>

        <button
          className={`btn ${isActive && !isLoading ? "active" : ""}`}
          onClick={handleLogin}
          disabled={!isActive || isLoading}
        >
          로그인
        </button>
      </div>
    </div>
  );
}

export default LoginPage;
