import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../ui/SignupPage.css";
import NavigationBar from "../../../component/NavigationBar/NavigationBar";
import eyeclose from "../../../assets/icons/eyeclose.svg";
import eyeopen from "../../../assets/icons/eyeopen.svg";

export function SignupPage2() {
  const navigate = useNavigate();
  const [pw1, setPw1] = useState("");
  const [pw2, setPw2] = useState("");

  // 두 입력값이 모두 있을 때만 버튼 활성화
  const isActive = pw1.trim() !== "" && pw2.trim() !== "";

  const goNext = () => {
    if (isActive) {
      navigate("/signup3");
    }
  };

  // 비밀번호 보이기/숨기기 상태
  const [showPw1, setShowPw1] = useState(false);
  const [showPw2, setShowPw2] = useState(false);

  // 비밀번호 보이기/숨기기 토글
  const togglePw1 = () => setShowPw1((prev) => !prev);
  const togglePw2 = () => setShowPw2((prev) => !prev);

  const inputType1 = showPw1 ? "text" : "password";
  const inputType2 = showPw2 ? "text" : "password";

  return (
    <div className="signup-container">
      <div className="navigationbar">
        <NavigationBar />
      </div>
      <div className="container">
        <div className="title">
          로그인에 사용할
          <br /> 비밀번호를 입력해 주세요
        </div>
        <div className="inputBox">
          <div className="inputTitle">비밀번호</div>
          <input
            type={showPw1 ? "text" : "password"}
            className={`input ${pw1.trim() !== "" ? "active" : ""}`}
            placeholder="영문, 숫자, 특수문자가 모두 들어간 8-16자"
            value={pw1}
            onChange={(e) => setPw1(e.target.value)}
          ></input>
          <button type="button" className="eyeIcon1" onClick={togglePw1}>
            <img src={showPw1 ? eyeopen : eyeclose} />
          </button>
          <input
            type={showPw2 ? "text" : "password"}
            className={`input ${pw2.trim() !== "" ? "active" : ""}`}
            placeholder="한번 더 입력해 주세요."
            value={pw2}
            onChange={(e) => setPw2(e.target.value)}
          ></input>
          <button type="button" className="eyeIcon2" onClick={togglePw2}>
            <img src={showPw2 ? eyeopen : eyeclose} />
          </button>
        </div>

        <button className={`btn ${isActive ? "active" : ""}`} onClick={goNext}>
          다음
        </button>
      </div>
    </div>
  );
}

export default SignupPage2;
