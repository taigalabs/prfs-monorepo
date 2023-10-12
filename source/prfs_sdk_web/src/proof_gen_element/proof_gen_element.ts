import { ProveReceipt } from "@taigalabs/prfs-driver-interface";

import { MsgEventListener, handleChildMessage } from "./handle_child_msg";
import { sendMsgToChild } from "../msg";
import { ProofGenOptions } from "../element_options";
import { Msg } from "../msg";

export const PROOF_GEN_IFRAME_ID = "prfs-sdk-iframe";
export const PORTAL_ID = "prfs-sdk-portal";
const CONTAINER_ID = "prfs-sdk-container";

export enum ProofGenElementStatus {
  UnInitiated,
  InProgress,
  Initialized,
}

const singleton: ProofGenElementSingleton = {
  status: ProofGenElementStatus.UnInitiated,
};

class ProofGenElement {
  options: ProofGenOptions;
  public state: ProofGenElementState;

  constructor(options: ProofGenOptions) {
    this.options = options;
    this.state = {
      iframe: undefined,
      driverVersion: undefined,
      msgEventListener: undefined,
    };
  }

  async mount(): Promise<HTMLIFrameElement | null> {
    if (singleton.status !== ProofGenElementStatus.UnInitiated) {
      console.warn("sdk is not mountable, status: %s", singleton.status);
      return null;
    }

    singleton.status = ProofGenElementStatus.InProgress;

    const { options } = this;
    console.log("Mounting sdk, options: %o, ", options, singleton);

    const { sdkEndpoint } = options;

    if (!sdkEndpoint) {
      console.error("SDK endpoint is not defined");
      return null;
    }

    const containerId = CONTAINER_ID;

    try {
      await fetch(`${sdkEndpoint}/api`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "cors",
      });
    } catch (err) {
      throw new Error("sdk endpoint is not responding");
    }

    const container = document.createElement("div");
    container.id = containerId;
    container.style.width = "0px";
    container.style.height = "0px";

    const iframe = document.createElement("iframe");
    iframe.id = PROOF_GEN_IFRAME_ID;
    iframe.src = `${sdkEndpoint}/proof_gen?proofTypeId=${options.proofTypeId}`;
    iframe.allow = "cross-origin-isolated";
    iframe.style.border = "none";
    iframe.style.display = "none";
    this.state.iframe = iframe;

    container.appendChild(iframe);
    document.body.appendChild(container);

    const msgEventListener = await handleChildMessage(options);
    this.state.msgEventListener = msgEventListener;

    singleton.status = ProofGenElementStatus.Initialized;

    const { circuit_driver_id, driver_properties } = options;

    const driverVersion = await sendMsgToChild(
      new Msg("LOAD_DRIVER", {
        circuit_driver_id,
        driver_properties,
      }),
      iframe
    );

    console.log("driver version", driverVersion);
    this.state.driverVersion = driverVersion;

    return this.state.iframe!;
  }

  async createProof(args: Record<string, any>): Promise<ProveReceipt> {
    if (!this.state.iframe) {
      throw new Error("iframe is not created");
    }

    try {
      const proofResp = await sendMsgToChild(new Msg("CREATE_PROOF", args), this.state.iframe);
      return proofResp;
    } catch (err) {
      throw new Error(`Error creating proof: ${err}`);
    }
  }
}

export default ProofGenElement;

export interface ProofGenElementState {
  iframe: HTMLIFrameElement | undefined;
  driverVersion: string | undefined;
  msgEventListener: MsgEventListener | undefined;
}

export interface ProofGenElementSingleton {
  status: ProofGenElementStatus;
}
