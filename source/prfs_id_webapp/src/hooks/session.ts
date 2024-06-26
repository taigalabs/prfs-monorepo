import { idSessionApi } from "@taigalabs/prfs-api-js";
import { PutPrfsIdSessionValueRequest } from "@taigalabs/prfs-entities/bindings/PutPrfsIdSessionValueRequest";
import { useMutation } from "@taigalabs/prfs-react-lib/react_query";

export function usePutSessionValue() {
  return useMutation({
    mutationFn: (req: PutPrfsIdSessionValueRequest) => {
      return idSessionApi({
        type: "put_prfs_id_session_value",
        ...req,
      });
    },
  });
}
