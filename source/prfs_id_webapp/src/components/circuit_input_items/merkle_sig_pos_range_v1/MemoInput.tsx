import React from "react";
import { MerkleSigPosRangeV1Data } from "@taigalabs/prfs-circuit-interface/bindings/MerkleSigPosRangeV1Data";
import { MerkleSigPosRangeV1Inputs } from "@taigalabs/prfs-circuit-interface/bindings/MerkleSigPosRangeV1Inputs";
import { MerkleSigPosRangeV1PresetVals } from "@taigalabs/prfs-circuit-interface/bindings/MerkleSigPosRangeV1PresetVals";
import Input from "@taigalabs/prfs-react-lib/src/input/Input";

import styles from "./MemoInput.module.scss";
import { FormError } from "@/components/form_input/FormInput";
import { useI18N } from "@/i18n/context";
import { FormErrors, FormValues } from "@/components/circuit_input_items/formTypes";

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
      <Input
        name={""}
        label={i18n.memo}
        value={value.nonceRaw || ""}
        handleChangeValue={handleChangeNonce}
        disabled={isPresetVals}
      />
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
