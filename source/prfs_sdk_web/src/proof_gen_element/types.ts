export interface ProofGenElementState {
  iframe: HTMLIFrameElement | undefined;
  driverVersion: string | undefined;
}

export type ProofGenElementSubscriber = (msg: SubscribedMsg) => void;

export interface SubscribedMsg {
  type: SubscribedMsgType;
  payload: any;
}

export type SubscribedMsgType = "LOAD_DRIVER" | "CREATE_PROOF_EVENT" | "LOAD_DRIVER_EVENT";
