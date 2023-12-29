import { setupStorageListener } from "./storage";

async function main() {
  console.log("Start prfs embed webapp");

  setupStorageListener();
}

main().then();
