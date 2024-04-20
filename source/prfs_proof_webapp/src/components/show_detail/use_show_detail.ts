import React from "react";

export function useShowDetail() {
  const [showDetail, setShowDetail] = React.useState(false);

  return {
    showDetail,
    setShowDetail,
  };
}
