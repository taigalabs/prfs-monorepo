import { hashPersonalMessage } from "@ethereumjs/util";
import { listenClickOutsideIFrame, removeClickListener } from "./outside_event";
import { GetSignaturePayload, HandshakePayload, Msg, MsgType } from "./msg";
import { LOADING_SPAN_ID, ProofGenElementOptions, ProofGenElementState } from "./proof_gen_element";

export function handleChildMessage(
  resolve: (value: any) => void,
  options: ProofGenElementOptions,
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
          const handshakePayload = ev.data.payload as HandshakePayload;

          const { docHeight } = handshakePayload;
          const { iframe, placeholder, wrapper } = state;

          if (!iframe || !placeholder || !wrapper) {
            console.error("sdk elements are not defined");
            return;
          }

          state.calcHeight = docHeight;
          wrapper.style.height = `${docHeight}px`;
          placeholder.style.height = `${docHeight}px`;

          ev.ports[0].postMessage(new Msg("HANDSHAKE_RESPONSE", undefined));

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

          ev.ports[0].postMessage(new Msg("GET_ADDRESS_RESPONSE", addr));

          break;
        }

        case "GET_SIGNATURE": {
          const { msgRaw } = ev.data.payload as GetSignaturePayload;

          await provider.send("eth_requestAccounts", []);
          const signer = provider.getSigner();
          const msgHash = hashPersonalMessage(Buffer.from(msgRaw));
          const sig = await signer.signMessage(msgRaw);

          ev.ports[0].postMessage(
            new Msg("GET_SIGNATURE_RESPONSE", {
              msgHash,
              sig,
            })
          );

          break;
        }

        case "LISTEN_CLICK_OUTSIDE": {
          if (!state.clickOutsideIFrameListener && state.iframe) {
            const outsideClickListener = listenClickOutsideIFrame(state.iframe);
            state.clickOutsideIFrameListener = outsideClickListener;

            ev.ports[0].postMessage(new Msg("LISTEN_CLICK_OUTSIDE_RESPONSE", true));
          }

          ev.ports[0].postMessage(new Msg("LISTEN_CLICK_OUTSIDE_RESPONSE", false));

          break;
        }

        case "STOP_CLICK_OUTSIDE": {
          if (state.clickOutsideIFrameListener) {
            removeClickListener(state.clickOutsideIFrameListener);
            state.clickOutsideIFrameListener = undefined;
          }

          break;
        }

        case "OPEN_DIALOG": {
          const wrapper = state.wrapper as HTMLDivElement;
          const offsets = wrapper!.getBoundingClientRect();

          wrapper.style.position = "fixed";
          wrapper.style.inset = "0px";
          wrapper.style.width = "100vw";
          wrapper.style.height = "100vh";

          ev.ports[0].postMessage(
            new Msg("OPEN_DIALOG_RESPONSE", {
              top: offsets.top,
              left: offsets.left,
            })
          );

          break;
        }

        case "CLOSE_DIALOG": {
          const wrapper = state.wrapper as HTMLDivElement;
          wrapper.style.position = "absolute";
          wrapper.style.width = "auto";
          wrapper.style.height = "auto";

          ev.ports[0].postMessage(new Msg("CLOSE_DIALOG", undefined));

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
