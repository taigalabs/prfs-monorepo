import { Msg, MsgType } from "../../msg";
// import { ProofGenEvent } from "./types";
import emit, { EventSubscriber } from "../../msg/emit";
import { UtilsEvent } from "./types";

const singleton: ProofGenElementSingleton = {
  msgEventListener: undefined,
};

export async function handleChildMessage(subscribers: EventSubscriber<UtilsEvent>[]) {
  const ret = await new Promise(resolve => {
    const msgEventListener = (ev: MessageEvent) => {
      if (ev.ports.length > 0) {
        const type: MsgType = ev.data.type;
        // console.log("child says, data: %o, ports: %o", ev.data, ev.ports);

        switch (type) {
          case "HANDSHAKE": {
            // const handshakePayload = ev.data.payload as HandshakePayload;
            //
            ev.ports[0].postMessage(new Msg("HANDSHAKE_RESPONSE", {}));
            resolve(0);

            break;
          }

          // case "CREATE_PROOF_EVENT": {
          //   const { payload } = ev.data;
          //   // console.log("proof gen event", payload);

          //   emit(subscribers, {
          //     type: "CREATE_PROOF_EVENT",
          //     payload,
          //   });

          //   break;
          // }

          // case "LOAD_DRIVER_EVENT": {
          //   const { payload } = ev.data;
          //   // console.log("load driver event", payload);

          //   emit(subscribers, {
          //     type: "LOAD_DRIVER_EVENT",
          //     payload,
          //   });

          //   break;
          // }

          // case "VERIFY_PROOF_EVENT": {
          //   const { payload } = ev.data;

          //   emit(subscribers, {
          //     type: "VERIFY_PROOF_EVENT",
          //     payload,
          //   });

          //   break;
          // }

          default:
            console.error(`[proof_gen_element] invalid msg type, ${type}`);
        }
      }
    };

    // window.addEventListener("message", msgEventListener);
    if (singleton.msgEventListener) {
      console.warn("msgEventListener already exists, removing the old one");
      window.removeEventListener("message", singleton.msgEventListener);
    }

    console.log("Attaching child msg handler");
    singleton.msgEventListener = msgEventListener;
    window.addEventListener("message", msgEventListener);
  });

  return ret;
}

export type MsgEventListener = (ev: MessageEvent) => void;

export interface ProofGenElementSingleton {
  msgEventListener: MsgEventListener | undefined;
}
