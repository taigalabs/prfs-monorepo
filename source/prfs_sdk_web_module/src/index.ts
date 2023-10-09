console.log(33);

import { setupProofGen } from "./setupProofGen";
import qs from "qs";

async function main() {
  console.log(44, window.location);

  const parsed = qs.parse(window.location.search);
  console.log("query string", parsed);
  const subscribe = await setupProofGen();
}

main().then();
