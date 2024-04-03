export type DriverEvent = LoadDriverEvent | LoadDriverSuccessEvent | LoadDriverErrorEvent;

export type DriverEventListener = (ev: DriverEvent) => void;

export interface LogEventPayload {
  type: "debug" | "info";
  payload: string;
}

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

export interface LoadDriverErrorEvent {
  type: "LOAD_DRIVER_ERROR";
  payload: LoadDriverErrorEventPayload;
}

export interface LoadDriverSuccessEventPayload {
  artifactCount: number;
}

export interface LoadDriverErrorEventPayload {
  message: string;
}

export interface CreateProofEvent {
  type: "CREATE_PROOF_EVENT";
  payload: LogEventPayload;
}

export interface VerifyProofEvent {
  type: "VERIFY_PROOF_EVENT";
  payload: LogEventPayload;
}
