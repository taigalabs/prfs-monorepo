export class MessageQueue {
  push(key: string, postMessage: (msg: any) => void) {
    console.log("queue push");
  }
}
