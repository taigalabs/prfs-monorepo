import { setupListener } from "./listen";
import qs from "qs";

async function main() {
  const query = qs.parse(window.location.search);
  console.log("query string", query);

  const searchParams = new URLSearchParams(window.location.search);
  console.log("SDK search params: %o", searchParams);

  await setupListener();
}

main().then();
