import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../ui/MyPage.css";
import { api } from "../../../api/index";
import NavigationBar from "../../../component/NavigationBar/NavigationBar";
import detailIcon from "../../../assets/icons/detail.svg";

export function MyPage() {
  const navigate = useNavigate();

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupType, setPopupType] = useState(""); //로그아웃 or 탈퇴하기 여부

  const openPopup = (type) => {
    setPopupType(type);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  // 사용자 이름 표시
  const getUserNameFromStorage = () => {
    return localStorage.getItem("user_name") || "사용자";
  };

  // 인증 관련 로컬 스토리지 항목을 모두 제거하는 헬퍼 함수
  const clearAuthStorage = () => {
    localStorage.removeItem("jwt_token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_name"); // 회원가입 시 저장되는 이름도 함께 제거
  };

  const [userName, setUserName] = useState(getUserNameFromStorage());

  useEffect(() => {
    setUserName(getUserNameFromStorage());
  }, []);

  // 로그아웃 함수
  const handleLogout = async () => {
    const token = localStorage.getItem("jwt_token");

    // 토큰이 없을 경우
    if (!token) {
      console.error("유효하지 않은 토큰입니다.");
      clearAuthStorage();
      navigate("/login");
      return;
    }

    try {
      const response = await api.post("/auth/logout", { token: token });

      if (response.data.success) {
        console.log("로그아웃 성공:", response.data.message);
      } else {
        // API 응답은 성공(HTTP 200)했으나 로직상 실패한 경우
        console.warn(
          "로그아웃 로직 실패 (API 응답 success: false):",
          response.data.message
        );
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      console.error("유효하지 않은 토큰입니다.", errorMessage);

      if (error.response?.data?.code === "AUTH401") {
        console.warn("유효하지 않은 토큰입니다.");
      }
    } finally {
      // API 성공/실패 여부와 관계없이 클라이언트 측 토큰을 제거하고 일단 로그인 페이지로 이동
      clearAuthStorage();
      navigate("/login");
      closePopup();
    }
  };

  // 탈퇴하기 함수
  const handleWithdraw = async () => {
    const token = localStorage.getItem("jwt_token");
    const userId = localStorage.getItem("user_id");

    if (!token || !userId) {
      console.error("필수 정보(토큰 또는 사용자 ID)가 누락되었습니다.");
      clearAuthStorage();
      navigate("/onboarding");
      return;
    }

    try {
      const response = await api.delete("/auth/delete", {
        data: {
          userId: parseInt(userId), // 명세서대로 int로 변환
          token: token,
        },
      });

      if (response.data.success) {
        // 성공 시
        clearAuthStorage();
        navigate("/onboarding");
      } else {
        // API 응답은 성공(HTTP 200)했으나 로직상 실패한 경우
        console.warn(
          "계정 탈퇴 로직 실패 (API 응답 success: false):",
          response.data.message
        );
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      console.error("API 호출 오류:", errorMessage);

      if (error.response?.data?.code === "MYPROFILE401") {
        console.warn("유효하지 않은 토큰입니다.");
        clearAuthStorage();
        navigate("/onboarding");
      }
    } finally {
      closePopup();
    }
  };

  return (
    <div className="mypage-container">
      <div className="navigationbar">
        <NavigationBar />
      </div>
      <div className="container">
        <div className="nameTitle">{userName}</div>
        <div className="subTitle" onClick={() => navigate("/mypage/edit")}>
          내 정보 수정
        </div>
        <div className="box1" onClick={() => navigate("/mypage/reports")}>
          <div className="boxTitle">내 제보 목록</div>
          <div className="box1-1">
            <div className="boxText">제보 수정 ∙ 삭제하기</div>
            <img src={detailIcon} alt="detailIcon" className="detailIcon1" />
          </div>
        </div>
        <div className="box2" onClick={() => openPopup("logout")}>
          <div className="box1-1">
            <div className="boxText">로그아웃</div>
            <img src={detailIcon} alt="detailIcon" className="detailIcon1" />
          </div>
        </div>
        <div className="box2" onClick={() => openPopup("withdraw")}>
          <div className="box1-1">
            <div className="boxText">탈퇴하기</div>
            <img src={detailIcon} alt="detailIcon" className="detailIcon1" />
          </div>
        </div>
      </div>
      {isPopupOpen && (
        <Popup
          type={popupType}
          onClose={closePopup}
          onConfirm={
            popupType === "logout"
              ? handleLogout
              : popupType === "withdraw"
              ? handleWithdraw
              : null
          }
        />
      )}
    </div>
  );
}

// 공통 팝업
function Popup({ type, onClose, onConfirm }) {
  const content =
    type === "logout"
      ? {
          title: "로그아웃 하시겠습니까?",
          message: "제보 작성 및 관리 기능을 이용할 수 없어요",
          confirmText: "로그아웃",
        }
      : {
          title: "탈퇴 하시겠습니까?",
          message: " 모든 제보 기록이 삭제되며, 복구할 수 없어요",
          confirmText: "탈퇴하기",
        };

  // 확인 버튼 클릭 함수
  const handleConfirmClick = async () => {
    if (onConfirm) {
      await onConfirm();
    } else {
      onClose();
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popupBox">
        <div className="popupTitle">{content.title}</div>
        <div className="popupText">{content.message} </div>
        <div className="buttons">
          <button className="cancelBtn" onClick={onClose}>
            취소
          </button>
          <button className="confirmBtn" onClick={handleConfirmClick}>
            {content.confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default MyPage;
