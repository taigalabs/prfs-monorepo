import { ethers } from "ethers";

export interface ProofGenOptions {
  proofTypeId: string;
  provider: ethers.providers.Web3Provider;
  handleCreateProof: ({ proof, publicInput }: any) => void;
}

export interface ZAuthSignInOptions {
  provider: ethers.providers.Web3Provider;
  handleCreateProof: ({ proof, publicInput }: any) => void;
}
