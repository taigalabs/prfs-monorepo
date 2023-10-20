export function bnToBuf(bn: bigint) {
  // The handy-dandy `toString(base)` works!!
  var hex = BigInt(bn).toString(16);

  // But it still follows the old behavior of giving
  // invalid hex strings (due to missing padding),
  // but we can easily add that back
  if (hex.length % 2) {
    hex = "0" + hex;
  }

  // The byteLength will be half of the hex string length
  var len = hex.length / 2;
  var u8 = new Uint8Array(len);

  // And then we can iterate each element by one
  // and each hex segment by two
  var i = 0;
  var j = 0;
  while (i < len) {
    u8[i] = parseInt(hex.slice(j, j + 2), 16);
    i += 1;
    j += 2;
  }

  // Tada!!
  return u8;
}
