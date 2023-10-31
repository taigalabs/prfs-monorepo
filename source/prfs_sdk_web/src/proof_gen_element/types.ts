export interface ProofGenElementState {
  iframe: HTMLIFrameElement | undefined;
  driverVersion: string | undefined;
}

export type ProofGenElementSubscriber = (msg: ProofGenEvent) => void;

// export interface SubscribedMsg {
//   type: SubscribedMsgType;
//   payload: any;
// }

// export type SubscribedMsgType = "LOAD_DRIVER" | "CREATE_PROOF_EVENT" | "LOAD_DRIVER_EVENT";

export type ProofGenEvent = CreateProofEvent | LoadDriverEvent | LoadDriverSuccessEvent;

export interface CreateProofEvent {
  type: "CREATE_PROOF_EVENT";
  payload: any;
}

export interface LoadDriverEvent {
  type: "LOAD_DRIVER_EVENT";
  payload: any;
}

export interface LoadDriverSuccessEvent {
  type: "LOAD_DRIVER_SUCCESS";
  payload: any;
}
