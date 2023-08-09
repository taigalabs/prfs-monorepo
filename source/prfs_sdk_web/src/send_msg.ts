import { Msg } from "./msg";

export async function sendMsgToChild(msg: Msg, iframe: HTMLIFrameElement) {
  return new Promise((res, rej) => {
    const channel = new MessageChannel();
    channel.port1.onmessage = ({ data }: { data: Msg }) => {
      console.log(555, data);

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

export async function sendMsgToParent(msg: Msg) {
  return new Promise((res, rej) => {
    const channel = new MessageChannel();
    channel.port1.onmessage = ({ data }: { data: Msg }) => {
      console.log(555, data);

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
