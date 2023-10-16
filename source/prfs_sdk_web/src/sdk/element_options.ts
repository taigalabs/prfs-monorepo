import { LogEventType } from "@taigalabs/prfs-driver-interface";

export interface ProofGenOptions {
  proofTypeId: string;
  circuit_driver_id: string;
  driver_properties: Record<string, any>;
  sdkEndpoint: string;
  proofGenEventListener: (type: LogEventType, msg: string) => void;
}

export interface ZAuthSignInOptions {
  proofTypeId: string;
  circuit_driver_id: string;
  driver_properties: Record<string, any>;
  sdkEndpoint: string;
  proofGenEventListener: (type: LogEventType, msg: string) => void;
}
