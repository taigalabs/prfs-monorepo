export function makeRandInt(digit: number) {
  return Math.floor(Math.random() * digit);
}

export function rand256() {
  const hex = rand256Hex();

  // convert hexademical value to a decimal string
  return BigInt(hex).toString(10);
}

export function rand256Hex() {
  const bytes = new Uint8Array(32);

  // load cryptographically random bytes into array
  window.crypto.getRandomValues(bytes);

  // convert byte array to hexademical representation
  const bytesHex = bytes.reduce((o, v) => o + ("00" + v.toString(16)).slice(-2), "");

  return "0x" + bytesHex;
}
