import React from "react";
import { useMutation } from "@tanstack/react-query";
import { idSessionApi } from "@taigalabs/prfs-api-js";
import { OpenPrfsIdSession2Request } from "@taigalabs/prfs-entities/bindings/OpenPrfsIdSession2Request";

export function usePrfsIdSession() {
  const [sessionKey, setSessionKey] = React.useState<string | null>(null);

  const { mutateAsync: openPrfsIdSession } = useMutation({
    mutationFn: (req: OpenPrfsIdSession2Request) => {
      return idSessionApi({ type: "open_prfs_id_session2", ...req });
    },
  });

  const [isPrfsDialogOpen, setIsPrfsDialogOpen] = React.useState(false);

  // const popup = openPopup(endpoint);
  // if (!popup) {
  //   console.error("Popup couldn't be open");
  //   return;
  // }
  // const { payload } = await openPrfsIdSession({
  //   key: proofGenArgs.session_key,
  //   value: null,
  //   ticket: "TICKET",
  // });
  return {
    sessionKey,
    setSessionKey,
    openPrfsIdSession,
    isPrfsDialogOpen,
    setIsPrfsDialogOpen,
  };
}

export interface UsePrfsIdSessionArgs {
  // endpoint: string;
}
