import { useMutation } from "@tanstack/react-query";
import { idSessionApi } from "@taigalabs/prfs-api-js";
import { OpenPrfsIdSession2Request } from "@taigalabs/prfs-entities/bindings/OpenPrfsIdSession2Request";

export function useOpenPrfsIdSession() {
  return useMutation({
    mutationFn: (req: OpenPrfsIdSession2Request) => {
      return idSessionApi({ type: "open_prfs_id_session2", ...req });
    },
  });
}
