import { hashPersonalMessage } from "@ethereumjs/util";
import {
  listenClickOutsideDialog,
  listenClickOutsideIFrame,
  removeClickListener,
} from "./outside_event";
import { GetSignaturePayload, HandshakePayload, Msg, MsgType } from "./msg";
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
          const handshakePayload = ev.data.payload as HandshakePayload;

          const { docHeight } = handshakePayload;
          iframe.style.height = `${docHeight}px`;

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

          // ev.ports[0].postMessage(new GetAddressResponseMsg(addr));
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
          if (!state.clickOutsideIFrameListener) {
            const outsideClickListener = listenClickOutsideIFrame(iframe);
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
          // const html = ev.data.payload as string;

          const { portal } = state;
          if (portal) {
            portal.style.inset = "0px";
            portal.style.background = "rgba(0, 0, 0, 0.8)";
            portal.style.display = "grid";
            portal.style.placeItems = "center";
            portal.style.zIndex = "10000";

            const div = document.createElement("div");
            div.innerText = "wow";
            div.style.backgroundColor = "#ffffff";
            div.style.width = "500px";

            if (!state.clickOutsideDialogListener) {
              const outsideDialogClickListener = listenClickOutsideDialog(div, () => {
                portal.style.display = "none";
                while (portal.lastChild) {
                  portal.removeChild(portal.lastChild);
                }
              });

              state.clickOutsideDialogListener = outsideDialogClickListener;
            }

            portal.appendChild(div);
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
