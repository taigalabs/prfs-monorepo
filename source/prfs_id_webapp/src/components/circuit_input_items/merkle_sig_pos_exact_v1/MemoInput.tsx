import React from "react";
import { MerkleSigPosExactV1Data } from "@taigalabs/prfs-circuit-interface/bindings/MerkleSigPosExactV1Data";
import { MerkleSigPosExactV1Inputs } from "@taigalabs/prfs-circuit-interface/bindings/MerkleSigPosExactV1Inputs";
import { MerkleSigPosExactV1PresetVals } from "@taigalabs/prfs-circuit-interface/bindings/MerkleSigPosExactV1PresetVals";
import Input from "@taigalabs/prfs-react-lib/src/input/Input";

import styles from "./MemoInput.module.scss";
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
    <Input
      name={""}
      label={i18n.memo}
      value={value.nonceRaw || ""}
      handleChangeValue={handleChangeNonce}
      disabled={isPresetVals}
      error={error?.nonceRaw}
    />
  );
};

export default MemoInput;

export interface RangeSelectProps {
  circuitTypeData: MerkleSigPosExactV1Data;
  value: FormValues<MerkleSigPosExactV1Inputs>;
  presetVals?: MerkleSigPosExactV1PresetVals;
  setFormValues: React.Dispatch<React.SetStateAction<MerkleSigPosExactV1Inputs>>;
  setFormErrors: React.Dispatch<React.SetStateAction<FormErrors<MerkleSigPosExactV1Inputs>>>;
  error: FormErrors<MerkleSigPosExactV1Inputs>;
}
