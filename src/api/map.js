import axios from "axios";

/**
 * 필터에 따른 데이터 조회 API
 * @param {*} data 파라미터 값
 * @param {list} data.filters 필터 리스트
 * @param {number} data.lat 위도
 * @param {number} data.lng 경도
 * @returns
 */
export const apiGetDataByFilter = async (data) => {
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/map/markers`, {
      withCredentials: true,
      params: data, // GET 요청에서 데이터 전달
    });
    if (res.data.success === true) {
      return res.data.data;
    } else if (res.data.success === false) {
      alert(res.data.message || "데이터 검색 오류");
      return [];
    }
    return false;
  } catch (err) {
    alert(err.response?.data?.message || "데이터 검색 오류");
    return false;
  }
};
