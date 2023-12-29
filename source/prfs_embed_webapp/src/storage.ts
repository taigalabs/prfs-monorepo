// import {
//   CircuitDriver,
//   DriverEvent,
//   LoadDriverEvent,
//   LoadDriverEventPayload,
//   LogEventPayload,
// } from "@taigalabs/prfs-driver-interface";

// import {
//   CreateProofPayload,
//   HashPayload,
//   Msg,
//   MsgType,
//   VerifyProofPayload,
//   sendMsgToParent,
// } from "@taigalabs/prfs-sdk-web";

async function listener(ev: StorageEvent) {
  console.log(11, ev);
  // if (ev.ports.length > 0) {
  //   // const type: MsgType = ev.data.type;
  //   // console.log("Msg, type: %s", type);
  // }
}

export async function setupStorageListener() {
  window.addEventListener("storage", listener);
}
