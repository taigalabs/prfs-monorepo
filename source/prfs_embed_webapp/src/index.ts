import { setupListener } from "./listen";

async function main() {
  console.log("start");
  // const searchParams = new URLSearchParams(window.location.search);
  // console.log("SDK search params: %o", searchParams);
  // const sdk = searchParams.get("elem");
  // if (!sdk) {
  //   console.error(`Search param 'sdk' needs to be specified`);
  //   return null;
  // }
  // switch (sdk) {
  //   case "proof_gen": {
  //     console.log("sdk: proof_gen, setting up msg listener");
  //     await setupListener();
  //     return null;
  //   }
  //   default: {
  //     console.error("sdk is invalid: %s", sdk);
  //     return null;
  //   }
  // }
}

main().then();