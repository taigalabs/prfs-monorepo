import React from "react";
import { MerkleSigPosRangeV1Data } from "@taigalabs/prfs-circuit-interface/bindings/MerkleSigPosRangeV1Data";

import styles from "./MemoInput.module.scss";
import { FormInputTitle, FormInputTitleRow, InputWrapper } from "@/components/form_input/FormInput";
import { useI18N } from "@/i18n/context";
import { FormValues } from "../formErrorTypes";
import { MerkleSigPosRangeV1Inputs } from "@taigalabs/prfs-circuit-interface/bindings/MerkleSigPosRangeV1Inputs";
import { QueryPresetVals } from "@taigalabs/prfs-id-sdk-web";

const MemoInput: React.FC<RangeSelectProps> = ({
  circuitTypeData,
  value,
  presetVals,
  setFormValues,
}) => {
  const i18n = useI18N();

  const handleChangeNonce = React.useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = ev.target;

      setFormValues(oldVal => ({
        ...oldVal,
        nonce: value,
      }));
    },
    [setFormValues],
  );

  return (
    <>
      <FormInputTitleRow>
        <FormInputTitle>{i18n.memo}</FormInputTitle>
      </FormInputTitleRow>
      <InputWrapper>
        <input
          placeholder={i18n.leave_anything_that_makes_a_proof_unique}
          value={value.nonce}
          onChange={handleChangeNonce}
        />
      </InputWrapper>
    </>
  );
};

export default MemoInput;

export interface RangeSelectProps {
  circuitTypeData: MerkleSigPosRangeV1Data;
  value: FormValues<MerkleSigPosRangeV1Inputs>;
  presetVals?: QueryPresetVals;
  setFormValues: React.Dispatch<React.SetStateAction<MerkleSigPosRangeV1Inputs>>;
}
