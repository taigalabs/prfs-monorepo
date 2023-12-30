export class MessageQueue {
  q: Record<string, string> = {};

  push(key: string, postMessage: (msg: any) => void) {
    console.log("queue push");
  }

  dequeue(key: string) {
    this.q[key];
  }
}
