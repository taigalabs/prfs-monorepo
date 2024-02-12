// import { PrfsIdMsg } from "./msg";

// export async function sendMsgToPopup(child: Window, msg: PrfsIdMsg<any>): Promise<any> {
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
//
