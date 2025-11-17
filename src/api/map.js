import { api } from "./index";

/**
 * 필터에 따른 데이터 조회 API
 * @param {*} data 파라미터 값
 * @param {list} data.filters 필터 리스트
 * @param {number} data.lat 위도
 * @param {number} data.lng 경도
 * @returns
 */
export const apiGetMapPageDataByFilter = async (data) => {
  try {
    const res = await api.get("/map/markers", {
      params: data,
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

export const apiGetMapPagePublicData = async (markerId) => {
  try {
    const res = await api.get(`/map/markers/public/${markerId}`);
    if (res.data.success === true) {
      return res.data.data;
    } else if (res.data.success === false) {
      alert(res.data.message || "데이터 검색 오류");
      return {};
    }
    return {};
  } catch (err) {
    alert(err.response?.data?.message || "데이터 검색 오류");
    return {};
  }
};

export const apiGetMapPageUserData = async (markerId) => {
  try {
    const res = await api.get(`/report/${markerId}`);
    if (res.data.success === true) {
      return res.data.data;
    } else if (res.data.success === false) {
      alert(res.data.message || "데이터 검색 오류");
      return {};
    }
    return {};
  } catch (err) {
    alert(err.response?.data?.message || "데이터 검색 오류");
    return {};
  }
};
