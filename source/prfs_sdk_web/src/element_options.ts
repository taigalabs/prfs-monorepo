import { ethers } from "ethers";

export interface ProofGenOptions {
  proofTypeId: string;
  circuit_driver_id: string;
  driver_properties: Record<string, any>;
  sdkEndpoint: string;
}

export interface ZAuthSignInOptions {}
