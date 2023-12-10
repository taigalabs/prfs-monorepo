// export async function sendMsgToChild(msg: any, iframe: HTMLIFrameElement): Promise<RespPayload<T>> {
//   return sendMsg(msg, (msg: Msg<T>, channel: MessageChannel) => {
//     iframe.contentWindow?.postMessage(msg, "*", [channel.port2]);
//   });
// }

import { ZAuthMsg } from ".";

export async function sendMsgToOpener(msg: any): Promise<ZAuthMsg<any>> {
  return sendMsg(msg, (msg: any, channel: MessageChannel) => {
    // window.parent.postMessage(msg, "*", [channel.port2]);
    window.opener.postMessage(msg, "*", [channel.port2]);
  });
}

export async function sendMsg(msg: ZAuthMsg<any>, sender: Function): Promise<any> {
  return new Promise((res, rej) => {
    const channel = new MessageChannel();
    channel.port1.onmessage = ({ data }: { data: any }) => {
      channel.port1.close();
      if (data.error) {
        rej(data.error);
      } else {
        if (data.payload) {
          res(data.payload as any);
        } else {
          rej("Msg doesn't contain payload");
        }
      }
    };

    sender(msg, channel);
  });
}
