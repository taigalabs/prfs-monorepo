import {
  CreateProofEvent,
  LoadDriverEvent,
  LoadDriverSuccessEvent,
  VerifyProofEvent,
} from "@taigalabs/prfs-driver-interface";

export interface UtilsElementState {
  iframe: HTMLIFrameElement | undefined;
  circuitDriverId: string | undefined;
  artifactCount: number | undefined;
}

export type ProofGenElementSubscriber = (msg: ProofGenEvent) => void;

export type ProofGenEvent =
  | CreateProofEvent
  | LoadDriverEvent
  | LoadDriverSuccessEvent
  | VerifyProofEvent;
