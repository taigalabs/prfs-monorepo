export class MessageQueue {
  q: Record<string, MessagePort> = {};
  count = 0;

  push(key: string, port: MessagePort) {
    console.log("queue push, key: %s", key);
    this.q[key] = port;
    this.count += 1;
  }

  dequeue(key: string) {
    const port = this.q[key];

    if (port) {
      delete this.q[key];
      this.count -= 1;
      return port;
    } else {
      return null;
    }
  }
}

// export type PostMessageFn = (msg: any) => void;
