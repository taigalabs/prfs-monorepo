import { ethers } from "ethers";
import { PrfsProofType } from "@taigalabs/prfs-entities/bindings/PrfsProofType";

import { handleChildMessage } from "./handle_msg";

const SDK_ENDPOINT = "http://localhost:3010";

class ProofGenElement {
  options: ProofGenElementOptions;

  constructor(options: ProofGenElementOptions) {
    this.options = options;
  }

  async mount(containerName: string): Promise<HTMLIFrameElement> {
    return new Promise((resolve, reject) => {
      const container = document.querySelector(containerName);

      if (!container) {
        console.error(`No target element named, ${containerName}`);

        reject("no target element");
      }

      while (container.firstChild) {
        container.removeChild(container.lastChild);
      }

      const iframe = document.createElement("iframe");
      iframe.src = `${SDK_ENDPOINT}/proof_gen?proofTypeId=${this.options.selectedProofType.proof_type_id}`;
      iframe.style.width = "490px";
      iframe.style.height = "320px";
      iframe.style.border = "none";

      container!.append(iframe);

      handleChildMessage(iframe, resolve, this.options);
    });
  }
}

export default ProofGenElement;

export interface ProofGenElementOptions {
  selectedProofType: PrfsProofType;
  provider: ethers.providers.Web3Provider;
  handleCreateProof: ({ proof, publicInput }) => void;
}
