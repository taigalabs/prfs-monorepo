import { bufferToHex } from "@ethereumjs/util";
import { node__rand256Hex } from "./node";

describe("rand", () => {
  it("generates random values", async () => {
    const val = node__rand256Hex();
    const hex = bufferToHex(val);
    console.log("Random value", hex);
  });
});
