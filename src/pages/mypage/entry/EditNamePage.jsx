import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../ui/MyPage.css";

import NavigationBar from "../../../component/NavigationBar/NavigationBar";

export function EditNamePage() {
  const navigate = useNavigate();
  const [originalName] = useState("마라탕");
  const [name, setName] = useState(originalName);

  // 2자 이상, 기존 이름 아닐 때 수정 버튼 활성화
  const isActive = name.trim().length >= 2 && name !== originalName;

  const goNext = () => {
    if (isActive) {
      navigate("/mypage/edit", {
        replace: true,
        state: { toast: "이름을 변경했어요" },
      });
    }
  };

  return (
    <div className="signup-container">
      <div className="navigationbar">
        <NavigationBar />
      </div>
      <div className="container">
        <div className="title">이름을 입력해주세요</div>
        <div className="inputBox">
          <div className="inputTitle">이름</div>
          <input
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></input>
        </div>

        <button className={`btn ${isActive ? "active" : ""}`} onClick={goNext}>
          다음
        </button>
      </div>
    </div>
  );
}

export default EditNamePage;
