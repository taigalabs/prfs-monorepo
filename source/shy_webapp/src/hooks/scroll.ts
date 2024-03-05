import React from "react";

export function useHandleScroll(
  parentRef: React.MutableRefObject<HTMLDivElement | null>,
  rightBarContainerRef: React.MutableRefObject<HTMLDivElement | null>,
) {
  return React.useCallback(() => {
    if (parentRef.current && rightBarContainerRef.current) {
      const { scrollTop, clientHeight } = parentRef.current;
      const { scrollHeight: sh, scrollTop: st, clientHeight: ch } = rightBarContainerRef.current!;

      if (ch < clientHeight) {
        rightBarContainerRef.current!.style.top = `0px`;
      } else {
        const delta = clientHeight + scrollTop - ch;
        if (delta >= 0) {
          rightBarContainerRef.current.style.transform = `translateY(${delta}px)`;
        } else {
          rightBarContainerRef.current!.style.transform = "translateY(0px)";
        }
      }
    }
  }, [parentRef.current, rightBarContainerRef.current]);
}
