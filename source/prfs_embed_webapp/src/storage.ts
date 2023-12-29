async function listener(ev: StorageEvent) {
  console.log(11, ev);
  // if (ev.ports.length > 0) {
  //   // const type: MsgType = ev.data.type;
  //   // console.log("Msg, type: %s", type);
  // }
}

export async function setupStorageListener() {
  console.log("start storage event listening");

  window.addEventListener("storage", listener);
}
