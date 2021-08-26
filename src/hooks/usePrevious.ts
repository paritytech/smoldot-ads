import { useRef, useEffect } from "react";

const usePrevious = (value: string | undefined) => {
  const ref = useRef<string | undefined>();
  
  useEffect(() => {
    ref.current = value;
  }, [value]);
  
  return ref.current;
}

export default usePrevious;
