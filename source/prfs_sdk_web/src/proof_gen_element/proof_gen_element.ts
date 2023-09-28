import { ethers } from "ethers";
import { ProveReceipt } from "@taigalabs/prfs-driver-interface";

import { handleChildMessage } from "./handle_child_msg";
import { sendMsgToChild } from "../msg";
import { ProofGenOptions, ZAuthSignInOptions } from "../element_options";
import { Msg } from "../msg";

export const PROOF_GEN_IFRAME_ID = "prfs-sdk-iframe";
export const PLACEHOLDER_ID = "prfs-sdk-placeholder";
export const MSG_SPAN_ID = "prfs-sdk-msg";
export const PORTAL_ID = "prfs-sdk-portal";
const SDK_ENDPOINT = "http://localhost:3010";
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
  state: ProofGenElementState;

  constructor(options: ProofGenOptions) {
    this.options = options;
    this.state = {
      clickOutsideIFrameListener: undefined,
      clickOutsideDialogListener: undefined,
      iframe: undefined,
    };
  }

  async mount(): Promise<HTMLIFrameElement | null> {
    const { options } = this;
    console.log("Mounting sdk, options: %o, sdk_endpoint: %s", options, SDK_ENDPOINT);

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
      iframe.src = `${SDK_ENDPOINT}/proof_gen?proofTypeId=${options.proofTypeId}`;
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

    console.log("load driver");

    await sendMsgToChild(
      new Msg("LOAD_DRIVER", {
        circuit_driver_id,
        driver_properties,
      }),
      this.state.iframe!
    );

    return this.state.iframe!;
  }

  async createProof(): Promise<ProveReceipt | null> {
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

  async getFormValues(): Promise<Record<string, any> | null> {
    if (!this.state.iframe) {
      console.error("iframe is not created");
      return null;
    }

    try {
      const formValues = await sendMsgToChild(
        new Msg("GET_FORM_VALUES", undefined),
        this.state.iframe
      );

      return formValues;
    } catch (err) {
      return null;
    }
  }
}

export default ProofGenElement;

export interface ProofGenElementState {
  clickOutsideIFrameListener: ((event: MouseEvent) => void) | undefined;
  clickOutsideDialogListener: ((event: MouseEvent) => void) | undefined;
  iframe: HTMLIFrameElement | undefined;
}
