import { sendMsgToParent, newPrfsIdMsg, setupParentMsgHandler } from "@taigalabs/prfs-id-sdk-web";

async function main() {
  console.log("Start prfs embed webapp");

  setupParentMsgHandler();
  console.log(123);
  const ack = await sendMsgToParent(newPrfsIdMsg("HANDSHAKE", {}));
  console.log(222, ack);
}

main().then();
