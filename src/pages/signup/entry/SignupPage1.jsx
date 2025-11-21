import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../ui/SignupPage.css";
import NavigationBar from "../../../component/NavigationBar/NavigationBar";

export function SignupPage1() {
  const navigate = useNavigate();
  const location = useLocation();
  const [nickname, setNickname] = useState("");

  // 이전 페이지에서 전달받은 데이터
  const { name, email } = location.state || {};

  // 두 입력값이 모두 있을 때만 버튼 활성화
  const isActive = nickname.trim() !== "";

  const goNext = () => {
    if (nickname.trim() === "") {
      console.log("올바른 아이디를 입력해 주세요.");
      return;
    }

    if (isActive) {
      navigate("/signup2", {
        state: {
          name: name,
          email: email,
          nickname: nickname,
        },
      });
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
            className={`signup-input ${nickname.trim() !== "" ? "active" : ""}`}
            placeholder="abc123"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          ></input>
        </div>

        <button
          className={`btn ${isActive ? "active" : ""}`}
          onClick={goNext}
          disabled={!isActive}
        >
          다음
        </button>
      </div>
    </div>
  );
}

export default SignupPage1;
