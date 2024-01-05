export interface PrfsIdMsg<T> {
  type: PrfsIdMsgType;
  error?: any;
  payload: T;
}

export interface StorageMsg<T> {
  _phantom?: T;
  appId: string;
  // key: string;
  value: string;
}

export interface RequestPayload {
  appId: string;
  data?: any;
}

export interface SignInSuccessPayload {
  account_id: string;
  public_key: string;
}

// export interface CommitmentSuccessPayload {
//   receipt: Record<string, string>;
// }

export interface ProofGenSuccessPayload {
  receipt: Record<string, any>;
}

export interface VerifyProofResultPayload {
  error?: string;
  result: boolean;
}

export type PrfsIdMsgType =
  //
  | "HANDSHAKE"
  | "SIGN_IN_RESULT"
  | "PROOF_GEN_RESULT"
  | "VERIFY_PROOF_RESULT"
  | "REQUEST_SIGN_IN"
  | "REQUEST_PROOF_GEN"
  | "REQUEST_VERIFY_PROOF"
  | "GET_MSG";

export function newPrfsIdMsg<T extends PrfsIdMsgType>(
  type: PrfsIdMsgType,
  payload: MsgPayload<T>,
): PrfsIdMsg<any> {
  return {
    type,
    payload,
  };
}

export function newPrfsIdErrorMsg<T extends PrfsIdMsgType>(
  type: PrfsIdMsgType,
  payload: MsgPayload<T>,
): PrfsIdMsg<any> {
  return {
    type,
    error: payload,
    payload: null,
  };
}

type MsgPayload<T extends PrfsIdMsgType> = //
  T extends "SIGN_IN_RESULT"
    ? StorageMsg<SignInSuccessPayload>
    : T extends "PROOF_GEN_RESULT"
    ? StorageMsg<ProofGenSuccessPayload>
    : T extends "VERIFY_PROOF_RESULT"
    ? StorageMsg<VerifyProofResultPayload>
    : T extends "REQUEST_SIGN_IN"
    ? RequestPayload
    : T extends "REQUEST_PROOF_GEN"
    ? RequestPayload
    : T extends "REQUEST_VERIFY_PROOF"
    ? RequestPayload
    : T extends "GET_MSG"
    ? RequestPayload
    : null;
