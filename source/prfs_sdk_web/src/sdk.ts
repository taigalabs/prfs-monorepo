import ProofGenElement, { ProofGenElementOptions } from "./proof_gen_element/proof_gen_element";

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
        return new ProofGenElement(options);
      }
    }
  }
}

export type ElementType = "proof-gen";

export interface ElementOptions {
  "proof-gen": ProofGenElementOptions;
}
