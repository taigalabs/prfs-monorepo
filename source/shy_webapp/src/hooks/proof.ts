import { useMutation } from "@taigalabs/prfs-react-lib/react_query";
import { shyApi2 } from "@taigalabs/shy-api-js";
import { GetShyProofsRequest } from "@taigalabs/shy-entities/bindings/GetShyProofsRequest";

export function useGetShyProofs() {
  return useMutation({
    mutationFn: (req: GetShyProofsRequest) => {
      return shyApi2({ type: "get_shy_proofs", ...req });
    },
  });
}
