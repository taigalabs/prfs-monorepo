import React from "react";
import cn from "classnames";
import { CircuitInput } from "@taigalabs/prfs-entities/bindings/CircuitInput";
import { bufferToHex, hashPersonalMessage } from "@ethereumjs/util";
import { useSignMessage } from "wagmi";
import { BufferHex, SigData } from "@taigalabs/prfs-proof-interface";
import { PrfsIdCredential, QueryPresetVals } from "@taigalabs/prfs-id-sdk-web";

import styles from "./SigDataInput.module.scss";
import { i18nContext } from "@/i18n/context";
import {
  FormError,
  FormInput,
  FormInputBtnRow,
  FormInputTitle,
  FormInputTitleRow,
  InputWrapper,
} from "@/components/form_input/FormInput";

const ComputedValue: React.FC<ComputedValueProps> = ({ value }) => {
  const val = React.useMemo(() => {
    if (value && value.sig) {
      return value.sig.substring(0, 14) + "...";
    } else {
      return "";
    }
  }, [value]);

  return <div className={styles.computedValue}>{val}</div>;
};

const SigDataInput: React.FC<SigDataInputProps> = ({
  circuitInput,
  value,
  setFormValues,
  error,
  setFormErrors,
  presetVals,
  credential,
}) => {
  const i18n = React.useContext(i18nContext);
  const [isPresetAssigned, setIsPresetAssigned] = React.useState(false);
  const { signMessageAsync } = useSignMessage();

  React.useEffect(() => {
    if (!isPresetAssigned && presetVals) {
      console.log("init");
      setIsPresetAssigned(true);
      setFormValues(oldVals => {
        const oldVal: Record<string, any> = oldVals[circuitInput.name] || {};
        const newVal = { ...oldVal };

        for (const key in presetVals) {
          newVal[key] = presetVals[key];
        }

        return newVal;
      });
    }
  }, [isPresetAssigned, setIsPresetAssigned, setFormValues]);

  const handleChangeRaw = React.useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      if (value) {
        value.sig = "";
        value.msgHash = "0x0";
      }

      const newVal = ev.target.value;
      setFormValues(oldVals => {
        const oldVal = oldVals[circuitInput.name] || {};

        return {
          ...oldVals,
          [circuitInput.name]: {
            ...oldVal,
            msgRaw: newVal,
          },
        };
      });

      setFormErrors((oldVals: any) => {
        return {
          ...oldVals,
          [circuitInput.name]: undefined,
        };
      });
    },
    [setFormValues, value],
  );

  const handleClickSign = React.useCallback(async () => {
    if (value) {
      const msgRaw = value.msgRaw;
      const msgHash = hashPersonalMessage(Buffer.from(msgRaw));
      const sig = await signMessageAsync({ message: msgRaw });

      const newValue: SigData = {
        msgRaw,
        msgHash: bufferToHex(msgHash) as BufferHex,
        sig,
      };
      setFormValues(oldVals => ({
        ...oldVals,
        [circuitInput.name]: newValue,
      }));
    } else {
      setFormErrors((oldVals: any) => {
        return {
          ...oldVals,
          [circuitInput.name]: "Type some message on which to put a signature",
        };
      });
    }
  }, [value, setFormValues, signMessageAsync, setFormErrors]);

  return (
    <FormInput>
      <FormInputTitleRow>
        <FormInputTitle>{circuitInput.label}</FormInputTitle>
        <FormInputBtnRow>
          <button className={styles.signBtn} onClick={handleClickSign} type="button">
            {i18n.sign}
          </button>
        </FormInputBtnRow>
      </FormInputTitleRow>
      <InputWrapper>
        <div className={styles.interactiveArea}>
          <input
            placeholder={circuitInput.desc}
            value={value?.msgRaw || ""}
            onChange={handleChangeRaw}
          />
        </div>
      </InputWrapper>
      {value?.sig && <ComputedValue value={value} />}
      {error && <FormError>{error}</FormError>}
    </FormInput>
  );
};

export default SigDataInput;

export interface SigDataInputProps {
  circuitInput: CircuitInput;
  value: SigData | undefined;
  error: string | undefined;
  setFormValues: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  setFormErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  presetVals?: QueryPresetVals;
  credential: PrfsIdCredential;
}

export interface ComputedValueProps {
  value: SigData | undefined;
}
