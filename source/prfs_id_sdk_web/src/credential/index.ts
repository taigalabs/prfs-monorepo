import { makeECCredential, poseidon_2 } from "@taigalabs/prfs-crypto-js";
import { makeEncryptKey } from "@taigalabs/prfs-crypto-js";

export async function makePrfsIdCredential(args: MakeCredentialArgs): Promise<PrfsIdCredential> {
  const { email, password_1, password_2 } = args;
  const pw = `${email}${password_1}${password_2}`;
  const pwHash = await poseidon_2(pw);
  const { public_key, secret_key, id } = await makeECCredential(pwHash);
  const encryptKey = await makeEncryptKey(pw);
  const localEncryptKey = await makeEncryptKey(password_2);

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
  email: string;
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
