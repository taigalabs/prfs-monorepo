import { PrfsIdMsg } from "./msg";

export async function sendMsgToChild(msg: PrfsIdMsg<any>, iframe: HTMLIFrameElement): Promise<any> {
  return sendMsg(msg, (msg: PrfsIdMsg<any>, channel: MessageChannel) => {
    iframe.contentWindow?.postMessage(msg, "*", [channel.port2]);
  });
}

export async function sendMsgToParent(msg: PrfsIdMsg<any>): Promise<any> {
  return sendMsg(msg, (msg: PrfsIdMsg<any>, channel: MessageChannel) => {
    window.parent.postMessage(msg, "*", [channel.port2]);
  });
}

export async function sendMsg(msg: PrfsIdMsg<any>, sender: Function): Promise<PrfsIdMsg<any>> {
  return new Promise((res, rej) => {
    const channel = new MessageChannel();
    channel.port1.onmessage = ({ data }: { data: any }) => {
      res(data);
      channel.port1.close();
    };

    sender(msg, channel);
  });
}
