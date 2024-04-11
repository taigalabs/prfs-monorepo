import React from "react";
import { useMutation } from "@tanstack/react-query";
import { idSessionApi } from "@taigalabs/prfs-api-js";
import { OpenPrfsIdSession2Request } from "@taigalabs/prfs-entities/bindings/OpenPrfsIdSession2Request";
import { PrivateKey } from "@taigalabs/prfs-crypto-js";

export function usePrfsIdSession() {
  const [sessionKey, setSessionKey] = React.useState<string | null>(null);
  const [sk, setSk] = React.useState<PrivateKey | null>(null);

  const { mutateAsync: openPrfsIdSession } = useMutation({
    mutationFn: (req: OpenPrfsIdSession2Request) => {
      return idSessionApi({ type: "open_prfs_id_session2", ...req });
    },
  });

  const [isPrfsDialogOpen, setIsPrfsDialogOpen] = React.useState(false);

  return {
    sessionKey,
    setSessionKey,
    openPrfsIdSession,
    isPrfsDialogOpen,
    setIsPrfsDialogOpen,
    sk,
    setSk,
  };
}

export interface UsePrfsIdSessionArgs {
  // endpoint: string;
}
