import { sendMsgToParent, newPrfsIdMsg } from "@taigalabs/prfs-id-sdk-web";

// import { setupStorageListener } from "./storage";

async function main() {
  console.log("Start prfs embed webapp");

  // setupStorageListener();
  const _resp = await sendMsgToParent(newPrfsIdMsg("HANDSHAKE", {}));
}

main().then();
