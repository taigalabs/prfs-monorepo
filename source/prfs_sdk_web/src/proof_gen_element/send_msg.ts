import { MsgBase } from "./msg";

export async function sendMsgToChild<T, R>(
  msg: MsgBase<T, R>,
  iframe: HTMLIFrameElement
): Promise<R> {
  return new Promise((res, rej) => {
    const channel = new MessageChannel();
    channel.port1.onmessage = ({ data }: { data: MsgBase<R, any> }) => {
      channel.port1.close();
      if (data.error) {
        rej(data.error);
      } else {
        if (data.payload) {
          res(data.payload);
        } else {
          rej("Msg doesn't contain payload");
        }
      }
    };

    iframe.contentWindow?.postMessage(msg, "*", [channel.port2]);
  });
}

export async function sendMsgToParent<T, R>(msg: MsgBase<T, R>): Promise<R> {
  return new Promise((res, rej) => {
    const channel = new MessageChannel();
    channel.port1.onmessage = ({ data }: { data: MsgBase<R, any> }) => {
      channel.port1.close();
      if (data.error) {
        rej(data.error);
      } else {
        if (data.payload) {
          res(data.payload);
        } else {
          rej("Msg doesn't contain payload");
        }
      }
    };

    window.parent.postMessage(msg, "*", [channel.port2]);
  });
}
