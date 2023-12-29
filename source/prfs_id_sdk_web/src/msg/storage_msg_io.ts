const PRFS_STORAGE = "prfs_storage";

export function initChannel(args: InitChannelArgs) {
  console.log("init channel", args);
  const { appId, prfsEmbedEndpoint } = args;

  const iframe = document.createElement("iframe");
  iframe.id = PRFS_STORAGE;
  iframe.src = `${prfsEmbedEndpoint}?app_id=${appId}`;
  iframe.allow = "cross-origin-isolated";
  iframe.style.border = "none";
  iframe.style.display = "none";

  console.log("attaching iframe");
  document.body.appendChild(iframe);
}

export function initStorageListener() {
  function listener(ev: StorageEvent) {
    console.log(11, listener);
  }
  window.addEventListener("storage", listener);

  return listener;
}

export function sendStorageMsg(key: string, val: string) {
  window.localStorage.setItem(key, val);
  // window.dispatchEvent(new Event("storage"));
}

export interface InitChannelArgs {
  appId: string;
  prfsEmbedEndpoint: string;
}
