import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import searchIcon from "../../assets/icons/search.svg";
import micIcon from "../../assets/icons/mic.svg";
import "../../pages/report-search/ui/ReportSearchPage.css";

export default function SearchBar({ setPlaces }) {
  const [query, setQuery] = useState("");

  // 1) 검색 함수는 useCallback으로 메모이즈
  const searchPlaces = useCallback(
    async (keyword, signal) => {
      if (!keyword?.trim()) {
        setPlaces([]);
        return;
      }

      try {
        const res = await axios.get(
          "https://dapi.kakao.com/v2/local/search/keyword.json",
          {
            params: { query: keyword, size: 10 },
            headers: {
              Authorization: `KakaoAK ${
                import.meta.env.VITE_KAKAO_REST_API_KEY
              }`,
            },
            signal, // AbortController로 취소 가능
          }
        );
        setPlaces(res.data.documents || []);
      } catch (err) {
        // 요청이 취소된 경우는 무시
        if (axios.isCancel?.(err) || err?.name === "CanceledError") return;
        console.error("검색 실패:", err);
      }
    },
    [setPlaces]
  );

  // 2) 디바운스 + 최신 요청만 유효(AbortController)
  useEffect(() => {
    const controller = new AbortController();

    const timer = setTimeout(() => {
      searchPlaces(query, controller.signal);
    }, 400); // 디바운스 400ms

    return () => {
      clearTimeout(timer);
      controller.abort(); // 이전 요청 취소
    };
  }, [query, searchPlaces]);

  return (
    <div className="search-bar">
      <div className="search-box">
        <img src={searchIcon} alt="검색" className="search-icon" />
        <input
          type="text"
          placeholder="검색어를 입력하세요"
          className="search-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <img src={micIcon} alt="음성검색" className="mic-icon" />
      </div>
    </div>
  );
}
