import axios from "axios";

/**
 * 공용 axios 인스턴스 및 JWT 자동 포함 기능
 *
 * 사용법:
 * 1. JWT 토큰은 localStorage에 "jwt_token" 키로 저장되어 있어야 합니다.
 * 2. api 인스턴스를 import하여 axios 대신 사용하세요.
 *    예시:
 *      import { api } from "./api";
 *      // GET 요청에서 파라미터 전달
 *      api.get("/user/profile", { params: { id: 1 } })
 *      // POST 요청에서 body 데이터 전달
 *      api.post("/user/profile", { name: "홍길동" })
 * 3. 모든 요청에 JWT가 자동으로 Authorization 헤더에 포함됩니다.
 * 4. baseURL은 .env의 VITE_API_URL을 따릅니다.
 * 5. CORS 환경에서 자동으로 withCredentials가 적용되어 쿠키 기반 인증도 지원됩니다.
 */

// JWT 토큰을 localStorage에서 가져오는 함수
function getJwtToken() {
  return localStorage.getItem("jwt_token");
}

// 리프레시 토큰을 localStorage에서 가져오는 함수
function getRefreshToken() {
  return localStorage.getItem("refresh_token");
}

// 공용 axios 인스턴스 생성
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // 백엔드 API 주소
  withCredentials: true, // CORS 환경에서 쿠키 자동 포함
  headers: {
    "Content-Type": "application/json", // 기본 JSON 전송
    Accept: "application/json",
  },
});

// 요청 시 JWT 토큰 자동 포함 인터셉터
api.interceptors.request.use(
  (config) => {
    const token = getJwtToken();
    const refreshToken = getRefreshToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    if (refreshToken) {
      config.headers["x-refresh-token"] = refreshToken;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
