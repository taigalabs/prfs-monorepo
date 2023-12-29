export type EventSubscriber<V> = (ev: V) => void;

export default function emit<V>(subscribers: EventSubscriber<V>[], ev: V) {
  for (const scb of subscribers) {
    scb(ev);
  }
}
