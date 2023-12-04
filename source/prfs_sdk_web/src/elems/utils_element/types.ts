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

export type UtilsElementSubscriber = (msg: UtilsEvent) => void;

export type UtilsEvent = any;
// | CreateProofEvent
// | LoadDriverEvent
// | LoadDriverSuccessEvent
// | VerifyProofEvent;
