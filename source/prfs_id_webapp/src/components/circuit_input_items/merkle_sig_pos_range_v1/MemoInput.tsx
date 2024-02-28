import React from "react";
import { MerkleSigPosRangeV1Data } from "@taigalabs/prfs-circuit-interface/bindings/MerkleSigPosRangeV1Data";
import { MerkleSigPosRangeV1Inputs } from "@taigalabs/prfs-circuit-interface/bindings/MerkleSigPosRangeV1Inputs";
import { QueryPresetVals } from "@taigalabs/prfs-id-sdk-web";

import styles from "./MemoInput.module.scss";
import {
  FormError,
  FormInputTitle,
  FormInputTitleRow,
  InputWrapper,
} from "@/components/form_input/FormInput";
import { useI18N } from "@/i18n/context";
import { FormErrors, FormValues } from "@/components/circuit_input_items/formErrorTypes";

const MemoInput: React.FC<RangeSelectProps> = ({
  circuitTypeData,
  value,
  presetVals,
  setFormValues,
  setFormErrors,
  error,
}) => {
  const i18n = useI18N();
  const [isPresetVals, setIsPresetVals] = React.useState(false);

  React.useEffect(() => {
    if (presetVals && presetVals.nonce) {
      setFormValues(oldVals => ({
        ...oldVals,
        nonce: presetVals.nonce,
      }));
      setIsPresetVals(true);
    }
  }, [setFormValues, presetVals, setIsPresetVals]);

  const handleChangeNonce = React.useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = ev.target;

      setFormValues(oldVal => ({
        ...oldVal,
        nonce: value,
      }));

      if (error?.nonce !== undefined) {
        setFormErrors(oldVal => ({ ...oldVal, nonce: undefined }));
      }
    },
    [setFormValues, setFormErrors, error],
  );

  return (
    <>
      <FormInputTitleRow>
        <FormInputTitle>{i18n.memo}</FormInputTitle>
      </FormInputTitleRow>
      <InputWrapper>
        <input
          className={styles.input}
          placeholder={i18n.leave_anything_that_makes_a_proof_unique}
          value={value.nonce || ""}
          onChange={handleChangeNonce}
          disabled={isPresetVals}
        />
      </InputWrapper>
      {error?.nonce && <FormError>{error.nonce}</FormError>}
    </>
  );
};

export default MemoInput;

export interface RangeSelectProps {
  circuitTypeData: MerkleSigPosRangeV1Data;
  value: FormValues<MerkleSigPosRangeV1Inputs>;
  presetVals?: QueryPresetVals;
  setFormValues: React.Dispatch<React.SetStateAction<MerkleSigPosRangeV1Inputs>>;
  setFormErrors: React.Dispatch<React.SetStateAction<FormErrors<MerkleSigPosRangeV1Inputs>>>;
  error: FormErrors<MerkleSigPosRangeV1Inputs>;
}
