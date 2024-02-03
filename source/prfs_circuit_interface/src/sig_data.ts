import { BufferHex } from "./types";

export interface SigData {
  msgRaw: string;
  msgHash: BufferHex;
  sig: string;
}
