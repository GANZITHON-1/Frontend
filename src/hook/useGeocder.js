import { useRef } from "react";

/**
 * 카카오맵 Geocoder를 활용한 주소 <-> 좌표 변환 커스텀 훅이다.
 *
 * 사용 예시:
 * const { addressToCoord, coordToAddress } = useGeocder();
 *
 * // 주소를 좌표로 변환
 * addressToCoord("서울특별시 중구 세종대로 110").then(console.log);
 *
 * // 좌표를 주소로 변환
 * coordToAddress(37.5665, 126.9780).then(console.log);
 */
export const useGeocder = () => {
  const geocoderRef = useRef(null);

  if (!geocoderRef.current && window.kakao && window.kakao.maps) {
    geocoderRef.current = new window.kakao.maps.services.Geocoder();
  }

  /**
   * 주소를 좌표로 변환한다.
   * @param {string} address - 변환할 주소이다.
   * @returns {Promise<object>} 변환된 좌표 정보이다.
   */
  const addressToCoord = (address) =>
    new Promise((resolve, reject) => {
      geocoderRef.current.addressSearch(address, (result, status) => {
        if (status === window.kakao.maps.services.Status.OK) {
          resolve(result[0]);
        } else {
          reject(status);
        }
      });
    });

  /**
   * 좌표를 주소로 변환한다.
   * @param {number} lat - 위도이다.
   * @param {number} lon - 경도이다.
   * @returns {Promise<object>} 변환된 주소 정보이다.
   */
  const coordToAddress = (lat, lon) =>
    new Promise((resolve, reject) => {
      geocoderRef.current.coord2Address(lon, lat, (result, status) => {
        if (status === window.kakao.maps.services.Status.OK) {
          resolve(result[0]);
        } else {
          reject(status);
        }
      });
    });

  return { addressToCoord, coordToAddress };
};
