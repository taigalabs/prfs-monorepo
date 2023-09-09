import { ethers } from "ethers";

import { handleChildMessage } from "./handle_child_msg";
import { sendMsgToChild } from "./send_msg";
import { ProveReceipt } from "@taigalabs/prfs-driver-interface";
import { Msg } from "./msg";

export const PROOF_GEN_IFRAME_ID = "prfs-sdk-iframe";
export const PLACEHOLDER_ID = "prfs-sdk-placeholder";
export const MSG_SPAN_ID = "prfs-sdk-msg";
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
      calcWidth: 494,
      calcHeight: 320,
      clickOutsideIFrameListener: undefined,
      clickOutsideDialogListener: undefined,
      // msgSpan: undefined,
      wrapperDiv: undefined,
      iframe: undefined,
      placeholderDiv: undefined,
      portalDiv: undefined,
    };
  }

  async mount(containerName: string): Promise<HTMLIFrameElement> {
    const { options } = this;

    return new Promise((resolve, reject) => {
      const container = document.querySelector(containerName) as HTMLDivElement;
      const { calcHeight, calcWidth } = this.state;

      if (!container) {
        console.error(`No target element named, ${containerName}`);
        reject("no target element");
      }

      while (container!.firstChild) {
        container!.removeChild(container!.lastChild!);
      }

      container.style.position = "relative";

      // const msgSpan = document.createElement("span");
      // msgSpan.id = MSG_SPAN_ID;
      // msgSpan.innerText = "PRFS SDK is launching...";
      // msgSpan.style.position = "absolute";
      // msgSpan.style.top = "12px";
      // msgSpan.style.left = "12px";

      const iframe = document.createElement("iframe");
      iframe.id = PROOF_GEN_IFRAME_ID;
      iframe.src = `${SDK_ENDPOINT}/proof_gen?proofTypeId=${options.proofTypeId}`;
      iframe.allow = "cross-origin-isolated";
      iframe.style.border = "none";
      // iframe.style.transition = "height 0.35s ease 0s, opacity 0.4s ease 0.1s";
      iframe.style.position = "absolute";
      iframe.style.width = "100%";
      iframe.style.height = "100%";

      const placeholderDiv = document.createElement("div");
      placeholderDiv.id = PLACEHOLDER_ID;
      placeholderDiv.innerText = "PRFS SDK is launching...";
      placeholderDiv.style.padding = "12px";
      placeholderDiv.style.width = `${calcWidth}px`;
      placeholderDiv.style.height = `${calcHeight}px`;
      placeholderDiv.style.transition = "height 0.35s ease 0s, opacity 0.4s ease 0.1s";

      const wrapperDiv = document.createElement("div");
      wrapperDiv.style.position = "absolute";
      wrapperDiv.style.zIndex = "10010";
      wrapperDiv.style.width = `${calcWidth}px`;
      wrapperDiv.style.height = `${calcHeight}px`;
      wrapperDiv.style.transition = "height 0.35s ease 0s, opacity 0.4s ease 0.1s";

      // wrapperDiv.appendChild(msgSpan);
      wrapperDiv.appendChild(iframe);

      container.appendChild(wrapperDiv);
      container.appendChild(placeholderDiv);

      const portal = document.createElement("div");
      portal.id = PORTAL_ID;
      portal.style.position = "fixed";
      document.body.appendChild(portal);

      this.state.iframe = iframe;
      // this.state.msgSpan = msgSpan;
      this.state.placeholderDiv = placeholderDiv;
      this.state.wrapperDiv = wrapperDiv;
      this.state.portalDiv = portal;

      if (singleton.msgEventListener) {
        console.warn("Remove already registered Prfs sdk message event listener");

        window.removeEventListener("message", singleton.msgEventListener);
      }

      const msgEventListener = handleChildMessage(resolve, options, this.state);
      singleton.msgEventListener = msgEventListener;
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
  calcHeight: number;
  calcWidth: number;
  wrapperDiv: HTMLDivElement | undefined;
  // msgSpan: HTMLSpanElement | undefined;
  iframe: HTMLIFrameElement | undefined;
  placeholderDiv: HTMLDivElement | undefined;
  portalDiv: HTMLDivElement | undefined;
}
