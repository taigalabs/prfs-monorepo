import { useQuery } from "@taigalabs/prfs-react-lib/react_query";
import { shyApi2 } from "@taigalabs/shy-api-js";

export function useShyChannel(channelId: string) {
  return useQuery({
    queryKey: ["get_shy_channel"],
    queryFn: async () => {
      return shyApi2({ type: "get_shy_channel", channel_id: channelId });
    },
  });
}
