export function setupChildMsgHandler() {
  function listener(ev: MessageEvent) {
    if (ev.ports.length > 0) {
      console.log("child msg", ev.data);
      // const type: MsgType = ev.data.type;
      // console.log("child says, data: %o, ports: %o", ev.data, ev.ports);

      // switch (type) {
      //   case "HANDSHAKE": {
      //     // const handshakePayload = ev.data.payload as HandshakePayload;

      //     ev.ports[0].postMessage(new Msg("HANDSHAKE_RESPONSE", {}));
      //     resolve(0);

      //     break;
      //   }

      //   default:
      //     console.error(`[proof_gen_element] invalid msg type, ${type}`);
      // }
    }
  }

  window.addEventListener("message", listener);

  return listener;
}

// if (singleton.msgEventListener) {
//   console.warn("msgEventListener already exists, removing the old one");
//   window.removeEventListener("message", singleton.msgEventListener);
// }

// console.log("Attaching child msg handler");
// singleton.msgEventListener = msgEventListener;
// window.addEventListener("message", msgEventListener);
