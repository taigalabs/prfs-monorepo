import React from "react";
import { CircuitInput } from "@taigalabs/prfs-entities/bindings/CircuitInput";
import { PrfsIdCredential, QueryPresetVals } from "@taigalabs/prfs-id-sdk-web";

import styles from "./CircuitInputs.module.scss";
import { i18nContext } from "@/i18n/context";
import MerkleProofInput from "@/components/circuit_inputs_variants/merkle_proof_input/MerkleProofInput";
import SigDataInput from "@/components/circuit_inputs_variants/sig_data_input/SigDataInput";
import { FormInput, FormInputTitleRow } from "@/components/form_input/FormInput";
import HashInput from "@/components/circuit_inputs_variants/hash_input/HashInput";
import MerkleSigPosRangeInput from "@/components/circuit_inputs_variants/merkle_sig_pos_range/MerkleSigPosRangeInput";

const CircuitInputs: React.FC<CircuitInputsProps> = ({
  circuitInputs,
  formValues,
  formErrors,
  setFormValues,
  setFormErrors,
  presetVals,
  credential,
}) => {
  const i18n = React.useContext(i18nContext);

  const circuitInputsElem = React.useMemo(() => {
    const entriesElem = [];
    for (const [idx, input] of circuitInputs.entries()) {
      switch (input.type) {
        case "MERKLE_PROOF_1": {
          entriesElem.push(
            <MerkleProofInput
              key={idx}
              circuitInput={input}
              value={formValues[input.name] as any}
              error={formErrors[input.name]}
              setFormValues={setFormValues}
              setFormErrors={setFormErrors}
              presetVals={presetVals}
            />,
          );
          break;
        }
        case "SIG_DATA_1": {
          entriesElem.push(
            <SigDataInput
              key={idx}
              circuitInput={input}
              value={formValues[input.name] as any}
              error={formErrors[input.name]}
              setFormValues={setFormValues}
              setFormErrors={setFormErrors}
              presetVals={presetVals}
              credential={credential}
            />,
          );
          break;
        }
        case "HASH_DATA_1": {
          entriesElem.push(
            <HashInput
              key={idx}
              circuitInput={input}
              value={formValues[input.name] as any}
              error={formErrors[input.name]}
              setFormValues={setFormValues}
              setFormErrors={setFormErrors}
              presetVals={presetVals}
            />,
          );
          break;
        }
        case "MERKLE_SIG_POS_RANGE_V1": {
          entriesElem.push(
            <MerkleSigPosRangeInput
              key={idx}
              circuitInput={input}
              value={formValues[input.name] as any}
              error={formErrors[input.name]}
              setFormValues={setFormValues}
              setFormErrors={setFormErrors}
              presetVals={presetVals}
            />,
          );
          break;
        }
        default: {
          console.error(`Currently cannot handle circuit input of this type`);

          entriesElem.push(
            <FormInput key={idx}>
              <FormInputTitleRow>
                <p>{input.label}</p>
              </FormInputTitleRow>
              <input placeholder="Cannot handle circuit input of this type" />
            </FormInput>,
          );
        }
      }
    }

    return entriesElem;
  }, [circuitInputs, formValues, setFormValues, formErrors]);

  return <>{circuitInputsElem}</>;
};

export default CircuitInputs;

export interface CircuitInputsProps {
  circuitInputs: CircuitInput[];
  formValues: Record<string, any>;
  formErrors: Record<string, string>;
  setFormValues: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  setFormErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  presetVals?: QueryPresetVals;
  credential: PrfsIdCredential;
}
