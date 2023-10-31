import { CreateProofEvent, LoadDriverEvent } from "@taigalabs/prfs-driver-interface";

export interface ProofGenElementState {
  iframe: HTMLIFrameElement | undefined;
  driverVersion: string | undefined;
}

export type ProofGenElementSubscriber = (msg: ProofGenEvent) => void;

export type ProofGenEvent = CreateProofEvent | LoadDriverEvent | LoadDriverSuccessEvent;

export interface LoadDriverSuccessEvent {
  type: "LOAD_DRIVER_SUCCESS";
  payload: any;
}
