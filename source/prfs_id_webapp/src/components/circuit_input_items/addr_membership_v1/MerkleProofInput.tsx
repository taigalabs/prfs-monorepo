import React from "react";
import cn from "classnames";
import { PrfsSet } from "@taigalabs/prfs-entities/bindings/PrfsSet";
import ConnectWallet from "@taigalabs/prfs-react-lib/src/connect_wallet/ConnectWallet";
import { QueryPresetVals } from "@taigalabs/prfs-id-sdk-web";
import { SpartanMerkleProof } from "@taigalabs/prfs-circuit-interface/bindings/SpartanMerkleProof";
import { AddrMembershipV1Data } from "@taigalabs/prfs-circuit-interface/bindings/AddrMembershipV1Data";
import { AddrMembershipV1Inputs } from "@taigalabs/prfs-circuit-interface/bindings/AddrMembershipV1Inputs";

import styles from "./MerkleProofInput.module.scss";
import MerkleProofRaw from "./MerkleProofRaw";
import { i18nContext } from "@/i18n/context";
import {
  FormError,
  FormInput,
  FormInputBtnRow,
  FormInputTitle,
  FormInputTitleRow,
  InputWrapper,
} from "@/components/form_input/FormInput";
import { FormInputButton } from "@/components/circuit_inputs/CircuitInputComponents";
import { FormErrors, FormValues } from "@/components/circuit_input_items/formTypes";

const ComputedValue: React.FC<ComputedValueProps> = ({ value }) => {
  const val = React.useMemo(() => {
    return (
      "Root: " +
      value.root.toString().substring(0, 6) +
      "... / First sibling: " +
      value.siblings[0].toString().substring(0, 6) +
      "..."
    );
  }, [value]);

  return <div className={styles.computedValue}>{val}</div>;
};

const MerkleProofInput: React.FC<MerkleProofInputProps> = ({
  circuitTypeData,
  value,
  error,
  setFormErrors,
  setFormValues,
}) => {
  const i18n = React.useContext(i18nContext);
  const [prfsSet, setPrfsSet] = React.useState<PrfsSet>();
  const [walletAddr, setWalletAddr] = React.useState("");

  const handleClickRawSubmit = React.useCallback(
    (merkleProof: SpartanMerkleProof) => {
      setFormValues((prevVals: any) => {
        return {
          ...prevVals,
          merkleProof: merkleProof,
        };
      });

      // setIsOpen(false);
    },
    [setFormValues],
  );

  const handleChangeAddress = React.useCallback(
    async (addr: string) => {
      if (!prfsSet) {
        return;
      }

      if (!addr) {
        return;
      }

      setWalletAddr(addr);
      setFormErrors((prevVals: any) => {
        return {
          ...prevVals,
          merkleProof: undefined,
        };
      });
    },
    [setWalletAddr, setFormValues, prfsSet, setFormErrors],
  );

  const label = React.useMemo(() => {
    return `Membership (${prfsSet ? prfsSet.label : i18n.loading})`;
  }, [circuitTypeData, prfsSet]);

  return (
    <>
      <FormInput>
        <FormInputTitleRow>
          <FormInputTitle>
            <span className={styles.inputLabel}>{label}</span>
          </FormInputTitle>
          <FormInputBtnRow>
            <ConnectWallet handleChangeAddress={handleChangeAddress}>
              <FormInputButton type="button">{i18n.connect}</FormInputButton>
            </ConnectWallet>
            <span className={styles.or}> or </span>
            <MerkleProofRaw
              circuitTypeData={circuitTypeData}
              prfsSet={prfsSet}
              handleClickRawSubmit={handleClickRawSubmit}
            >
              <FormInputButton type="button">{i18n.edit_raw}</FormInputButton>
            </MerkleProofRaw>
          </FormInputBtnRow>
        </FormInputTitleRow>
        <InputWrapper>
          <div className={styles.interactiveArea}>
            <input
              className={styles.addressInput}
              placeholder={`Wallet address`}
              value={walletAddr}
              readOnly
            />
          </div>
        </InputWrapper>
        {value?.merkleProof && <ComputedValue value={value.merkleProof} />}
        {error?.merkleProof && <FormError>{error.merkleProof}</FormError>}
      </FormInput>
    </>
  );
};

export default MerkleProofInput;

export interface MerkleProofInputProps {
  circuitTypeData: AddrMembershipV1Data;
  value: FormValues<AddrMembershipV1Inputs>;
  error: FormErrors<AddrMembershipV1Inputs>;
  setFormValues: React.Dispatch<React.SetStateAction<AddrMembershipV1Inputs>>;
  setFormErrors: React.Dispatch<React.SetStateAction<FormErrors<AddrMembershipV1Inputs>>>;
  presetVals?: QueryPresetVals;
}

export interface ComputedValueProps {
  value: SpartanMerkleProof;
}
