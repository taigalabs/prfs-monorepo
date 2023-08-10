import { ethers } from "ethers";
import { PrfsProofType } from "@taigalabs/prfs-entities/bindings/PrfsProofType";

import { handleChildMessage } from "./handle_msg";

const SDK_ENDPOINT = "http://localhost:3010";

class ProofGenElement {
  options: ProofGenElementOptions;
  provider: ethers.providers.Web3Provider;

  constructor(options: ProofGenElementOptions) {
    this.options = options;
    this.provider = new ethers.providers.Web3Provider(window.ethereum);
  }

  async mount(containerName: string): Promise<HTMLIFrameElement> {
    const container = document.querySelector(containerName);

    return new Promise((resolve, reject) => {
      if (!container) {
        console.error(`No target element named, ${containerName}`);

        reject("no target element");
      }

      const iframe = document.createElement("iframe");
      iframe.src = `${SDK_ENDPOINT}/proof_gen?proofTypeId=${this.options.selectedProofType.proof_type_id}`;
      iframe.style.width = "490px";
      iframe.style.height = "320px";
      iframe.style.border = "none";

      container!.append(iframe);

      handleChildMessage(iframe, resolve, this.provider);
    });
  }
}

export default ProofGenElement;

export interface ProofGenElementOptions {
  selectedProofType: PrfsProofType;
  provider: ethers.providers.Web3Provider;
  handleCreateProof: ({ proof, publicInput }) => void;
}
