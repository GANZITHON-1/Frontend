import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../ui/MyPage.css";
import NavigationBar from "../../../component/NavigationBar/NavigationBar";
import detailIcon from "../../../assets/icons/detail.svg";

export function MyPage() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupType, setPopupType] = useState(""); //로그아웃 or 탈퇴하기 여부

  const openPopup = (type) => {
    setPopupType(type);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <div className="mypage-container">
      <div className="navigationbar">
        <NavigationBar />
      </div>
      <div className="container">
        <div className="nameTitle">마라탕</div>
        <div className="subTitle">내 정보 수정</div>
        <div className="box1">
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
      {isPopupOpen && <Popup type={popupType} onClose={closePopup} />}
    </div>
  );
}

// 공통 팝업
function Popup({ type, onClose }) {
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

  return (
    <div className="popup-overlay">
      <div className="popupBox">
        <div className="popupTitle">{content.title}</div>
        <div className="popupText">{content.message} </div>
        <div className="buttons">
          <button className="cancelBtn" onClick={onClose}>
            취소
          </button>
          <button className="confirmBtn">{content.confirmText}</button>
        </div>
      </div>
    </div>
  );
}

export default MyPage;
