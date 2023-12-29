import { API_PATH } from "..";

const PRFS_CH = "prfs-ch";

export function initChannel(args: InitChannelArgs) {
  console.log("init channel");
  const { appId, prfsIdEndpoint } = args;

  const iframe = document.createElement("iframe");
  iframe.id = PRFS_CH;
  iframe.src = `${prfsIdEndpoint}${API_PATH.local}?app_id=${appId}`;
  iframe.allow = "cross-origin-isolated";
  iframe.style.border = "none";
  iframe.style.display = "none";

  console.log("attaching iframe");
  document.body.appendChild(iframe);

  if (iframe.contentWindow) {
    iframe.contentWindow.onload = () => {
      console.log(123);
    };
  }
}

export function initStorageListener() {
  function listener(ev: StorageEvent) {
    console.log(11, listener);
  }
  window.addEventListener("storage", listener);

  return listener;
}

export interface InitChannelArgs {
  appId: string;
  prfsIdEndpoint: string;
}
