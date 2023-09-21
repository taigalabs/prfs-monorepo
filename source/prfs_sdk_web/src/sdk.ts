import { ProofGenOptions, ZAuthSignInOptions } from "./element_options";
import ProofGenElement from "./proof_gen_element/proof_gen_element";

export class PrfsSDK {
  token: string;

  constructor(token: string) {
    this.token = token;
  }

  create<K extends keyof ElementOptions, V extends ElementOptions[K]>(
    elementType: ElementType,
    options: V
  ) {
    switch (elementType) {
      case "proof-gen": {
        return new ProofGenElement(options as ProofGenOptions);
      }
      case "zauth-sign-in": {
        return new ProofGenElement({
          proofTypeId: "ZAUTH_1",
          provider: options.provider,
          handleCreateProof: options.handleCreateProof,
        });
      }
    }
  }
}

export type ElementType = "proof-gen" | "zauth-sign-in";

export interface ElementOptions {
  "proof-gen": ProofGenOptions;
  "zauth-sign-in": ZAuthSignInOptions;
}
