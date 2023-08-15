import { listenClickOutside, removeClickListener } from "./outside_event";
import {
  GetAddressResponseMsg,
  HandshakePayload,
  HandshakeResponseMsg,
  ListenClickOutsideMsg,
  ListenClickOutsideResponseMsg,
  MsgType,
} from "./msg";
import { LOADING_SPAN_ID, ProofGenElementOptions, ProofGenElementState } from "./proof_gen_element";

export function handleChildMessage(
  resolve: (value: any) => void,
  options: ProofGenElementOptions,
  iframe: HTMLIFrameElement,
  state: ProofGenElementState
) {
  console.log("Attaching child msg handler");

  const msgEventListener = async (ev: MessageEvent) => {
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
          const msgHash = ev.data.payload;
          // const msg = Buffer.from(msgRaw);

          await provider.send("eth_requestAccounts", []);
          const signer = provider.getSigner();
          const sig = await signer.signMessage(msgHash);

          ev.ports[0].postMessage(new GetAddressResponseMsg(sig));

          break;
        }

        case "LISTEN_CLICK_OUTSIDE": {
          if (!state.clickOutsideListener) {
            const outsideClickListener = listenClickOutside(iframe);
            state.clickOutsideListener = outsideClickListener;
            ev.ports[0].postMessage(new ListenClickOutsideResponseMsg(true));
          }

          ev.ports[0].postMessage(new ListenClickOutsideResponseMsg(false));

          break;
        }

        case "STOP_CLICK_OUTSIDE": {
          if (state.clickOutsideListener) {
            removeClickListener(state.clickOutsideListener);
            state.clickOutsideListener = undefined;
          }

          break;
        }

        default:
          console.error(`[parent] invalid msg type, ${type}`);
      }
    }
  };

  window.addEventListener("message", msgEventListener);

  return msgEventListener;
}
