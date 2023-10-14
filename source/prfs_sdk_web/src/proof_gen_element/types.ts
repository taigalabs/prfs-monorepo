export interface ProofGenElementState {
  iframe: HTMLIFrameElement | undefined;
  driverVersion: string | undefined;
}

export type ProofGenElementSubscriber = (msg: SubscribedMsg) => void;

export interface SubscribedMsg {
  type: SubscribedMsgType;
  data: any;
}

export type SubscribedMsgType = "DRIVER_LOADED";
