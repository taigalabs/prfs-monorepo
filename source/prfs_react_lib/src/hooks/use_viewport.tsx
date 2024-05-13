import React from "react";

export function useViewport() {
  const [viewport, setViewport] = React.useState<Viewport | null>(null);
  React.useLayoutEffect(() => {
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);

    setViewport({ vw, vh });
  }, [setViewport]);

  return viewport;
}

export interface Viewport {
  vw: number;
  vh: number;
}
