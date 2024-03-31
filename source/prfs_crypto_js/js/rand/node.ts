import crypto from "crypto";

export function node__rand256Hex() {
  const buffer = crypto.randomBytes(32);
  return buffer;
}
