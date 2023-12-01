// import { CircuitInput } from "@taigalabs/prfs-entities/bindings/CircuitInput";
// import { ethers } from "ethers";
// import { Msg, sendMsgToParent } from "@taigalabs/prfs-sdk-web";
// import { PrfsProofType } from "@taigalabs/prfs-entities/bindings/PrfsProofType";
// import { CircuitInputType } from "@taigalabs/prfs-entities/bindings/CircuitInputType";
// import { HashData } from "@/components/hash_input/HashInput";
// import { SigData, SpartanMerkleProof } from "@taigalabs/prfs-driver-interface";

// export async function validateInputs(
//   formValues: Record<string, any>,
//   proofType: PrfsProofType,
//   setFormErrors: React.Dispatch<React.SetStateAction<Record<string, any>>>,
// ): Promise<Record<string, any> | null> {
//   const formErrors: Record<string, string> = {};

//   let hasError = false;
//   for (const input of proofType.circuit_inputs) {
//     switch (input.type as CircuitInputType) {
//       case "MERKLE_PROOF_1": {
//         const val: SpartanMerkleProof | undefined = formValues[input.name];

//         if (!val) {
//           hasError = true;
//           formErrors[input.name] = "Input is empty";
//         } else {
//           const { root, siblings, pathIndices } = val;

//           if (!root || !siblings || !pathIndices) {
//             hasError = true;
//             formErrors[input.name] = "Merkle path is not provided. Have you put address?";
//           }
//         }

//         break;
//       }

//       case "SIG_DATA_1": {
//         const val: SigData | undefined = formValues[input.name];

//         if (!val) {
//           hasError = true;
//           formErrors[input.name] = "Input is empty";
//         } else {
//           const { sig, msgHash, msgRaw } = val;

//           if (!sig || !msgHash || !msgRaw) {
//             hasError = true;
//             formErrors[input.name] = "Signature is not provided. Have you signed?";
//           }
//         }

//         break;
//       }

//       case "PASSCODE": {
//         // const val = inputs[input.name];
//         // const prfs_pw_msg = `PRFS_PW_${val}`;
//         // const pw_hash = ethers.utils.hashMessage(prfs_pw_msg);

//         // const { sig } = await sendMsgToParent(
//         //   new Msg("GET_SIGNATURE", {
//         //     msgRaw: pw_hash,
//         //   }),
//         // );

//         // newFormValues[input.name] = sig;
//         break;
//       }

//       case "PASSCODE_CONFIRM": {
//         // const val = inputs[input.name];
//         // const val2 = inputs[`${input.name}-confirm`];

//         // if (!val) {
//         //   throw new InputError(input.name, "value does not exist");
//         // }

//         // if (!val2) {
//         //   throw new InputError(`${input.name}-confirm`, "value does not exist");
//         // }

//         // if (val !== val2) {
//         //   throw new InputError(`${input.name}-confirm`, "value not identical");
//         // }

//         // const prfs_pw_msg = `PRFS_PW_${val}`;
//         // const pw_hash = ethers.utils.hashMessage(prfs_pw_msg);

//         // const { sig } = await sendMsgToParent(
//         //   new Msg("GET_SIGNATURE", {
//         //     msgRaw: pw_hash,
//         //   }),
//         // );

//         // newFormValues[input.name] = sig;

//         break;
//       }

//       case "HASH_DATA_1": {
//         const val: HashData | undefined = formValues[input.name];

//         if (!val) {
//           hasError = true;
//           formErrors[input.name] = "Input is invalid";
//         } else {
//           const { msgRaw, msgRawInt, msgHash } = val;

//           if (!msgRaw || !msgRawInt || !msgHash) {
//             hasError = true;
//             formErrors[input.name] =
//               "Hashed outcome should be provided. Have you hashed the input?";
//           }
//         }

//         break;
//       }

//       default: {
//         hasError = true;
//         formErrors[input.name] = "Invalid input";
//         break;
//       }
//     }
//   }

//   if (hasError) {
//     setFormErrors(formErrors);
//     return null;
//   }

//   return formValues;
// }

// export class InputError extends Error {
//   constructor(inputName: string, err: string) {
//     super(err);
//     this.name = inputName;
//   }
// }
