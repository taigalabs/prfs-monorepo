import { MsgType } from "../msg/payload";
import { ProofGenOptions } from "../element_options";
import { Msg } from "../msg";

export async function handleChildMessage(options: ProofGenOptions) {
  console.log("Attaching child msg handler");

  const { proofGenEventListener } = options;

  const ret = await new Promise<MsgEventListener>(resolve => {
    let listener: MsgEventListener;

    const msgEventListener = (ev: MessageEvent) => {
      if (ev.ports.length > 0) {
        const type: MsgType = ev.data.type;

        // console.log("child says, data: %o, ports: %o", ev.data, ev.ports);

        switch (type) {
          case "HANDSHAKE": {
            // const handshakePayload = ev.data.payload as HandshakePayload;

            ev.ports[0].postMessage(new Msg("HANDSHAKE_RESPONSE", {}));

            if (listener) {
              resolve(listener);
            }

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

    listener = msgEventListener;
    // window.addEventListener("message", msgEventListener);
  });

  return ret;
}

export type MsgEventListener = (ev: MessageEvent) => void;
