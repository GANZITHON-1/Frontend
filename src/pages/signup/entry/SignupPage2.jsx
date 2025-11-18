import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../ui/SignupPage.css";
import NavigationBar from "../../../component/NavigationBar/NavigationBar";
import eyeclose from "../../../assets/icons/eyeclose.svg";
import eyeopen from "../../../assets/icons/eyeopen.svg";

export function SignupPage2() {
  const navigate = useNavigate();
  const location = useLocation();
  const [pw1, setPw1] = useState("");
  const [pw2, setPw2] = useState("");
  const [pw1Error, setPw1Error] = useState("");
  const [pw2Error, setPw2Error] = useState("");

  // 이전 페이지에서 전달받은 데이터
  const { name, email, nickname } = location.state || {};

  // 두 입력값이 모두 있을 때만 버튼 활성화
  const isActive = pw1.trim() !== "" && pw2.trim() !== "";

  // 비밀번호 형식 검사(영문, 숫자, 특수문자가 모두 포함된 8~16자)
  const isPasswordValid = (password) => {
    const regex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+]).{8,16}$/;
    return regex.test(password);
  };

  const goNext = () => {
    setPw1Error("");
    setPw2Error("");

    let isValid = true;
    const pw1ErrorMsg = "영문, 숫자, 특수문자가 모두 들어간 8-16자";
    const pw2ErrorMsg = "비밀번호와 비밀번호 확인이 일치하지 않아요.";

    // 비밀번호(pw1) 검사
    if (pw1.trim() === "") {
      setPw1Error(pw1ErrorMsg);
      isValid = false;
    } else if (!isPasswordValid(pw1)) {
      setPw1Error(pw1ErrorMsg);
      isValid = false;
    }

    // 비밀번호(pw2) 검사
    if (pw2.trim() === "") {
      setPw2Error(pw2ErrorMsg);
      isValid = false;
    } else if (pw1 !== pw2) {
      setPw2Error(pw2ErrorMsg);
      isValid = false;
    }

    if (!isValid) return;

    navigate("/signup3", {
      state: {
        name: name,
        email: email,
        nickname: nickname,
        password: pw1,
        passwordConfirm: pw2,
      },
    });
  };

  // 비밀번호 보이기/숨기기 상태
  const [showPw1, setShowPw1] = useState(false);
  const [showPw2, setShowPw2] = useState(false);

  // 비밀번호 보이기/숨기기 토글
  const togglePw1 = () => setShowPw1((prev) => !prev);
  const togglePw2 = () => setShowPw2((prev) => !prev);

  const inputType1 = showPw1 ? "text" : "password";
  const inputType2 = showPw2 ? "text" : "password";

  return (
    <div className="signup-container">
      <div className="navigationbar">
        <NavigationBar />
      </div>
      <div className="container">
        <div className="title">
          로그인에 사용할
          <br /> 비밀번호를 입력해 주세요
        </div>
        <div className="inputBox">
          <div className="inputTitle">비밀번호</div>
          <input
            type={showPw1 ? "text" : "password"}
            className={`custom-input ${pw1.trim() !== "" ? "active" : ""} ${
              pw1Error ? "error" : ""
            }`}
            placeholder="영문, 숫자, 특수문자가 모두 들어간 8-16자"
            value={pw1}
            onChange={(e) => setPw1(e.target.value)}
          ></input>
          <button type="button" className="eyeIcon1" onClick={togglePw1}>
            <img src={showPw1 ? eyeopen : eyeclose} />
          </button>
          <div
            className="errorText"
            style={{ display: pw1Error ? "block" : "none" }}
          >
            {pw1Error}
          </div>
          <div className="input-wrapper">
            <input
              type={showPw2 ? "text" : "password"}
              className={`custom-input ${pw2.trim() !== "" ? "active" : ""} ${
                pw2Error ? "error" : ""
              }`}
              placeholder="한번 더 입력해 주세요."
              value={pw2}
              onChange={(e) => setPw2(e.target.value)}
            ></input>
            <button type="button" className="eyeIcon2-2" onClick={togglePw2}>
              <img src={showPw2 ? eyeopen : eyeclose} />
            </button>
          </div>
          <div
            className="errorText"
            style={{ display: pw2Error ? "block" : "none" }}
          >
            {pw2Error}
          </div>
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

export default SignupPage2;
