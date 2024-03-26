import React from "react";

import { paths } from "@/paths";

export function useUrls() {
  const ret = React.useMemo(() => {
    return {
      attestationsUrl: `${process.env.NEXT_PUBLIC_WEBAPP_PROOF_ENDPOINT}${paths.attestations}`,
    };
  }, []);

  return ret;
}
