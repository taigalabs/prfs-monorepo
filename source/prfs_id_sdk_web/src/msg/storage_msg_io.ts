const PRFS_STORAGE = "prfs_storage";

export function initChannel(args: InitChannelArgs) {
  console.log("init channel", args);
  const { appId, prfsEmbedEndpoint } = args;

  const el = document.getElementById(PRFS_STORAGE);
  if (el) {
    console.log("Prfs embed element is found. Returning the old one");
    return el;
  }

  const iframe = document.createElement("iframe");
  iframe.id = PRFS_STORAGE;
  iframe.src = `${prfsEmbedEndpoint}?app_id=${appId}`;
  iframe.allow = "cross-origin-isolated";
  iframe.style.border = "none";
  iframe.style.display = "none";

  console.log("attaching iframe");
  document.body.appendChild(iframe);

  return iframe;
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
