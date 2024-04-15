import { useMutation } from "@taigalabs/prfs-react-lib/react_query";
import { shyApi2 } from "@taigalabs/shy-api-js";
import { JoinShyChannelRequest } from "@taigalabs/shy-entities/bindings/JoinShyChannelRequest";

export function useJoinShyChannel() {
  return useMutation({
    mutationFn: (req: JoinShyChannelRequest) => {
      return shyApi2({ type: "join_shy_channel", ...req });
    },
  });
}
