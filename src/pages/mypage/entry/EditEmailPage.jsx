import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../ui/MyPage.css";
import { api } from "../../../api/index";
import NavigationBar from "../../../component/NavigationBar/NavigationBar";

//이메일 형식 검사
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export function EditEmailPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // EditPage에서 전달받은 현재 이름/이메일
  const currentName = location.state?.currentName || "사용자 이름";
  const originalEmail = location.state?.currentEmail || "user@salpyeo.com";

  const [email, setEmail] = useState(originalEmail);

  // 기존 이메일 아닐 때 & 유효한 이메일 형식일 때 수정 버튼 활성화
  const isActive = email !== originalEmail && isValidEmail(email);

  // 내 정보 수정 함수
  const handleUpdateEmail = async () => {
    const payload = {
      name: currentName, // 기존 이름(api 호출 때문에 추가)
      email: email.trim(), // 새로 변경할 이메일
    };

    try {
      const response = await api.put("/mypage/profile", payload);

      if (response.data.success) {
        // 성공 시
        localStorage.setItem("user_email", response.data.data.email);

        // EditPage로 돌아가면서 성공 토스트 메시지 전달
        navigate("/mypage/edit", {
          replace: true,
          state: { toast: "이메일을 변경했어요" },
        });
      } else {
        console.error("이메일 수정 실패:", response.data.message);
      }
    } catch (error) {
      console.error(
        "이메일 수정 실패:",
        error.response?.data?.message || error.message
      );
    } finally {
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
            className="mypage-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></input>
        </div>

        <button
          className={`btn ${isActive ? "active" : ""}`}
          onClick={handleUpdateEmail}
        >
          다음
        </button>
      </div>
    </div>
  );
}

export default EditEmailPage;
