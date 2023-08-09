import { MsgType } from "./msg";

export function handleChildMessage(iframe: HTMLIFrameElement, resolve: (value: any) => void) {
  console.log("attaching child msg handler");

  window.addEventListener("message", (ev: MessageEvent) => {
    console.log("child says, data: %o, ports: %o", ev.data, ev.ports);

    const type: MsgType = ev.data.type;
    // const ports = ev.ports;

    // if (ev.ports.length > 0) {
    //   ev.ports[0].postMessage({ result: `${ev.data} back` });
    // }

    // const msgType: MsgType = e.data.type;

    // switch (msgType) {
    //   case MsgType.HANDSHAKE: {
    //     iframe.contentWindow?.postMessage(
    //       {
    //         type: MsgType.HANDSHAKE_RESPONSE,
    //       },
    //       "*"
    //     );
    //     resolve(iframe);
    //   }
    //   default: {
    //   }
    // }
  });
}
