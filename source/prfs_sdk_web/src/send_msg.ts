import { MsgInterface } from "./msg";

export async function sendMsgToChild(msg: MsgInterface<any>, iframe: HTMLIFrameElement) {
  return new Promise((res, rej) => {
    const channel = new MessageChannel();
    channel.port1.onmessage = ({ data }: { data: MsgInterface<any> }) => {
      channel.port1.close();
      if (data.error) {
        rej(data.error);
      } else {
        res(data.payload);
      }
    };

    iframe.contentWindow?.postMessage(msg, "*", [channel.port2]);
  });
}

export async function sendMsgToParent<T>(msg: MsgInterface<T>): Promise<T> {
  return new Promise((res, rej) => {
    const channel = new MessageChannel();
    channel.port1.onmessage = ({ data }: { data: MsgInterface<T> }) => {
      channel.port1.close();
      if (data.error) {
        rej(data.error);
      } else {
        res(data.payload);
      }
    };

    window.parent.postMessage(msg, "*", [channel.port2]);
  });
}
