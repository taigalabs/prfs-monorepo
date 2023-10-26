import { ProveReceipt, ProveResult, VerifyReceipt } from "@taigalabs/prfs-driver-interface";

import { MsgEventListener, handleChildMessage } from "./handle_child_msg";
import { sendMsgToChild } from "../msg";
import { ProofGenOptions } from "../sdk/element_options";
import { Msg } from "../msg";
import { ProofGenElementState, ProofGenElementSubscriber, SubscribedMsg } from "./types";
import emit from "./emit";

export const PROOF_GEN_IFRAME_ID = "prfs-sdk-iframe";
export const PORTAL_ID = "prfs-sdk-portal";
const CONTAINER_ID = "prfs-sdk-container";

class ProofGenElement {
  options: ProofGenOptions;
  state: ProofGenElementState;
  subscribers: ProofGenElementSubscriber[];

  constructor(options: ProofGenOptions) {
    this.options = options;
    this.subscribers = [];
    this.state = {
      iframe: undefined,
      driverVersion: undefined,
    };
  }

  async mount(): Promise<HTMLIFrameElement> {
    const { options } = this;
    console.log("Mounting sdk, options: %o", options);

    const { sdkEndpoint } = options;

    if (!sdkEndpoint) {
      throw new Error("SDK endpoint is not defined");
    }

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
    container.id = CONTAINER_ID;
    container.style.width = "0px";
    container.style.height = "0px";

    const iframe = document.createElement("iframe");
    iframe.id = PROOF_GEN_IFRAME_ID;
    iframe.src = `${sdkEndpoint}/proof_gen?proofTypeId=${options.proofTypeId}`;
    iframe.allow = "cross-origin-isolated";
    iframe.style.border = "none";
    iframe.style.display = "none";

    console.log("attaching iframe");
    this.state.iframe = iframe;

    container.appendChild(iframe);

    const oldContainer = document.getElementById(CONTAINER_ID);
    if (oldContainer) {
      oldContainer.remove();
    }
    document.body.appendChild(container);

    await handleChildMessage(this.subscribers);

    const { circuit_driver_id, driver_properties } = options;
    sendMsgToChild(
      new Msg("LOAD_DRIVER", {
        circuit_driver_id,
        driver_properties,
      }),
      iframe
    ).then(driverVersion => {
      this.state.driverVersion = driverVersion;

      emit(this.subscribers, {
        type: "DRIVER_LOADED",
        data: driverVersion,
      });
    });

    return this.state.iframe;
  }

  async createProof(inputs: any, circuitTypeId: string): Promise<ProveReceipt> {
    if (!this.state.iframe) {
      throw new Error("iframe is not created");
    }

    try {
      const proveReceipt = await sendMsgToChild(
        new Msg("CREATE_PROOF", {
          inputs,
          circuitTypeId,
        }),
        this.state.iframe
      );

      return proveReceipt;
    } catch (err) {
      throw new Error(`Error creating proof: ${err}`);
    }
  }

  async verifyProof(proveResult: ProveResult, circuitTypeId: string): Promise<VerifyReceipt> {
    if (!this.state.iframe) {
      throw new Error("iframe is not created");
    }

    try {
      const verifyReceipt = await sendMsgToChild(
        new Msg("VERIFY_PROOF", {
          proveResult,
          circuitTypeId,
        }),
        this.state.iframe
      );

      return verifyReceipt;
    } catch (err) {
      throw new Error(`Error creating proof: ${err}`);
    }
  }

  async hash(args: bigint[]): Promise<bigint> {
    if (!this.state.iframe) {
      throw new Error("iframe is not created");
    }

    try {
      const resp = await sendMsgToChild(
        new Msg("HASH", {
          msg: args,
        }),
        this.state.iframe
      );

      return resp.msgHash;
    } catch (err) {
      throw new Error(`Error creating proof: ${err}`);
    }
  }

  subscribe(subscriber: (type: SubscribedMsg) => void): ProofGenElement {
    this.subscribers.push(subscriber);

    return this;
  }
}

export default ProofGenElement;
