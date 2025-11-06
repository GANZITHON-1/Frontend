import { useMediaQuery } from "react-responsive";

/**
 * 사용자의 해상도를 감지하여 리턴함
 * @returns isPc, isMobile 각 T/F로 반환
 */
export const useMedia = () => {
  const isPc = useMediaQuery({
    query: "(min-width:1025px)",
  });

  const isMobile = useMediaQuery({
    query: "(max-width:1024px)",
  });

  return { isPc, isMobile };
};
