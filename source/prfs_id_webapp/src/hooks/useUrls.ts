import React from "react";

import { paths } from "@/paths";
import { envs } from "@/envs";

export function useUrls() {
  const ret = React.useMemo(() => {
    return {
      attestationsUrl: `${envs.NEXT_PUBLIC_PRFS_PROOF_WEBAPP_ENDPOINT}${paths.attestations}`,
    };
  }, []);

  return ret;
}
