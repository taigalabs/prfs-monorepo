import { Msg, MsgInterface } from "./msg";
import { MsgType, RespPayload } from "./payload";

export async function sendMsgToChild<T extends MsgType>(
  msg: Msg<T>,
  iframe: HTMLIFrameElement,
): Promise<RespPayload<T>> {
  return sendMsg(msg, (msg: Msg<T>, channel: MessageChannel) => {
    iframe.contentWindow?.postMessage(msg, "*", [channel.port2]);
  });
}

export async function sendMsgToParent<T extends MsgType>(msg: Msg<T>): Promise<RespPayload<T>> {
  return sendMsg(msg, (msg: Msg<T>, channel: MessageChannel) => {
    window.parent.postMessage(msg, "*", [channel.port2]);
  });
}

export async function sendMsg<T extends MsgType>(
  msg: Msg<T>,
  sender: Function,
): Promise<RespPayload<T>> {
  return new Promise((res, rej) => {
    const channel = new MessageChannel();
    channel.port1.onmessage = ({ data }: { data: MsgInterface<any> }) => {
      channel.port1.close();
      if (data.error) {
        rej(data.error);
      } else {
        if (data.payload) {
          res(data.payload as RespPayload<T>);
        } else {
          rej("Msg doesn't contain payload");
        }
      }
    };

    sender(msg, channel);
  });
}
