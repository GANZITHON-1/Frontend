import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../ui/MyPage.css";
import NavigationBar from "../../../component/NavigationBar/NavigationBar";
import detailIcon from "../../../assets/icons/detail.svg";
import toastIcon from "../../../assets/icons/toast-check.svg";

export function EditPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [toastMessage, setToastMessage] = useState("");

  // EditNamePage에서 전달된 toast 메시지 확인
  useEffect(() => {
    if (location.state?.toast) {
      setToastMessage(location.state.toast);

      // 3초 후 토스트 사라지게(임시로 해놓음)
      const timer = setTimeout(() => {
        setToastMessage("");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [location.state]);

  return (
    <div className="mypage-container">
      <div className="navigationbar">
        <NavigationBar title="내 정보 수정" />
      </div>
      <div className="container">
        <div
          className="editBox"
          onClick={() => navigate("/mypage/edit/name", { replace: true })}
        >
          <div className="box1-1">
            <div className="editTitle">이름</div>
            <div className="editSubText">마라탕</div>
            <img src={detailIcon} alt="detailIcon" className="detailIcon1" />
          </div>
        </div>
        <div
          className="editBox"
          onClick={() => navigate("/mypage/edit/email", { replace: true })}
        >
          <div className="box1-1">
            <div className="editTitle">이메일 주소</div>
            <div className="editSubText">tmxhdjf@naver.com</div>
            <img src={detailIcon} alt="detailIcon" className="detailIcon1" />
          </div>
        </div>
      </div>
      {toastMessage && (
        <div className="toast">
          <img src={toastIcon} alt="toastIcon" className="toastIcon" />
          {toastMessage}
        </div>
      )}
    </div>
  );
}

export default EditPage;
