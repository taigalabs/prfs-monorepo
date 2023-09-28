import { ethers } from "ethers";

export interface ProofGenOptions {
  proofTypeId: string;
  circuit_driver_id: string;
  driver_properties: Record<string, any>;

  // provider: ethers.providers.Web3Provider;
  // handleCreateProof: ({ proof, publicInput }: any) => void;
  // theme?: "dark";
  // wrapperZIndex?: string;
}

export interface ZAuthSignInOptions {
  // provider: ethers.providers.Web3Provider;
  // handleCreateProof: ({ proof, publicInput }: any) => void;
  // theme?: "dark";
  // wrapperZIndex?: string;
}
