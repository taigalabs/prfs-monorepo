import { GetAddressResponseMsg, HandshakePayload, HandshakeResponseMsg, MsgType } from "./msg";
import { LOADING_SPAN_ID, ProofGenElementOptions } from "./proof_gen_element";

export function handleChildMessage(
  resolve: (value: any) => void,
  options: ProofGenElementOptions,
  iframe: HTMLIFrameElement
) {
  console.log("Attaching child msg handler");

  window.addEventListener("message", async (ev: MessageEvent) => {
    if (ev.ports.length > 0) {
      const { provider } = options;

      const type: MsgType = ev.data.type;
      console.log("child says, data: %o, ports: %o", ev.data, ev.ports);

      switch (type) {
        case "HANDSHAKE": {
          const handshakePayload: HandshakePayload = ev.data.payload;

          const { formHeight } = handshakePayload;
          iframe.style.height = `${formHeight}px`;

          ev.ports[0].postMessage(new HandshakeResponseMsg({}));

          const loading = document.getElementById(LOADING_SPAN_ID);
          if (loading) {
            loading.style.display = "none";
          }

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
