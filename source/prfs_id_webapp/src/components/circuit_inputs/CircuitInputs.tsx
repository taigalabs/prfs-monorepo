import React from "react";
import { CircuitTypeData } from "@taigalabs/prfs-circuit-interface/bindings/CircuitTypeData";
import { PrfsIdCredential, QueryPresetVals } from "@taigalabs/prfs-id-sdk-web";

import styles from "./CircuitInputs.module.scss";
import { i18nContext } from "@/i18n/context";
import { FormInput, FormInputTitleRow } from "@/components/form_input/FormInput";
import { PrfsProofType } from "@taigalabs/prfs-entities/bindings/PrfsProofType";
import MerkleSigPosRangeInput from "@/components/circuit_types/merkle_sig_pos_range_v1/MerkleSigPosRangeInput";
import { MerkleSigPosRangeV1Data } from "@taigalabs/prfs-circuit-interface/bindings/MerkleSigPosRangeV1Data";
import { SpartanMerkleProof } from "@taigalabs/prfs-circuit-interface/bindings/SpartanMerkleProof";
import { MerkleSigPosRangeV1Inputs } from "@taigalabs/prfs-circuit-interface/bindings/MerkleSigPosRangeV1Inputs";
import { Transmuted } from "../circuit_types/formErrorTypes";

const CircuitInputs: React.FC<CircuitInputsProps> = ({
  proofType,
  formValues,
  formErrors,
  setFormValues,
  setFormErrors,
  presetVals,
  credential,
}) => {
  const i18n = React.useContext(i18nContext);

  const circuitInputsElem = React.useMemo(() => {
    switch (proofType.circuit_type_id) {
      case "merkle_sig_pos_range_v1": {
        return (
          <MerkleSigPosRangeInput
            circuitTypeData={proofType.circuit_type_data as MerkleSigPosRangeV1Data}
            value={formValues as MerkleSigPosRangeV1Inputs}
            error={formErrors as Transmuted<MerkleSigPosRangeV1Inputs>}
            setFormValues={setFormValues}
            setFormErrors={setFormErrors as any}
            presetVals={presetVals}
            credential={credential}
          />
        );
      }
      default:
        return null;
    }

    // console.log(22, proofType);
    // for (const [idx, input] of circuitInputs.entries()) {
    //   switch (input.type) {
    //     case "MERKLE_PROOF_1": {
    //       entriesElem.push(
    //         <MerkleProofInput
    //           key={idx}
    //           circuitInput={input}
    //           value={formValues[input.name] as any}
    //           error={formErrors[input.name]}
    //           setFormValues={setFormValues}
    //           setFormErrors={setFormErrors}
    //           presetVals={presetVals}
    //         />,
    //       );
    //       break;
    //     }
    //     case "SIG_DATA_1": {
    //       entriesElem.push(
    //         <SigDataInput
    //           key={idx}
    //           circuitInput={input}
    //           value={formValues[input.name] as any}
    //           error={formErrors[input.name]}
    //           setFormValues={setFormValues}
    //           setFormErrors={setFormErrors}
    //           presetVals={presetVals}
    //           credential={credential}
    //         />,
    //       );
    //       break;
    //     }
    //     case "HASH_DATA_1": {
    //       entriesElem.push(
    //         <HashInput
    //           key={idx}
    //           circuitInput={input}
    //           value={formValues[input.name] as any}
    //           error={formErrors[input.name]}
    //           setFormValues={setFormValues}
    //           setFormErrors={setFormErrors}
    //           presetVals={presetVals}
    //         />,
    //       );
    //       break;
    //     }
    //     case "MERKLE_SIG_POS_RANGE_V1": {
    //       entriesElem.push(
    //         <MerkleSigPosRangeInput
    //           key={idx}
    //           circuitInput={input}
    //           value={formValues[input.name] as any}
    //           error={formErrors[input.name]}
    //           setFormValues={setFormValues}
    //           setFormErrors={setFormErrors}
    //           presetVals={presetVals}
    //           credential={credential}
    //         />,
    //       );
    //       break;
    //     }
    //     default: {
    //       console.error(`Currently cannot handle circuit input of this type`);

    //       entriesElem.push(
    //         <FormInput key={idx}>
    //           <FormInputTitleRow>
    //             <p>{input.label}</p>
    //           </FormInputTitleRow>
    //           <input placeholder="Cannot handle circuit input of this type" />
    //         </FormInput>,
    //       );
    //     }
    //   }
    // }
  }, [proofType, formValues, setFormValues, formErrors]);

  return <>{circuitInputsElem}</>;
};

export default CircuitInputs;

export interface CircuitInputsProps {
  proofType: PrfsProofType;
  formValues: Record<string, any>;
  formErrors: Record<string, string>;
  setFormValues: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  setFormErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  presetVals?: QueryPresetVals;
  credential: PrfsIdCredential;
}
