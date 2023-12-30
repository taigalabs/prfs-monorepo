const PRFS_STORAGE = "prfs_storage";

export function createEmbeddedElem(args: CreateEmbeddedElemArgs) {
  console.log("init channel", args);
  const { appId, prfsEmbedEndpoint } = args;

  const el = document.getElementById(PRFS_STORAGE) as HTMLIFrameElement;
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

export interface CreateEmbeddedElemArgs {
  appId: string;
  prfsEmbedEndpoint: string;
}
