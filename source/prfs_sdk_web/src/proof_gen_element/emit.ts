import { ProofGenElementSubscriber, ProofGenEvent } from "./types";

export default function emit(subscribers: ProofGenElementSubscriber[], ev: ProofGenEvent) {
  for (const scb of subscribers) {
    scb(ev);
  }
}
