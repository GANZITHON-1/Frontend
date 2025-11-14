import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "../ui/OnboardingPage.css";
import background1 from "../../../assets/images/onboard2.png";
import iconsImage from "../../../assets/images/onboard1.svg";
import background2 from "../../../assets/images/onboard3.png";
import background3 from "../../../assets/images/onboard4.png";

export function OnboardingPage() {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);

  const slides = [
    {
      id: 1,
      bgImage: background1,
      iconImage: iconsImage,
      title: (
        <>
          지도에서
          <br />
          동네의 정보를 볼 수 있어요
        </>
      ),
      subtitle: (
        <>
          클릭하면 위험 요소와
          <br />
          제보 내용을 바로 확인할 수 있어요.
        </>
      ),
      hasIcons: true,
    },
    {
      id: 2,
      bgImage: background2,
      iconImage: null,
      title: (
        <>
          제보하기로
          <br />더 나은 동네를 만들어 가요
        </>
      ),
      subtitle: (
        <>
          제보를 통해 지역 안전 정보를 공유하며
          <br />더 안전하게 만들 수 있어요.
        </>
      ),
      hasIcons: false,
    },
    {
      id: 3,
      bgImage: background3,
      iconImage: null,
      title: (
        <>
          공공데이터
          <br />
          기반의 정보를 제공해요
        </>
      ),
      subtitle: (
        <>
          CCTV, 사고, 민원 등
          <br />
          객관적이고 신뢰 가능한 데이터를 종합했어요.
        </>
      ),
      hasIcons: false,
    },
  ];

  return (
    <div className="onboarding-container">
      <Swiper
        modules={[Pagination]}
        pagination={true}
        spaceBetween={30}
        slidesPerView={1}
        onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
        className="onboarding-swiper"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div
              className={`slide ${
                slide.id === 1
                  ? "zoom-1"
                  : slide.id === 2
                  ? "zoom-2"
                  : slide.id === 3
                  ? "zoom-3"
                  : ""
              }`}
            >
              <div className="background">
                <img src={slide.bgImage} alt={`bg-${slide.id}`} />
                {slide.hasIcons && (
                  <div className="iconsImage">
                    <img src={slide.iconImage} alt={`icons-${slide.id}`} />
                  </div>
                )}
              </div>
              <div className="box">
                <div className="boldText">{slide.title}</div>
                <div className="subText">{slide.subtitle}</div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="buttonBox">
        <button className="signupBtn" onClick={() => navigate("/signup")}>
          회원가입
        </button>
        <button className="loginBtn" onClick={() => navigate("/login")}>
          로그인
        </button>
      </div>
    </div>
  );
}

export default OnboardingPage;
