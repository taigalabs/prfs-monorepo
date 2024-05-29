import React from "react";

export function useAppTableBodyHeight(innerRef: React.MutableRefObject<HTMLDivElement | null>) {
  if (innerRef.current) {
    return {
      bodyHeight: innerRef.current.clientHeight,
    };
  } else {
    return {
      bodyHeight: 500,
    };
  }
}
