import React from "react";
import { MerkleSigPosRangeV1Data } from "@taigalabs/prfs-circuit-interface/bindings/MerkleSigPosRangeV1Data";
import { MerkleSigPosRangeV1Inputs } from "@taigalabs/prfs-circuit-interface/bindings/MerkleSigPosRangeV1Inputs";
import { MerkleSigPosRangeV1PresetVals } from "@taigalabs/prfs-circuit-interface/bindings/MerkleSigPosRangeV1PresetVals";

import styles from "./MemoInput.module.scss";
import {
  FormError,
  FormInputTitle,
  FormInputTitleRow,
  InputWrapper,
} from "@/components/form_input/FormInput";
import { useI18N } from "@/i18n/context";
import { FormErrors, FormValues } from "@/components/circuit_input_items/formTypes";
import { bytesToBigInt, deriveProofKey } from "@taigalabs/prfs-crypto-js";

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
    async function fn() {
      if (presetVals && presetVals.nonceRaw) {
        setFormValues(oldVals => ({
          ...oldVals,
          nonceRaw: presetVals.nonceRaw,
        }));
        setIsPresetVals(true);
      }
    }
    fn().then();
  }, [setFormValues, presetVals, setIsPresetVals]);

  const handleChangeNonce = React.useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = ev.target;

      setFormValues(oldVal => ({
        ...oldVal,
        nonceRaw: value,
      }));

      if (error?.nonceRaw !== undefined) {
        setFormErrors(oldVal => ({ ...oldVal, nonceRaw: undefined }));
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
          value={value.nonceRaw || ""}
          onChange={handleChangeNonce}
          disabled={isPresetVals}
        />
      </InputWrapper>
      {error?.nonceRaw && <FormError>{error.nonceRaw}</FormError>}
    </>
  );
};

export default MemoInput;

export interface RangeSelectProps {
  circuitTypeData: MerkleSigPosRangeV1Data;
  value: FormValues<MerkleSigPosRangeV1Inputs>;
  presetVals?: MerkleSigPosRangeV1PresetVals;
  setFormValues: React.Dispatch<React.SetStateAction<MerkleSigPosRangeV1Inputs>>;
  setFormErrors: React.Dispatch<React.SetStateAction<FormErrors<MerkleSigPosRangeV1Inputs>>>;
  error: FormErrors<MerkleSigPosRangeV1Inputs>;
}
