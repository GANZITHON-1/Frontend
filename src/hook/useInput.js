import { useCallback, useState } from "react";

/**
 *
 * @param {*} initalValue 기본 값
 * @returns [value, handler, setValue]
 */
export const useInput = (initalValue = null) => {
  const [value, setValue] = useState(initalValue);

  const handler = useCallback((e) => {
    setValue(e.target.value);
  }, []);

  return [value, handler, setValue];
};
