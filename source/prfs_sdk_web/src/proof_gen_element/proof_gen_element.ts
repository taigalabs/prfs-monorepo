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
  msgEventListener: any;
} = {
  msgEventListener: undefined,
};

class ProofGenElement {
  options: ProofGenOptions;
  state: ProofGenElementState;

  constructor(options: ProofGenOptions) {
    this.options = options;
    this.state = {
      calcWidth: 484,
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

  async mount(_containerId?: string): Promise<HTMLIFrameElement> {
    const { options } = this;
    const containerId = _containerId || CONTAINER_ID;

    return new Promise((resolve, reject) => {
      const container = document.querySelector(containerId) as HTMLDivElement;
      // const { calcHeight, calcWidth } = this.state;
      // const wrapperZIndex = options.wrapperZIndex || "200";

      if (!container) {
        console.error(`No target element named, ${containerId}`);
        reject("no target element");
      }

      while (container!.firstChild) {
        container!.removeChild(container!.lastChild!);
      }

      container.style.position = "relative";

      const iframe = document.createElement("iframe");
      iframe.id = PROOF_GEN_IFRAME_ID;
      iframe.src = `${SDK_ENDPOINT}/embed/proof_gen?proofTypeId=${options.proofTypeId}`;
      iframe.allow = "cross-origin-isolated";
      iframe.style.border = "none";
      // iframe.style.transition = "height 0.35s ease 0s, opacity 0.4s ease 0.1s";
      iframe.style.position = "absolute";
      iframe.style.width = "100%";
      iframe.style.height = "100%";

      // const placeholderDiv = document.createElement("div");
      // placeholderDiv.id = PLACEHOLDER_ID;
      // placeholderDiv.innerText = "PRFS SDK is launching...";
      // placeholderDiv.style.padding = "12px";
      // placeholderDiv.style.width = `${calcWidth}px`;
      // placeholderDiv.style.height = `${calcHeight}px`;
      // placeholderDiv.style.transition = "height 0.35s ease 0s, opacity 0.4s ease 0.1s";

      const wrapperDiv = document.createElement("div");
      wrapperDiv.style.position = "absolute";
      // wrapperDiv.style.zIndex = "110";
      // wrapperDiv.style.width = `${calcWidth}px`;
      // wrapperDiv.style.border = `1px solid black`;
      // wrapperDiv.style.height = `${calcHeight}px`;
      // wrapperDiv.style.transition = "height 0.35s ease 0s, opacity 0.4s ease 0.1s";
      // wrapperDiv.style.overflow = "hidden";
      // wrapperDiv.style.zIndex = wrapperZIndex;

      // wrapperDiv.appendChild(msgSpan);
      wrapperDiv.appendChild(iframe);

      container.appendChild(wrapperDiv);
      // container.appendChild(placeholderDiv);

      // const portal = document.createElement("div");
      // portal.id = PORTAL_ID;
      // portal.style.position = "fixed";

      this.state.iframe = iframe;
      // this.state.msgSpan = msgSpan;
      // this.state.placeholderDiv = placeholderDiv;
      this.state.wrapperDiv = wrapperDiv;
      // this.state.portalDiv = portal;

      document.body.appendChild(container);

      if (singleton.msgEventListener) {
        console.warn("Remove already registered Prfs sdk message event listener");

        window.removeEventListener("message", singleton.msgEventListener);
      }

      console.log("listening child messages");

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
  calcHeight: number;
  calcWidth: number;
  wrapperDiv: HTMLDivElement | undefined;
  iframe: HTMLIFrameElement | undefined;
  placeholderDiv: HTMLDivElement | undefined;
  portalDiv: HTMLDivElement | undefined;
}
