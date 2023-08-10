import { GetAddressResponseMsg, HandshakeResponseMsg, MsgType } from "./msg";
import { ProofGenElementOptions } from "./proof_gen_element";

export function handleChildMessage(resolve: (value: any) => void, options: ProofGenElementOptions) {
  console.log("attaching child msg handler");

  window.addEventListener("message", async (ev: MessageEvent) => {
    if (ev.ports.length > 0) {
      const { provider } = options;

      const type: MsgType = ev.data.type;
      console.log("child says, data: %o, ports: %o", ev.data, ev.ports);

      switch (type) {
        case "HANDSHAKE": {
          ev.ports[0].postMessage(new HandshakeResponseMsg("hello"));
          resolve(1);

          break;
        }

        case "GET_ADDRESS": {
          await provider.send("eth_requestAccounts", []);
          const signer = provider.getSigner();
          const addr = await signer.getAddress();

          ev.ports[0].postMessage(new GetAddressResponseMsg(addr));

          break;
        }

        case "GET_SIGNATURE": {
          const msg = ev.data.payload;

          await provider.send("eth_requestAccounts", []);
          const signer = provider.getSigner();
          const sig = await signer.signMessage(msg);

          ev.ports[0].postMessage(new GetAddressResponseMsg(sig));

          break;
        }

        default:
          console.error(`[parent] invalid msg type, ${type}`);
      }
    }
  });
}
