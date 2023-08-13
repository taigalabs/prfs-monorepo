export enum MsgType {
  HANDSHAKE = "HANDSHAKE",
  HANDSHAKE_RESPONSE = "HANDSHAKE_RESPONSE",
  GET_ADDRESS = "GET_ADDRESS",
  GET_ADDRESS_RESPONSE = "GET_ADDRESS_RESPONSE",
  GET_SIGNATURE = "GET_SIGNATURE",
  GET_SIGNATURE_RESPONSE = "GET_SIGNATURE_RESPONSE",
  CREATE_PROOF = "CREATE_PROOF",
  CREATE_PROOF_RESPONSE = "CREATE_PROOF_RESPONSE",
  DRIVER_LOAD_RESULT = "DRIVER_LOAD_RESULT",
  DRIVER_LOAD_RESULT_RESPONSE = "DRIVER_LOAD_RESULT_RESPONSE",
}

export class MsgBase<T, R> {
  error?: any;
  type: MsgType;
  payload: T | undefined;
  _type?: R;

  constructor(type: MsgType, payload: T, error?: any) {
    this.type = type;
    this.payload = payload;
    this.error = error;
  }
}

export class HandshakeMsg extends MsgBase<HandshakePayload, HandshakeResponsePayload> {
  constructor(payload: HandshakePayload) {
    super(MsgType.HANDSHAKE, payload);
  }
}

export class HandshakeResponseMsg extends MsgBase<HandshakeResponsePayload, never> {
  constructor(payload: HandshakeResponsePayload) {
    super(MsgType.HANDSHAKE_RESPONSE, payload);
  }
}

export interface HandshakePayload {
  height: number;
}

export interface HandshakeResponsePayload {
  // prfsAssetEndpoint: string;
}

export class GetAddressMsg extends MsgBase<string, string> {
  constructor(payload: string) {
    super(MsgType.GET_ADDRESS, payload);
  }
}

export class GetAddressResponseMsg extends MsgBase<string, never> {
  constructor(payload: string) {
    super(MsgType.GET_ADDRESS_RESPONSE, payload);
  }
}

export class GetSignatureMsg extends MsgBase<Buffer, string> {
  constructor(payload: Buffer) {
    super(MsgType.GET_SIGNATURE, payload);
  }
}

export class GetSignatureResponseMsg extends MsgBase<string, never> {
  constructor(payload: string) {
    super(MsgType.GET_SIGNATURE_RESPONSE, payload);
  }
}

// export class CreateProofMsg implements MsgInterface<CreateProofPayload> {
//   type: MsgType;
//   payload: CreateProofPayload;

//   constructor(sig: Buffer, msgHash: Buffer, merkleProof: any) {
//     this.type = MsgType.CREATE_PROOF;
//     this.payload = {
//       sig,
//       msgHash,
//       merkleProof,
//     };
//   }
// }

// export class DriverLoadResultMsg implements MsgInterface<DriverLoadResultPayload> {
//   type: MsgType;
//   payload: DriverLoadResultPayload;

//   constructor(driverId: string) {
//     this.type = MsgType.DRIVER_LOAD_RESULT;
//     this.payload = {
//       driverId,
//     };
//   }
// }

// export interface DriverLoadResultPayload {
//   driverId: string;
// }

// export interface CreateProofPayload {
//   sig: Buffer;
//   msgHash: Buffer;
//   merkleProof: any;
// }

// export class CreateProofResponseMsg implements MsgInterface<CreateProofResponsePayload> {
//   error?: string;
//   type: MsgType;
//   payload: CreateProofResponsePayload | undefined;

//   constructor(error?: string, payload?: CreateProofResponsePayload) {
//     this.type = MsgType.CREATE_PROOF_RESPONSE;
//     this.error = error;
//     this.payload = payload;
//   }
// }

// export interface CreateProofResponsePayload {
//   proof: Uint8Array;
//   publicInput: any;
// }
