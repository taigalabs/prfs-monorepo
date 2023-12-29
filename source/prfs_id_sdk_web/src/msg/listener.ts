import { PrfsIdMsg, newPrfsIdMsg } from "./msg";

const singleton = {
  msgEventListener: undefined,
};

export function setupChildMsgHandler() {
  return new Promise((resolve, reject) => {
    function listener(ev: MessageEvent) {
      // if (ev.ports.length > 0) {
      //   console.log("child msg", ev.data);
      //   const data = ev.data as PrfsIdMsg<any>;
      //   if (data.type) {
      //     switch (data.type) {
      //       case "HANDSHAKE": {
      //         // const handshakePayload = ev.data.payload as HandshakePayload;
      //         ev.ports[0].postMessage(newPrfsIdMsg("HANDSHAKE_ACK", {}));
      //         resolve(0);
      //         break;
      //       }
      //       //   default:
      //       //     console.error(`[proof_gen_element] invalid msg type, ${type}`);
      //       // }
      //     }
      //   }
      // }
      // window.addEventListener("message", listener);
    }
  });
}

// if (singleton.msgEventListener) {
//   console.warn("msgEventListener already exists, removing the old one");
//   window.removeEventListener("message", singleton.msgEventListener);
// }

// console.log("Attaching child msg handler");
// singleton.msgEventListener = msgEventListener;
// window.addEventListener("message", msgEventListener);
