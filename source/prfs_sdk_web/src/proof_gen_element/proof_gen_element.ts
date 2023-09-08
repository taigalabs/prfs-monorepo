import { ethers } from "ethers";

import { handleChildMessage } from "./handle_child_msg";
import { sendMsgToChild } from "./send_msg";
import { ProveReceipt } from "@taigalabs/prfs-driver-interface";
import { Msg } from "./msg";

export const PROOF_GEN_IFRAME_ID = "prfs-sdk-iframe";
export const PLACEHOLDER_ID = "prfs-sdk-placeholder";
export const LOADING_SPAN_ID = "prfs-sdk-loading";
export const PORTAL_ID = "prfs-sdk-portal";
const SDK_ENDPOINT = "http://localhost:3010";

const singleton: {
  msgEventListener: any;
} = {
  msgEventListener: undefined,
};

class ProofGenElement {
  options: ProofGenElementOptions;
  state: ProofGenElementState;

  constructor(options: ProofGenElementOptions) {
    this.options = options;
    this.state = {
      clickOutsideIFrameListener: undefined,
      clickOutsideDialogListener: undefined,
      iframe: undefined,
      wrapper: undefined,
      portal: undefined,
    };
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
      iframe.id = PROOF_GEN_IFRAME_ID;
      iframe.src = `${SDK_ENDPOINT}/proof_gen?proofTypeId=${options.proofTypeId}`;
      iframe.allow = "cross-origin-isolated";
      iframe.style.width = "494px";
      iframe.style.height = "320px";
      iframe.style.border = "none";
      iframe.style.transition = "height 0.35s ease 0s, opacity 0.4s ease 0.1s";
      iframe.style.position = "absolute";
      iframe.style.inset = "0px";

      const placeholderDiv = document.createElement("div");
      placeholderDiv.id = PLACEHOLDER_ID;
      placeholderDiv.style.width = "494px";
      placeholderDiv.style.height = "320px";

      const wrapperDiv = document.createElement("div");
      wrapperDiv.style.position = "relative";

      wrapperDiv.appendChild(loadingSpan);
      wrapperDiv.appendChild(iframe);
      // wrapperDiv.appendChild(placeholderDiv);

      container!.append(wrapperDiv);

      if (singleton.msgEventListener) {
        console.warn("Remove already registered Prfs sdk message event listener");

        window.removeEventListener("message", singleton.msgEventListener);
      }

      const msgEventListener = handleChildMessage(resolve, options, this.state);
      singleton.msgEventListener = msgEventListener;

      this.state.iframe = iframe;

      const portal = document.createElement("div");
      portal.id = PORTAL_ID;
      portal.style.position = "fixed";

      document.body.appendChild(portal);

      this.state.portal = portal;
    });
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
}

export default ProofGenElement;

export interface ProofGenElementOptions {
  proofTypeId: string;
  provider: ethers.providers.Web3Provider;
  handleCreateProof: ({ proof, publicInput }: any) => void;
}

export interface ProofGenElementState {
  clickOutsideIFrameListener: ((event: MouseEvent) => void) | undefined;
  clickOutsideDialogListener: ((event: MouseEvent) => void) | undefined;
  iframe: HTMLIFrameElement | undefined;
  wrapper: HTMLDivElement | undefined;
  portal: HTMLDivElement | undefined;
}
