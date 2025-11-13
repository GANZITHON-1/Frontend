import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../ui/MyPage.css";
import NavigationBar from "../../../component/NavigationBar/NavigationBar";

export function EditEmailPage() {
  const navigate = useNavigate();
  const [originalEmail] = useState("tmxhdjf@naver.com");
  const [email, setEmail] = useState(originalEmail);

  // 기존 이메일 아닐 때 수정 버튼 활성화
  const isActive = email !== originalEmail;

  const goNext = () => {
    if (isActive) {
      navigate("/mypage/edit", {
        replace: true,
        state: { toast: "이메일을 변경했어요" },
      });
    }
  };

  return (
    <div className="signup-container">
      <div className="navigationbar">
        <NavigationBar />
      </div>
      <div className="container">
        <div className="title">이메일 주소를 입력해주세요</div>
        <div className="inputBox">
          <div className="inputTitle">이메일</div>
          <input
            className="input"
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

export default EditEmailPage;
