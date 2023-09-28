import { ProveReceipt } from "@taigalabs/prfs-driver-interface";

import { handleChildMessage } from "./handle_child_msg";
import { sendMsgToChild } from "../msg";
import { ProofGenOptions, ZAuthSignInOptions } from "../element_options";
import { Msg } from "../msg";

export const PROOF_GEN_IFRAME_ID = "prfs-sdk-iframe";
export const PLACEHOLDER_ID = "prfs-sdk-placeholder";
export const MSG_SPAN_ID = "prfs-sdk-msg";
export const PORTAL_ID = "prfs-sdk-portal";
const CONTAINER_ID = "prfs-sdk-container";

const singleton: {
  isMounted: boolean;
  msgEventListener: any;
} = {
  isMounted: false,
  msgEventListener: undefined,
};

class ProofGenElement {
  options: ProofGenOptions;
  public state: ProofGenElementState;

  constructor(options: ProofGenOptions) {
    this.options = options;
    this.state = {
      iframe: undefined,
      driverVersion: undefined,
    };
  }

  async mount(): Promise<HTMLIFrameElement | null> {
    const { options } = this;
    console.log("Mounting sdk, options: %o, ", options);

    const { sdkEndpoint } = options;

    if (singleton.isMounted) {
      return null;
    }

    const containerId = CONTAINER_ID;

    await new Promise(async resolve => {
      const container = document.createElement("div");
      container.id = containerId;
      container.style.position = "relative";

      const iframe = document.createElement("iframe");
      iframe.id = PROOF_GEN_IFRAME_ID;
      iframe.src = `${sdkEndpoint}/proof_gen?proofTypeId=${options.proofTypeId}`;
      iframe.allow = "cross-origin-isolated";
      iframe.style.border = "none";
      this.state.iframe = iframe;

      container.appendChild(iframe);
      document.body.appendChild(container);

      if (singleton.msgEventListener) {
        console.warn("Remove already registered Prfs sdk message event listener");
        window.removeEventListener("message", singleton.msgEventListener);
      }

      console.log("listening child messages");
      const msgEventListener = handleChildMessage(resolve, options, this.state);

      singleton.msgEventListener = msgEventListener;
      singleton.isMounted = true;
    });

    const { circuit_driver_id, driver_properties } = options;

    console.log("send load driver");

    const driverVersion = await sendMsgToChild(
      new Msg("LOAD_DRIVER", {
        circuit_driver_id,
        driver_properties,
      }),
      this.state.iframe!
    );

    console.log("driver version", driverVersion);
    this.state.driverVersion = driverVersion;

    return this.state.iframe!;
  }

  async createProof(args?: Record<string, any>): Promise<ProveReceipt | null> {
    if (!this.state.iframe) {
      console.error("iframe is not created");
      return null;
    }

    try {
      const proofResp = await sendMsgToChild(new Msg("CREATE_PROOF", undefined), this.state.iframe);

      return proofResp;
    } catch (err) {
      return null;
    }
  }
}

export default ProofGenElement;

export interface ProofGenElementState {
  iframe: HTMLIFrameElement | undefined;
  driverVersion: string | undefined;
}
