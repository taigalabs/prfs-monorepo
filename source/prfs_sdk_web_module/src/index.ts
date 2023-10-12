import { setupProofGen } from "./setupProofGen";
import qs from "qs";

async function main() {
  // const parsed = qs.parse(window.location.search);
  // console.log("query string", parsed);
  const unsubscribe = await setupProofGen();
}

main().then();
