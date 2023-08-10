import { ethers } from "ethers";
import { PrfsProofType } from "@taigalabs/prfs-entities/bindings/PrfsProofType";

import { handleChildMessage } from "./handle_msg";
import { sendMsgToChild } from "./send_msg";

const LOADING_SPAN_ID = "prfs-sdk-loading";
const SDK_ENDPOINT = "http://localhost:3010";

class ProofGenElement {
  options: ProofGenElementOptions;

  constructor(options: ProofGenElementOptions) {
    this.options = options;
  }

  async mount(containerName: string): Promise<HTMLIFrameElement> {
    const { options } = this;

    return new Promise((resolve, reject) => {
      const container = document.querySelector(containerName);

      if (!container) {
        console.error(`No target element named, ${containerName}`);

        reject("no target element");
      }

      while (container!.firstChild) {
        container!.removeChild(container!.lastChild!);
      }

      const loadingSpan = document.createElement("span");
      loadingSpan.id = LOADING_SPAN_ID;
      loadingSpan.innerText = "PRFS SDK is launching...";
      loadingSpan.style.position = "absolute";
      loadingSpan.style.top = "12px";
      loadingSpan.style.left = "12px";

      const iframe = document.createElement("iframe");
      iframe.src = `${SDK_ENDPOINT}/proof_gen?proofTypeId=${options.proofType.proof_type_id}`;
      iframe.allow = "cross-origin-isolated";
      iframe.style.width = "490px";
      iframe.style.height = "320px";
      iframe.style.border = "1px solid black;";
      iframe.onload = () => {
        const loadingSpan = document.getElementById(LOADING_SPAN_ID);

        if (loadingSpan) {
          loadingSpan.style.display = "none";
        }
      };

      const wrapperDiv = document.createElement("div");
      wrapperDiv.style.position = "relative";

      wrapperDiv.appendChild(loadingSpan);
      wrapperDiv.appendChild(iframe);

      container!.append(wrapperDiv);
      handleChildMessage(resolve, options);
    });
  }
}

export default ProofGenElement;

export interface ProofGenElementOptions {
  proofType: PrfsProofType;
  provider: ethers.providers.Web3Provider;
  handleCreateProof: ({ proof, publicInput }: any) => void;
  prfsAssetEndpoint: string;
  prfsApiEndpoint: string;
}
