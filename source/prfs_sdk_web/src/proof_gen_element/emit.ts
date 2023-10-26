import { ProofGenElementSubscriber, SubscribedMsg } from "./types";

export default function emit(subscribers: ProofGenElementSubscriber[], msg: SubscribedMsg) {
  for (const scb of subscribers) {
    scb(msg);
  }
}
