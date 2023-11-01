import {
  CreateProofEvent,
  LoadDriverEvent,
  LoadDriverSuccessEvent,
} from "@taigalabs/prfs-driver-interface";

export interface ProofGenElementState {
  iframe: HTMLIFrameElement | undefined;
  circuitDriverId: string | undefined;
  artifactCount: number | undefined;
}

export type ProofGenElementSubscriber = (msg: ProofGenEvent) => void;

export type ProofGenEvent = CreateProofEvent | LoadDriverEvent | LoadDriverSuccessEvent;
