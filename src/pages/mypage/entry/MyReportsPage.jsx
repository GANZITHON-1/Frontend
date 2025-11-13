import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../ui/MyPage.css";
import NavigationBar from "../../../component/NavigationBar/NavigationBar";
import detailIcon from "../../../assets/icons/detail.svg";

export function MyReportsPage() {
  return (
    <div className="mypage-container">
      <div className="navigationbar">
        <NavigationBar title="내 제보 목록" />
      </div>
      <div className="container">
        <div className="reportBox">
          <div>
            <div className="reportTitle">싱크홀이 발생하기 직전이에요</div>
            <div className="reportSubText">209m • 경기도 성남시 은행동 568</div>
          </div>
          <img src={detailIcon} alt="detailIcon" className="detailIcon1" />
        </div>
        <div className="reportBox">
          <div>
            <div className="reportTitle">싱크홀이 발생하기 직전이에요</div>
            <div className="reportSubText">209m • 경기도 성남시 은행동 568</div>
          </div>
          <img src={detailIcon} alt="detailIcon" className="detailIcon1" />
        </div>
        <div className="reportBox">
          <div>
            <div className="reportTitle">싱크홀이 발생하기 직전이에요</div>
            <div className="reportSubText">209m • 경기도 성남시 은행동 568</div>
          </div>
          <img src={detailIcon} alt="detailIcon" className="detailIcon1" />
        </div>
        <div className="reportBox">
          <div>
            <div className="reportTitle">싱크홀이 발생하기 직전이에요</div>
            <div className="reportSubText">209m • 경기도 성남시 은행동 568</div>
          </div>
          <img src={detailIcon} alt="detailIcon" className="detailIcon1" />
        </div>
        <div className="reportBox">
          <div>
            <div className="reportTitle">싱크홀이 발생하기 직전이에요</div>
            <div className="reportSubText">209m • 경기도 성남시 은행동 568</div>
          </div>
          <img src={detailIcon} alt="detailIcon" className="detailIcon1" />
        </div>
        <div className="reportBox">
          <div>
            <div className="reportTitle">싱크홀이 발생하기 직전이에요</div>
            <div className="reportSubText">209m • 경기도 성남시 은행동 568</div>
          </div>
          <img src={detailIcon} alt="detailIcon" className="detailIcon1" />
        </div>
      </div>
    </div>
  );
}

export default MyReportsPage;
