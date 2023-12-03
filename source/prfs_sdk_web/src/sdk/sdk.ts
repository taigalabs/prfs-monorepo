import { ProofGenOptions, UtilsOptions, ZAuthSignInOptions } from "../sdk/element_options";
import ProofGenElement from "../elems/proof_gen_element/proof_gen_element";
import UtilsElement from "@/elems/utils_element/utils_element";

export class PrfsSDK {
  token: string;

  constructor(token: string) {
    this.token = token;
  }

  async create<K extends keyof ElementOptions, V extends ElementOptions[K]>(
    elementType: ElementType,
    options: V,
  ): Promise<any> {
    try {
      switch (elementType) {
        case "proof-gen": {
          const elem = new ProofGenElement(options as ProofGenOptions);
          await elem.mount();

          return elem;
        }
        case "utils": {
          const elem = new UtilsElement(options as UtilsOptions);
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

export type ElementType = "proof-gen" | "zauth-sign-in" | "zauth-sign-up" | "utils";

export interface ElementOptions {
  "proof-gen": ProofGenOptions;
  utils: UtilsOptions;
  "zauth-sign-in": ZAuthSignInOptions;
}
