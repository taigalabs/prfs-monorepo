describe("merkle", () => {
  it("should work", async () => {
    // const prfsWasm = await import("../wasm_wrapper/build");

    const siblings = [
      63493556091605062420991890579763508134186613118493263501548433187433360490127n,
      11541185532172907887807548670798677910461320867216093684679519736414477281130n,
      46047770928043873318922683836364247018106473475357172793180236964171325499653n,
      115760733330141896534478044390742651698471456266370979792141327638651460127416n,
      0n,
      0n,
      0n,
      0n,
      0n,
      0n,
      0n,
      0n,
      0n,
      0n,
      0n,
      0n,
      0n,
      0n,
      0n,
      0n,
      0n,
      0n,
      0n,
      0n,
      0n,
      0n,
      0n,
      0n,
      0n,
      0n,
      0n,
      0n,
    ];

    const pathIndices = [
      0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0,
    ];

    const leaf = 102498427863254023081333814438884825891078623819961206520538795054519983665318n;
    const root_ = 0;

    // async function hash(arg1: bigint, arg2: bigint) {
    //   return await poseidon_2_bigint_le([arg1, arg2]);
    // }

    // const root = await computeRoot(leaf, siblings, pathIndices, hash);

    // assert()
  });
});
