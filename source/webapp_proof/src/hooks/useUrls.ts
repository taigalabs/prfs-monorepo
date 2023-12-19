import React from "react";

import { paths } from "@/paths";

export function useUrls() {
  const ret = React.useMemo(() => {
    return {
      tutorialUrl: `${process.env.NEXT_PUBLIC_WEBAPP_PROOF_ENDPOINT}?tutorial_id=simple_hash`,
      accVerrificationUrl: `${process.env.NEXT_PUBLIC_WEBAPP_PROOF_ENDPOINT}${paths.account_verification}`,
    };
  }, []);

  return ret;
}
