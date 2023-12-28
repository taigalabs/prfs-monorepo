import {
  CreateProofEvent,
  LoadDriverEvent,
  LoadDriverSuccessEvent,
  VerifyProofEvent,
} from "@taigalabs/prfs-driver-interface";

export interface DefaultElementState {
  iframe: HTMLIFrameElement | undefined;
  circuitDriverId: string | undefined;
  artifactCount: number | undefined;
}

export type DefaultElementSubscriber = (msg: DefaultEvent) => void;

export type DefaultEvent = any;
// | CreateProofEvent
// | LoadDriverEvent
// | LoadDriverSuccessEvent
// | VerifyProofEvent;
