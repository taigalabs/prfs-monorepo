import { sendMsgToChild, Msg } from "../../msg";
import { DefaultElementState, DefaultEvent } from "./types";
import emit, { EventSubscriber } from "../../msg/emit";
import { handleChildMessage } from "./handle_child_msg";
import { checkIfLive } from "../../utils/sanity";

export const UTILS_IFRAME_ID = "prfs-sdk-utils-iframe";
const CONTAINER_ID = "prfs-sdk-container";

export interface DefaultOptions {
  sdkEndpoint: string;
}

class DefaultElement {
  options: DefaultOptions;
  state: DefaultElementState;
  subscribers: EventSubscriber<DefaultEvent>[];

  constructor(options: DefaultOptions) {
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
      await checkIfLive(sdkEndpoint);
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
    container.appendChild(iframe);
    this.state.iframe = iframe;

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

  subscribe(subscriber: (ev: DefaultEvent) => void): DefaultElement {
    this.subscribers.push(subscriber);

    return this;
  }
}

export default DefaultElement;
