import { ethers } from "ethers";

import { MsgType } from "./msg";

export function handleChildMessage(
  iframe: HTMLIFrameElement,
  resolve: (value: any) => void,
  provider: ethers.providers.Web3Provider
) {
  console.log("attaching child msg handler");

  window.addEventListener("message", (ev: MessageEvent) => {
    if (ev.ports.length > 0) {
      const type: MsgType = ev.data.type;

      console.log("child says, data: %o, ports: %o", ev.data, ev.ports);

      switch (type) {
        case "HANDSHAKE":
          ev.ports[0].postMessage({
            type: MsgType.HANDSHAKE_RESPONSE,
            payload: `Hello`,
          });
          break;

        case "GET_SIGNER":
          console.log(11, provider);

          ev.ports[0].postMessage({
            type: MsgType.GET_SIGNER_RESPONSE,
            payload: `Hello`,
          });

          break;
        default:
          console.error(`invalid msg type, ${type}`);
      }
    }

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
