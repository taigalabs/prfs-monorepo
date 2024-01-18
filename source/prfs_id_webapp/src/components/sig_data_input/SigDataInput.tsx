import React from "react";
import cn from "classnames";
import { CircuitInput } from "@taigalabs/prfs-entities/bindings/CircuitInput";
import { bufferToHex, hashPersonalMessage } from "@ethereumjs/util";
import { useSignMessage } from "@taigalabs/prfs-id-sdk-react";
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
import { prfsSign } from "@taigalabs/prfs-crypto-js";

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
    async function fn() {
      if (!isPresetAssigned && presetVals) {
        console.log("init", presetVals);
        setIsPresetAssigned(true);
        setFormValues(async oldVals => {
          const oldVal: Record<string, any> = oldVals[circuitInput.name] || {};
          const newVal = { ...oldVal };
          const presetVal = presetVals[circuitInput.name] || {};

          if (presetVal.msgRaw) {
            newVal.msgRaw = presetVal.msgRaw;
            console.log(4, credential.secret_key, newVal.msgRaw);
            const sig = await prfsSign(credential.secret_key, newVal.msgRaw);
            console.log(11, sig);
          }

          return newVal;
        });
      }
    }
    fn().then();
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
