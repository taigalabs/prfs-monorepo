import React from "react";

export function useInterval(callback: Function, delay: number | null) {
  const savedCallback = React.useRef<Function>(callback);

  React.useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  React.useEffect(() => {
    function tick() {
      savedCallback.current();
    }

    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

export function delay(duration: number) {
  return new Promise((resolve, _) => {
    setTimeout(() => {
      resolve(0);
    }, duration);
  });
}
