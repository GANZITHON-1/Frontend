import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../ui/MyPage.css";
import { api } from "../../../api/index";
import NavigationBar from "../../../component/NavigationBar/NavigationBar";

export function EditNamePage() {
  const navigate = useNavigate();
  const location = useLocation();

  // EditPage에서 전달받은 현재 이름/이메일
  const originalName = location.state?.currentName || "사용자 이름";
  const currentEmail = location.state?.currentEmail || "user@salpyeo.com";

  const [name, setName] = useState(originalName);

  // 2자 이상, 기존 이름 아닐 때 수정 버튼 활성화
  const isActive = name.trim().length >= 2 && name !== originalName;

  // 내 정보 수정 함수
  const handleUpdateName = async () => {
    const payload = {
      name: name.trim(), // 새로 변경할 이름
      email: currentEmail, // 기존 이메일(api 호출 때문에 추가)
    };

    try {
      const response = await api.put("/mypage/profile", payload);

      if (response.data.success) {
        // 성공 시
        localStorage.setItem("user_name", response.data.data.name);

        // 성공 토스트 메시지 값 전달
        navigate("/mypage/edit", {
          replace: true,
          state: { toast: "이름을 변경했어요" },
        });
      } else {
        console.error("이름 수정 실패:", response.data.message);
      }
    } catch (error) {
      console.error(
        "이름 수정 실패:",
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
        <div className="title">이름을 입력해주세요</div>
        <div className="inputBox">
          <div className="inputTitle">이름</div>
          <input
            className="mypage-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></input>
        </div>
        <button
          className={`btn ${isActive ? "active" : ""}`}
          onClick={handleUpdateName}
        >
          다음
        </button>
      </div>
    </div>
  );
}

export default EditNamePage;
