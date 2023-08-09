import { ethers } from "ethers";

import { GetAddressResponseMsg, MsgType } from "./msg";

export function handleChildMessage(
  iframe: HTMLIFrameElement,
  resolve: (value: any) => void,
  provider: ethers.providers.Web3Provider
) {
  console.log("attaching child msg handler");

  window.addEventListener("message", async (ev: MessageEvent) => {
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

        case "GET_ADDRESS":
          await provider.send("eth_requestAccounts", []);
          const signer = provider.getSigner();
          const addr = await signer.getAddress();
          console.log(222, addr);
          // const addr = await signer.getAddress();

          ev.ports[0].postMessage(new GetAddressResponseMsg(addr));

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
