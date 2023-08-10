import { ethers } from "ethers";
import { CircuitDriver } from "@taigalabs/prfs-driver-interface";
import { PrfsProofType } from "@taigalabs/prfs-entities/bindings/PrfsProofType";

import { handleChildMessage } from "./handle_msg";
// import { initDriver } from "./driver";
import { sendMsgToChild } from "./send_msg";
import { DriverLoadResultMsg } from "./msg";

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

      const iframe = document.createElement("iframe");
      iframe.src = `${SDK_ENDPOINT}/proof_gen?proofTypeId=${options.proofType.proof_type_id}`;
      iframe.allow = "cross-origin-isolated";
      iframe.style.width = "490px";
      iframe.style.height = "320px";
      iframe.style.border = "none";

      container!.append(iframe);

      handleChildMessage(resolve, options);

      // initDriver(options).then(async driver => {
      //   const _reply = await sendMsgToChild(
      //     new DriverLoadResultMsg(options.proofType.proof_type_id),
      //     iframe
      //   );

      //   state.driver = driver;
      // });
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
