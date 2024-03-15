import { keccak256 } from "@taigalabs/prfs-crypto-deps-js/viem";
import { makeECCredential, poseidon_2, toUtf8Bytes } from "@taigalabs/prfs-crypto-js";
import { makeEncryptKey } from "@taigalabs/prfs-crypto-js";

export const ID = "id";
export const PASSWORD_1 = "password_1";
export const PASSWORD_2 = "password_2";

export async function makePrfsIdCredential(args: MakeCredentialArgs): Promise<PrfsIdCredential> {
  const { id: id_, password_1, password_2 } = args;
  const pw = `${id_}${password_1}${password_2}`;
  const pwBytes = keccak256(toUtf8Bytes(pw), "bytes");
  const pw2Bytes = keccak256(toUtf8Bytes(password_2), "bytes");

  const pwHash = await poseidon_2(pwBytes);
  const { public_key, secret_key, id } = await makeECCredential(pwHash);
  const encryptKey = await makeEncryptKey(pwBytes);
  const localEncryptKey = await makeEncryptKey(pw2Bytes);

  return {
    secret_key,
    public_key,
    id,
    encrypt_key: encryptKey.toHex(),
    local_encrypt_key: localEncryptKey.toHex(),
  };
}

export function makeColor(str: string) {
  const num = parseInt(str, 16);
  const h = num % 360;
  const s = (num % 80) + 20;
  const l = num % 60;
  return hslToHex(h, s, l);
}

function hslToHex(h: number, s: number, l: number) {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0"); // convert to Hex and prefix "0" if needed
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

export interface MakeCredentialArgs {
  id: string;
  password_1: string;
  password_2: string;
}

export interface PrfsIdCredential {
  secret_key: string;
  public_key: string;
  id: string;
  encrypt_key: string;
  local_encrypt_key: string;
}
