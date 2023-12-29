import { PrfsIdMsg } from "./msg";

// export async function sendMsgToChild(child: Window, msg: PrfsIdMsg<any>): Promise<any> {
//   return sendMsg(msg, (msg: any, channel: MessageChannel) => {
//     child.postMessage(msg, "*", [channel.port2]);
//   });
// }

// export async function sendMsgToOpener(msg: PrfsIdMsg<any>): Promise<PrfsIdMsg<any>> {
//   return sendMsg(msg, (msg: any, channel: MessageChannel) => {
//     if (window.opener) {
//       window.opener.postMessage(msg, "*", [channel.port2]);
//     } else {
//       throw new Error(
//         "Window opener is null. Did you refresh prfs id window? Try again by reopening the module",
//       );
//     }
//   });
// }

// export async function sendMsg(msg: PrfsIdMsg<any>, sender: Function): Promise<any> {
//   return new Promise((res, rej) => {
//     const channel = new MessageChannel();
//     channel.port1.onmessage = ({ data }: { data: any }) => {
//       channel.port1.close();
//       if (data.error) {
//         rej(data.error);
//       } else {
//         res(data.payload as any);
//       }
//     };
//     sender(msg, channel);
//   });
// }

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

export async function sendMsg(msg: PrfsIdMsg<any>, sender: Function): Promise<any> {
  return new Promise((res, rej) => {
    const channel = new MessageChannel();
    channel.port1.onmessage = ({ data }: { data: PrfsIdMsg<any> }) => {
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
