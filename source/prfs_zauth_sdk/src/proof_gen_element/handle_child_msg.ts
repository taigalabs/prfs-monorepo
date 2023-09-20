import { hashPersonalMessage } from "@ethereumjs/util";
import { listenClickOutsideIFrame, removeClickListener } from "./outside_event";
import { GetSignaturePayload, HandshakePayload, Msg, MsgType, OpenDialogPayload } from "./msg";
import { MSG_SPAN_ID, ProofGenElementOptions, ProofGenElementState } from "./proof_gen_element";

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
          const wrapperDiv = state.wrapperDiv as HTMLDivElement;
          const placeholderDiv = state.placeholderDiv as HTMLDivElement;

          state.calcHeight = docHeight;
          wrapperDiv.style.height = `${docHeight}px`;
          placeholderDiv.style.height = `${docHeight}px`;

          ev.ports[0].postMessage(new Msg("HANDSHAKE_RESPONSE", undefined));

          placeholderDiv.innerText = "";

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
          const { duration } = ev.data.payload as OpenDialogPayload;

          const wrapperDiv = state.wrapperDiv as HTMLDivElement;
          const placeholderDiv = state.placeholderDiv as HTMLDivElement;
          const offsets = wrapperDiv.getBoundingClientRect();

          wrapperDiv.style.position = "fixed";
          wrapperDiv.style.inset = "0px";
          wrapperDiv.style.width = "100vw";
          wrapperDiv.style.height = "100vh";

          ev.ports[0].postMessage(
            new Msg("OPEN_DIALOG_RESPONSE", {
              top: offsets.top,
              left: offsets.left,
            })
          );

          if (placeholderDiv) {
            placeholderDiv.innerText = "Opening dialog...";
          }

          window.setTimeout(() => {
            placeholderDiv.innerText = "";
          }, duration);

          break;
        }

        case "CLOSE_DIALOG": {
          const wrapperDiv = state.wrapperDiv as HTMLDivElement;
          const { calcWidth, calcHeight } = state;

          wrapperDiv.style.position = "absolute";
          wrapperDiv.style.width = `${calcWidth}px`;
          wrapperDiv.style.height = `${calcHeight}px`;

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
