import { hashPersonalMessage } from "@ethereumjs/util";
import { listenClickOutsideIFrame, removeClickListener } from "./outside_event";
import { GetSignaturePayload, HandshakePayload, MsgType } from "../msg/payload";
import { ProofGenElementState } from "./proof_gen_element";
import { ProofGenOptions } from "../element_options";
import { Msg } from "../msg";

export function handleChildMessage(
  resolve: (value: any) => void,
  options: ProofGenOptions,
  state: ProofGenElementState
) {
  console.log("Attaching child msg handler");

  const { proofGenEventListener } = options;

  const msgEventListener = async (ev: MessageEvent) => {
    if (ev.ports.length > 0) {
      const type: MsgType = ev.data.type;

      console.log("child says, data: %o, ports: %o", ev.data, ev.ports);

      switch (type) {
        case "HANDSHAKE": {
          // const handshakePayload = ev.data.payload as HandshakePayload;

          ev.ports[0].postMessage(new Msg("HANDSHAKE_RESPONSE", {}));

          resolve(1);
          break;
        }

        case "PROOF_GEN_EVENT": {
          const { payload } = ev.data;

          proofGenEventListener(payload.type, payload.msg);
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
