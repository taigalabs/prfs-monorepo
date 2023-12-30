import {
  sendMsgToParent,
  newPrfsIdMsg,
  setupParentMsgHandler,
  MessageQueue,
} from "@taigalabs/prfs-id-sdk-web";

async function main() {
  console.log("Start prfs embed webapp");

  const messageQueue = new MessageQueue();
  setupParentMsgHandler(messageQueue);
  await sendMsgToParent(newPrfsIdMsg("HANDSHAKE", {}));
}

main().then();
