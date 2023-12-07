import ProofGenElement, { ProofGenOptions } from "../elems/proof_gen_element/proof_gen_element";
import UtilsElement, { UtilsOptions } from "../elems/utils_element/utils_element";

export class PrfsSDK {
  token: string;

  constructor(token: string) {
    this.token = token;
  }

  async create<K extends keyof ElementOptions, V extends ElementOptions[K]>(
    elementType: ElementType,
    options: V,
  ): Promise<SDKElement<ElementType>> {
    try {
      switch (elementType) {
        case "proof_gen": {
          const elem = new ProofGenElement(options as ProofGenOptions);
          await elem.mount();

          return elem;
        }
        case "utils": {
          const elem = new UtilsElement(options as UtilsOptions);
          await elem.mount();

          return elem;
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
        default:
          throw new Error(`Not supported element type, ${elementType}`);
      }
    } catch (err) {
      console.error(err);

      throw new Error(`Error creating prfs SDK ${err}`);
    }
  }
}

export type ElementType = "proof_gen" | "zauth_sign_in" | "zauth_sign_up" | "utils";

export type SDKElement<T> = //
  T extends "proof_gen" ? ProofGenElement : T extends "utils" ? UtilsElement : never;

export interface ElementOptions {
  proof_gen: ProofGenOptions;
  utils: UtilsOptions;
  // zauth_sign_in: ZAuthSignInOptions;
}
