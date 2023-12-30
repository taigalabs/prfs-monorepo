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
  console.log(123);
  const ack = await sendMsgToParent(newPrfsIdMsg("HANDSHAKE", {}));
  console.log(222, ack);
}

main().then();
