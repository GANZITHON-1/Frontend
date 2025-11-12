import { useCallback } from "react";

const EARTH_RADIUS_M = 6371000; // 지구 반지름(미터)

const toRadians = (degree) => (degree * Math.PI) / 180;

/**
 * 두 GeoPoint 사이의 직선 거리를 계산한다.
 * 예시
 * const distance = useDistance();
 * const meters = distance({ lat: 37.5, lng: 127.0 }, { lat: 37.6, lng: 127.1 });
 * @typedef {Object} GeoPoint
 * @property {number} lat 위도
 * @property {number} lng 경도
 * @returns {(from: GeoPoint, to: GeoPoint) => number}
 */
const useDistance = () => {
  const getDistance = useCallback((from, to) => {
    if (!from || !to) {
      return 0;
    }

    const hasKakaoGeometry = Boolean(window?.kakao?.maps?.geometry);

    if (hasKakaoGeometry) {
      const fromLatLng = new window.kakao.maps.LatLng(from.lat, from.lng);
      const toLatLng = new window.kakao.maps.LatLng(to.lat, to.lng);
      return window.kakao.maps.geometry.distance(fromLatLng, toLatLng);
    }

    const dLat = toRadians(to.lat - from.lat);
    const dLng = toRadians(to.lng - from.lng);
    const lat1 = toRadians(from.lat);
    const lat2 = toRadians(to.lat);

    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return EARTH_RADIUS_M * c;
  }, []);

  return getDistance;
};

export default useDistance;
