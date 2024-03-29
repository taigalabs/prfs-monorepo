import { createRandomKeyPair } from ".";

describe("key", () => {
  it("generates random key pair", async () => {
    const keypair = createRandomKeyPair();
    console.log("key pair", keypair);
  });
});
