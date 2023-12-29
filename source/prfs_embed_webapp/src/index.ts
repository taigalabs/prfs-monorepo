import { sendMsgToParent, newPrfsIdMsg } from "@taigalabs/prfs-id-sdk-web";

import { setupStorageListener } from "./storage";

async function main() {
  console.log("Start prfs embed webapp");

  const _resp = await sendMsgToParent(newPrfsIdMsg("HANDSHAKE", {}));
  setupStorageListener();
}

main().then();
