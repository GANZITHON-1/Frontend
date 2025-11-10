import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../ui/SignupPage.css";
import NavigationBar from "../../../component/NavigationBar/NavigationBar";

export function SignupPage1() {
  const navigate = useNavigate();
  const [id, setId] = useState("");

  // 두 입력값이 모두 있을 때만 버튼 활성화
  const isActive = id.trim() !== "";

  const goNext = () => {
    if (isActive) {
      navigate("/signup2");
    }
  };

  return (
    <div className="signup-container">
      <div className="navigationbar">
        <NavigationBar />
      </div>
      <div className="container">
        <div className="title">
          로그인에 사용할
          <br /> 아이디를 입력해 주세요
        </div>
        <div className="inputBox">
          <div className="inputTitle">아이디</div>
          <input
            className={`input ${id.trim() !== "" ? "active" : ""}`}
            placeholder="abc123"
            value={id}
            onChange={(e) => setId(e.target.value)}
          ></input>
        </div>

        <button className={`btn ${isActive ? "active" : ""}`} onClick={goNext}>
          다음
        </button>
      </div>
    </div>
  );
}

export default SignupPage1;
