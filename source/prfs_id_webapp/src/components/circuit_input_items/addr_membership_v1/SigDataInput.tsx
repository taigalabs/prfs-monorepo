import React from "react";
import cn from "classnames";
import { SigData } from "@taigalabs/prfs-circuit-interface/bindings/SigData";
import { PrfsIdCredential, QueryPresetVals } from "@taigalabs/prfs-id-sdk-web";
import { useSignMessage } from "@taigalabs/prfs-crypto-deps-js/wagmi";
import { bufferToHex, hashPersonalMessage } from "@taigalabs/prfs-crypto-deps-js/ethereumjs";
import { prfsSign } from "@taigalabs/prfs-crypto-js";
import { AddrMembershipV1Data } from "@taigalabs/prfs-circuit-interface/bindings/AddrMembershipV1Data";
import { AddrMembershipV1Inputs } from "@taigalabs/prfs-circuit-interface/bindings/AddrMembershipV1Inputs";

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
import { FormErrors, FormValues } from "@/components/circuit_input_items/formTypes";

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
  circuitTypeData,
  value,
  error,
  setFormErrors,
  setFormValues,
  presetVals,
  credential,

  // circuitInput,
  // value,
  // setFormValues,
  // error,
  // setFormErrors,
  // presetVals,
  // credential,
}) => {
  const i18n = React.useContext(i18nContext);
  const [isPresetAssigned, setIsPresetAssigned] = React.useState(false);
  const { signMessageAsync } = useSignMessage();

  React.useEffect(() => {
    async function fn() {
      if (!isPresetAssigned && presetVals) {
        console.log("init", presetVals);
        setIsPresetAssigned(true);
        // setFormValues(oldVals => {
        // const oldVal: Record<string, any> = oldVals[circuitInput.name] || {};
        // const newVal = { ...oldVal };
        // const presetVal = presetVals[circuitInput.name] || {};
        // if (presetVal.msgRaw) {
        //   newVal.msgRaw = presetVal.msgRaw;
        //   const sig = await prfsSign(credential.secret_key, newVal.msgRaw);
        //   // console.log(11, sig);
        // }
        // return newVal;
        // });
      }
    }
    fn().then();
  }, [isPresetAssigned, setIsPresetAssigned, setFormValues]);

  const handleChangeRaw = React.useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      // if (value) {
      //   value.sigData.sig = "";
      //   value.sigData.msgHash = "0x0";
      // }

      const newVal = ev.target.value;
      setFormValues(oldVals => {
        const oldVal = oldVals.sigData || {};

        return {
          ...oldVals,
          sigData: {
            ...oldVal,
            msgRaw: newVal,
          },
        };
      });

      setFormErrors((oldVals: any) => {
        return {
          ...oldVals,
          sigData: undefined,
        };
      });
    },
    [setFormValues, value],
  );

  const handleClickSign = React.useCallback(async () => {
    if (value.sigData) {
      const msgRaw = value.sigData.msgRaw;
      const msgHash = hashPersonalMessage(Buffer.from(msgRaw));
      const sig = await signMessageAsync({ message: msgRaw });

      const newValue: SigData = {
        msgRaw,
        msgHash: bufferToHex(msgHash),
        sig,
      };
      setFormValues(oldVals => ({
        ...oldVals,
        sigData: newValue,
      }));
    } else {
      setFormErrors((oldVals: any) => {
        return {
          ...oldVals,
          sigData: "Type some message on which to put a signature",
        };
      });
    }
  }, [value, setFormValues, signMessageAsync, setFormErrors]);

  return (
    <FormInput>
      <FormInputTitleRow>
        <FormInputTitle>{"Signature"}</FormInputTitle>
        <FormInputBtnRow>
          <button className={styles.signBtn} onClick={handleClickSign} type="button">
            {i18n.sign}
          </button>
        </FormInputBtnRow>
      </FormInputTitleRow>
      <InputWrapper>
        <div className={styles.interactiveArea}>
          <input
            placeholder={"Signature"}
            value={value.sigData?.msgRaw || ""}
            onChange={handleChangeRaw}
          />
        </div>
      </InputWrapper>
      {value?.sigData && <ComputedValue value={value.sigData} />}
      {error?.sigData && <FormError>{error.sigData}</FormError>}
    </FormInput>
  );
};

export default SigDataInput;

export interface SigDataInputProps {
  circuitTypeData: AddrMembershipV1Data;
  value: FormValues<AddrMembershipV1Inputs>;
  error: FormErrors<AddrMembershipV1Inputs>;
  setFormValues: React.Dispatch<React.SetStateAction<AddrMembershipV1Inputs>>;
  setFormErrors: React.Dispatch<React.SetStateAction<FormErrors<AddrMembershipV1Inputs>>>;
  presetVals?: QueryPresetVals;
  credential: PrfsIdCredential;
}

export interface ComputedValueProps {
  value: SigData | undefined;
}
