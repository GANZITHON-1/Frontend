import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../ui/MyPage.css";
import NavigationBar from "../../../component/NavigationBar/NavigationBar";
import detailIcon from "../../../assets/icons/detail.svg";
import toastIcon from "../../../assets/icons/toast-check.svg";

// 프로필 데이터 로컬스토리지에서 가져오는 함수
const getProfileData = () => {
  const name = localStorage.getItem("user_name") || "사용자 이름"; // 없으면 기본값
  const email = localStorage.getItem("user_email") || "user@salpyeo.com";
  return { name, email };
};

export function EditPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [toastMessage, setToastMessage] = useState("");
  const [profile, setProfile] = useState(getProfileData());

  // 컴포넌트 마운트 시 프로필 데이터를 새로고침...
  useEffect(() => {
    setProfile(getProfileData());
  }, []);

  // EditNamePage에서 전달된 toast 메시지 확인
  useEffect(() => {
    if (location.state?.toast) {
      setToastMessage(location.state.toast);

      // 3초 후 토스트 사라지게(임시로 해놓음)
      const timer = setTimeout(() => {
        setToastMessage("");
        // 토스트 메시지를 표시한 후 state를 지워 다음 방문 시 다시 표시되지 않게...
        navigate(location.pathname, { replace: true, state: {} });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [location.state, location.pathname, navigate]);

  return (
    <div className="mypage-container">
      <div className="navigationbar">
        <NavigationBar title="내 정보 수정" />
      </div>
      <div className="container">
        <div
          className="editBox"
          onClick={() =>
            navigate("/mypage/edit/name", {
              replace: true,
              state: { currentName: profile.name, currentEmail: profile.email }, // 현재 이름과 이메일 전달
            })
          }
        >
          <div className="box1-1">
            <div className="editTitle">이름</div>
            <div className="editSubText">{profile.name}</div>
            <img src={detailIcon} alt="detailIcon" className="detailIcon1" />
          </div>
        </div>
        <div
          className="editBox"
          onClick={() =>
            navigate("/mypage/edit/email", {
              replace: true,
              state: { currentName: profile.name, currentEmail: profile.email }, // 현재 이름과 이메일 전달
            })
          }
        >
          <div className="box1-1">
            <div className="editTitle">이메일 주소</div>
            <div className="editSubText">{profile.email}</div>
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
