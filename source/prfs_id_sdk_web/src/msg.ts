import { PrfsIdMsg } from ".";

// export async function sendMsgToChild(msg: any, iframe: HTMLIFrameElement): Promise<RespPayload<T>> {
//   return sendMsg(msg, (msg: Msg<T>, channel: MessageChannel) => {
//     iframe.contentWindow?.postMessage(msg, "*", [channel.port2]);
//   });
// }

export async function sendMsgToOpener(msg: any): Promise<PrfsIdMsg<any>> {
  return sendMsg(msg, (msg: any, channel: MessageChannel) => {
    if (window.opener) {
      window.opener.postMessage(msg, "*", [channel.port2]);
    } else {
      throw new Error(
        "Window opener is null. Did you refresh prfs id window? Try again by reopening the module",
      );
    }
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
