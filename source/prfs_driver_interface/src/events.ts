export type DriverEvent = LoadDriverEvent | CreateProofEvent | VerifyProofEvent;

export type DriverEventListener = (ev: DriverEvent) => void;

export interface LoadDriverEvent {
  type: "LOAD_DRIVER_EVENT";
  payload: LoadDriverEventPayload;
}

export interface LoadDriverEventPayload {
  error?: string;
  asset_label?: string;
  progress?: number;
}

export interface LoadDriverSuccessEvent {
  type: "LOAD_DRIVER_SUCCESS";
  payload: LoadDriverSuccessEventPayload;
}

export interface LoadDriverSuccessEventPayload {
  circuitDriverId: string;
  artifactCount: number;
}

export interface CreateProofEvent {
  type: "CREATE_PROOF_EVENT";
  payload: any;
}

export interface VerifyProofEvent {
  type: "VERIFY_PROOF_EVENT";
  payload: any;
}
