import { ProofGenOptions, ZAuthSignInOptions } from "../element_options";
import ProofGenElement from "../proof_gen_element/proof_gen_element";

export class PrfsSDK {
  token: string;

  constructor(token: string) {
    this.token = token;
  }

  async create<K extends keyof ElementOptions, V extends ElementOptions[K]>(
    elementType: ElementType,
    options: V
  ) {
    switch (elementType) {
      case "proof-gen": {
        const elem = new ProofGenElement(options as ProofGenOptions);
        await elem.mount();
      }
      // case "zauth-sign-in": {
      //   return new ProofGenElement({
      //     proofTypeId: "ZAUTH_SIGN_IN_1",
      //     // provider: options.provider,
      //     // handleCreateProof: options.handleCreateProof,
      //     // theme: "dark",
      //   });
      // }
      // case "zauth-sign-up": {
      //   return new ProofGenElement({
      //     proofTypeId: "ZAUTH_SIGN_UP_1",
      //     // provider: options.provider,
      //     // handleCreateProof: options.handleCreateProof,
      //     // theme: "dark",
      //   });
      // }
    }
  }
}

export type ElementType = "proof-gen" | "zauth-sign-in" | "zauth-sign-up";

export interface ElementOptions {
  "proof-gen": ProofGenOptions;
  "zauth-sign-in": ZAuthSignInOptions;
}
