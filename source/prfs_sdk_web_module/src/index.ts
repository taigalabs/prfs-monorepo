import { setupListener } from "./listen";

async function main() {
  const searchParams = new URLSearchParams(window.location.search);
  console.log("SDK search params: %o", searchParams);

  const sdk = searchParams.get("sdk");
  if (!sdk) {
    console.error(`Search param 'sdk' needs to be specified`);
    return null;
  }

  switch (sdk) {
    case "proof_gen": {
      console.log("sdk: proof_gen, setting up msg listener");
      await setupListener();
      return null;
    }

    case "utils": {
      console.log("sdk: utils, initializing wasm");
      const mod = await import("@taigalabs/prfs-driver-utils-wasm");
      const wasm = await mod.initWasm();

      return wasm;
    }

    default: {
      console.error("sdk is invalid: %s", sdk);
      return null;
    }
  }
}

main().then();
