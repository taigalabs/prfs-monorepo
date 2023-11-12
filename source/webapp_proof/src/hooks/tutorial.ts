import { useSearchParams } from "next/navigation";
import React from "react";

export function useIsTutorial() {
  const searchParams = useSearchParams();

  const isTutorial = React.useMemo(() => {
    if (searchParams.get("tutorial_id")) {
      return true;
    }
    return false;
  }, [searchParams]);

  return isTutorial;
}
