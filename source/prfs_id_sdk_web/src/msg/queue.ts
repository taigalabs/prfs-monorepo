export class MessageQueue {
  q: Record<string, PostMessageFn> = {};
  count = 0;

  push(key: string, postMessage: (msg: any) => void) {
    console.log("queue push, key: %s", key);
    this.q[key] = postMessage;
    this.count += 1;
  }

  dequeue(key: string) {
    const postMessage = this.q[key];

    if (postMessage) {
      delete this.q[key];
      this.count -= 1;
      return postMessage;
    } else {
      return null;
    }
  }
}

export type PostMessageFn = (msg: any) => void;
