import { MsgType } from "./msg";

export function handleChildMessage(iframe: HTMLIFrameElement, resolve: (value: any) => void) {
  console.log("attaching child msg handler");

  window.addEventListener("message", (e: MessageEvent) => {
    console.log("child says, data: %o, ports: %o", e.data, e.ports);

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
