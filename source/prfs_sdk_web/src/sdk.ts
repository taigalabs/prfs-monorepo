import { PrfsProofType } from "@taigalabs/prfs-entities/bindings/PrfsProofType";
import { Msg } from "./msg";

const sdkEndpoint = "http://localhost:3010";

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

export class ProofGenElement {
  selectedProofType: PrfsProofType;

  constructor(options: { selectedProofType: PrfsProofType }) {
    this.selectedProofType = options.selectedProofType;
  }

  mount(containerName: string) {
    const container = document.querySelector(containerName);

    if (!container) {
      console.error(`No target element named, ${containerName}`);
      return;
    }

    const iframe = document.createElement("iframe");
    iframe.src = `${sdkEndpoint}/proof_gen?proofTypeId=${this.selectedProofType.proof_type_id}`;

    window.addEventListener("message", (e: MessageEvent) => {
      console.log("child says, %o", e.data);
    });

    container.append(iframe);

    setTimeout(() => {
      if (iframe.contentWindow) {
        iframe.contentWindow.postMessage(
          {
            data: "power",
          },
          "*"
        );
      }
    }, 1000);
  }
}

export type ElementType = "proof-gen";

export interface ElementOptions {
  "proof-gen": {
    selectedProofType: PrfsProofType;
  };
}
