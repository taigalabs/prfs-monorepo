// deprecated
// const ELEM_ID = "prfs_embed";

// export function createEmbeddedElem(args: CreateEmbeddedElemArgs) {
//   console.log("init channel", args);
//   const { appId, prfsEmbedEndpoint } = args;

//   const el = document.getElementById(ELEM_ID) as HTMLIFrameElement;
//   if (el) {
//     console.log("Prfs embed element is found. Returning the old one");
//     return el;
//   }

//   const iframe = document.createElement("iframe");
//   iframe.id = ELEM_ID;
//   iframe.src = `${prfsEmbedEndpoint}?app_id=${appId}`;
//   iframe.allow = "cross-origin-isolated";
//   iframe.style.border = "none";
//   iframe.style.display = "none";

//   console.log("attaching iframe");
//   document.body.appendChild(iframe);

//   return iframe;
// }

// export interface CreateEmbeddedElemArgs {
//   appId: string;
//   prfsEmbedEndpoint: string;
// }
