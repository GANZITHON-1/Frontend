import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../ui/SignupPage.css";
import NavigationBar from "../../../component/NavigationBar/NavigationBar";

export function SignupPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // 두 입력값이 모두 있을 때만 버튼 활성화
  const isActive = name.trim() !== "" && email.trim() !== "";

  const goNext = () => {
    if (isActive) {
      navigate("/signup1");
    }
  };

  return (
    <div className="signup-container">
      <div className="navigationbar">
        <NavigationBar />
      </div>
      <div className="container">
        <div className="title">
          가입을 위해
          <br /> 정보를 입력해 주세요
        </div>
        <div className="inputBox">
          <div className="inputTitle">이름</div>
          <input
            className={`input ${name.trim() !== "" ? "active" : ""}`}
            placeholder="홍길동"
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></input>
        </div>
        <div className="inputBox">
          <div className="inputTitle">이메일</div>
          <input
            className={`input ${email.trim() !== "" ? "active" : ""}`}
            placeholder="abcde@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></input>
        </div>
        <button className={`btn ${isActive ? "active" : ""}`} onClick={goNext}>
          다음
        </button>
      </div>
    </div>
  );
}

export default SignupPage;
