import { PrfsIdMsg } from ".";

// export async function sendMsgToChild(msg: any, iframe: HTMLIFrameElement): Promise<RespPayload<T>> {
//   return sendMsg(msg, (msg: Msg<T>, channel: MessageChannel) => {
//     iframe.contentWindow?.postMessage(msg, "*", [channel.port2]);
//   });
// }

export async function sendMsgToOpener(msg: any): Promise<PrfsIdMsg<any>> {
  return sendMsg(msg, (msg: any, channel: MessageChannel) => {
    window.opener.postMessage(msg, "*", [channel.port2]);
  });
}

export async function sendMsg(msg: PrfsIdMsg<any>, sender: Function): Promise<any> {
  return new Promise((res, rej) => {
    const channel = new MessageChannel();
    channel.port1.onmessage = ({ data }: { data: any }) => {
      channel.port1.close();

      if (data.error) {
        rej(data.error);
      } else {
        res(data.payload as any);
      }
    };

    sender(msg, channel);
  });
}
