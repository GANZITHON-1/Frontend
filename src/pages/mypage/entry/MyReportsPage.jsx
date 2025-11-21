import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../ui/MyPage.css";
import { api } from "../../../api/index";
import useDistance from "../../../hook/useDistance";
import { useGeocoder } from "../../../hook/useGeocoder";
import NavigationBar from "../../../component/NavigationBar/NavigationBar";
import detailIcon from "../../../assets/icons/detail.svg";
import styled from "@emotion/styled";

export function MyReportsPage() {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [userLocation, setUserLocation] = useState({ lat: null, lng: null });
  const distance = useDistance();
  const { addressToCoord } = useGeocoder();

  // 내 위치 가져오기
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setUserLocation({ lat: coords.latitude, lng: coords.longitude });
      },
      () => {
        console.error("위치 정보를 가져오지 못했습니다.");
      }
    );
  }, []);

  // 내 제보 목록 함수
  useEffect(() => {
    const fetchReports = async () => {
      const userId = localStorage.getItem("user_id");

      if (!userId) return;

      try {
        const res = await api.get("/mypage/reports", {
          params: { userId: Number(userId) },
        });

        console.log("내 제보 응답:", res);
        const list = res.data.data || [];

        const withDistance = await Promise.all(
          list.map(async (r) => {
            try {
              const coord = await addressToCoord(r.location);
              const meters = distance(
                {
                  lat: userLocation.lat,
                  lng: userLocation.lng,
                },
                {
                  lat: Number(coord.y),
                  lng: Number(coord.x),
                }
              );

              return {
                ...r,
                distance: Math.round(meters), // 거리 추가
              };
            } catch (err) {
              console.error("주소 변환 실패:", err);
              return { ...r, distance: null };
            }
          })
        );

        setReports(withDistance);
      } catch (err) {
        console.error("API 오류:", err);
        setReports([]);
      }
    };

    if (userLocation.lat) fetchReports();
  }, [userLocation.lat]);

  return (
    <div className="mypage-container">
      <div className="navigationbar">
        <NavigationBar title="내 제보 목록" />
      </div>
      <div className="container">
        {reports.length > 0 &&
          reports.map((report) => (
            <div
              key={report.reportId}
              className="reportBox"
              onClick={() => navigate(`/report-edit/${report.reportId}`)}
            >
              <div>
                <div className="reportTitle">{report.title}</div>
                <div className="reportSubText">
                  {report.distance}m • {report.location}
                </div>
              </div>
              <img src={detailIcon} alt="detailIcon" className="detailIcon1" />
            </div>
          ))}
      </div>
    </div>
  );
}

export default MyReportsPage;
