import React from "react";
import { CircuitInput } from "@taigalabs/prfs-entities/bindings/CircuitInput";

import styles from "./CircuitInputs.module.scss";
import { i18nContext } from "@/i18n/context";
import MerkleProofInput from "@/components/merkle_proof_input/MerkleProofInput";
import SigDataInput from "@/components/sig_data_input/SigDataInput";
import { FormInput, FormInputTitleRow } from "@/components/form_input/FormInput";
import HashInput from "@/components/hash_input/HashInput";
import { QueryPresetVals } from "@taigalabs/prfs-id-sdk-web";

const CircuitInputs: React.FC<CircuitInputsProps> = ({
  circuitInputs,
  formValues,
  formErrors,
  setFormValues,
  setFormErrors,
  presetVals,
}) => {
  const i18n = React.useContext(i18nContext);

  // const handleChangeValue = React.useCallback(
  //   (ev: React.ChangeEvent<HTMLInputElement>) => {
  //     const { name } = ev.target;

  //     setFormValues(oldVals => {
  //       return {
  //         ...oldVals,
  //         [name]: ev.target.value,
  //       };
  //     });
  //   },
  //   [setFormValues],
  // );

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
        default: {
          console.error(`Cannot handle circuit input of this type`);

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
}
