// import benchPubKeyMembership from "./node.bench_pubkey_membership";
// import benchAddressMembership2 from "./node.bench_addr_membership2.js";

const benchAddressMembership2 = require("./node.bench_addr_membership2");

const bench = async () => {
  // await benchPubKeyMembership();
  // await benchAddressMembership();
  await benchAddressMembership2.default();
};

bench();
