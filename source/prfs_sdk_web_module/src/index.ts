import { setupProofGen } from "./setupProofGen";
import qs from "qs";

async function main() {
  const { pathname } = window.location;
  console.log(123, pathname);

  const query = qs.parse(window.location.search);
  console.log("query string", query);

  await setupProofGen();
}

main().then();
