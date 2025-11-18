import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../ui/SignupPage.css";
import NavigationBar from "../../../component/NavigationBar/NavigationBar";

export function SignupPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // 이름이 입력되어야 이메일 필드 넘어감
  const isNameFilled = name.trim() !== "";

  //이메일 한번이라도 나타났으면 이름 인풋 없어지지 않게!!
  const [isEmailVisible, setIsEmailVisible] = useState(false);

  // 두 입력값이 모두 있을 때만 버튼 활성화
  const isActive = isNameFilled && email.trim() !== "";

  const handleNameChange = (e) => {
    const newName = e.target.value;
    setName(newName);

    //이름 채워지는 순간 이메일 필드는 고정
    if (newName.trim() !== "" && !isEmailVisible) {
      setIsEmailVisible(true);
    }
  };

  // 이름이 채워졌거나, 이미 필드가 나타난 적이 있다면 유지
  const renderEmail = isNameFilled || isEmailVisible;

  const goNext = () => {
    if (isActive) {
      navigate("/signup1", {
        state: {
          name: name,
          email: email,
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
          가입을 위해
          <br /> 정보를 입력해 주세요
        </div>
        <div className="inputBox">
          <div className="inputTitle">이름</div>
          <input
            className={`custom-input ${name.trim() !== "" ? "active" : ""}`}
            placeholder="홍길동"
            value={name}
            onChange={handleNameChange}
          ></input>
        </div>
        {renderEmail && (
          <div className="inputBox">
            <div className="inputTitle">이메일</div>
            <input
              className={`custom-input ${email.trim() !== "" ? "active" : ""}`}
              placeholder="abcde@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></input>
          </div>
        )}
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

export default SignupPage;
