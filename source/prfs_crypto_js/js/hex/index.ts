function toHex(bytes: Uint8Array) {
  return bytes.reduce((o, v) => o + ("00" + v.toString(16)).slice(-2), "");
}
