import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../ui/SignupPage.css";
import NavigationBar from "../../../component/NavigationBar/NavigationBar";
import eyeclose from "../../../assets/icons/eyeclose.svg";
import eyeopen from "../../../assets/icons/eyeopen.svg";

export function LoginPage() {
  const navigate = useNavigate();
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");

  // 두 입력값이 모두 있을 때만 버튼 활성화
  const isActive = id.trim() !== "" && pw.trim() !== "";

  // 비밀번호 보이기/숨기기 상태
  const [showPw, setShowPw] = useState(false);

  // 비밀번호 보이기/숨기기 토글
  const togglePw = () => setShowPw((prev) => !prev);

  const inputType = showPw ? "text" : "password";

  return (
    <div className="signup-container">
      <div className="navigationbar">
        <NavigationBar />
      </div>
      <div className="container">
        <div className="title">
          앱이름에
          <br /> 오신걸 환영해요
        </div>
        <div className="inputBox">
          <div className="inputTitle-hidden">공간 유지용</div>
          <input
            className={`input ${id.trim() !== "" ? "active" : ""}`}
            placeholder="아이디"
            value={id}
            onChange={(e) => setId(e.target.value)}
          ></input>
          <div className="errorText">올바른 아이디를 입력해 주세요.</div>
          <div className="input-wrapper">
            <input
              type={showPw ? "text" : "password"}
              className={`input ${pw.trim() !== "" ? "active" : ""}`}
              placeholder="비밀번호"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
            ></input>

            <button type="button" className="eyeIcon2-2" onClick={togglePw}>
              <img src={showPw ? eyeopen : eyeclose} />
            </button>
          </div>
          <div className="errorText">올바른 비밀번호를 입력해 주세요.</div>
        </div>

        <button className={`btn ${isActive ? "active" : ""}`}>로그인</button>
      </div>
    </div>
  );
}

export default LoginPage;
