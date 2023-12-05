import { sendMsgToChild, Msg } from "../../msg";
import { UtilsElementState, UtilsEvent } from "./types";
import emit, { EventSubscriber } from "../../msg/emit";
import { handleChildMessage } from "./handle_child_msg";

export const UTILS_IFRAME_ID = "prfs-sdk-utils-iframe";
// export const UTILS_PORTAL_ID = "prfs-sdk-utils-portal";
const CONTAINER_ID = "prfs-sdk-container";

export interface UtilsOptions {
  // proofTypeId: string;
  // circuit_driver_id: string;
  // driver_properties: Record<string, any>;
  sdkEndpoint: string;
}

class UtilsElement {
  options: UtilsOptions;
  state: UtilsElementState;
  subscribers: EventSubscriber<UtilsEvent>[];

  constructor(options: UtilsOptions) {
    this.options = options;
    this.subscribers = [];
    this.state = {
      iframe: undefined,
      circuitDriverId: undefined,
      artifactCount: undefined,
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
      await fetch(`${sdkEndpoint}/`, {
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
    iframe.id = UTILS_IFRAME_ID;
    iframe.src = `${sdkEndpoint}/sdk?elem=utils`;
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

    return this.state.iframe;
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
        this.state.iframe,
      );

      return resp.msgHash;
    } catch (err) {
      throw new Error(`Error creating proof: ${err}`);
    }
  }

  subscribe(subscriber: (ev: UtilsEvent) => void): UtilsElement {
    this.subscribers.push(subscriber);

    return this;
  }
}

export default UtilsElement;
