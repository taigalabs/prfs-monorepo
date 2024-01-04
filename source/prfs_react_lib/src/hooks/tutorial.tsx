import React from "react";
import { useSearchParams } from "next/navigation";

export function useIsTutorial() {
  const searchParams = useSearchParams();
  const tutorialId = React.useMemo(() => {
    return searchParams.get("tutorial_id");
  }, [searchParams]);

  return { tutorialId };
}
