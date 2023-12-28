import { ProofGenElement, ProofGenOptions } from "./elems/proof_gen/element";
import DefaultElement, { DefaultOptions } from "./elems/default/element";

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
        case "default": {
          const elem = new DefaultElement(options as DefaultOptions);
          await elem.mount();

          return elem;
        }
        default:
          throw new Error(`Not supported element type, ${elementType}`);
      }
    } catch (err) {
      console.error(err);

      throw new Error(`Error creating prfs SDK ${err}`);
    }
  }
}

export type ElementType = "proof_gen" | "default";

export type SDKElement<T> = //
  T extends "proof_gen" ? ProofGenElement : T extends "default" ? DefaultElement : never;

export interface ElementOptions {
  proof_gen: ProofGenOptions;
  utils: DefaultOptions;
}
