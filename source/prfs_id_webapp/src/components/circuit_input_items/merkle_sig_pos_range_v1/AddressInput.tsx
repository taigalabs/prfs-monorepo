import React from "react";
import cn from "classnames";
import { IoMdAlert } from "@react-icons/all-files/io/IoMdAlert";
import { PrfsSet } from "@taigalabs/prfs-entities/bindings/PrfsSet";
import ConnectWallet from "@taigalabs/prfs-react-lib/src/connect_wallet/ConnectWallet";
import { MerkleSigPosRangeV1Inputs } from "@taigalabs/prfs-circuit-interface/bindings/MerkleSigPosRangeV1Inputs";
import { abbrev7and5 } from "@taigalabs/prfs-ts-utils";
import Input from "@taigalabs/prfs-react-lib/src/input/Input";
import {
  Fieldset,
  InputElement,
  InputError,
  InputWrapper,
  Label,
} from "@taigalabs/prfs-react-lib/src/input/InputComponent";
import HoverableText from "@taigalabs/prfs-react-lib/src/hoverable_text/HoverableText";
import { useInput } from "@taigalabs/prfs-react-lib/src/input/useInput";

import styles from "./AddressInput.module.scss";
import { useI18N } from "@/i18n/context";
import { FormError } from "@/components/form_input/FormInput";
import { FormInputButton } from "@/components/circuit_inputs/CircuitInputComponents";
// import CachedAddressDialog from "@/components/cached_address_dialog/CachedAddressDialog";
import CachedItemDialog from "@/components/cached_item_dialog/CachedItemDialog";
import { FormErrors } from "@/components/circuit_input_items/formTypes";

const AddressInput: React.FC<AddresseInputProps> = ({
  walletAddr,
  handleChangeAddress,
  error,
  prfsSet,
}) => {
  const i18n = useI18N();
  const { isFocused, handleFocus, handleBlur } = useInput();

  const abbrevWalletAddr = React.useMemo(() => {
    if (walletAddr.length > 10) {
      return abbrev7and5(walletAddr);
    }
    return "";
  }, [walletAddr]);

  return (
    <>
      <div className={styles.wrapper}>
        <>
          <InputWrapper
            className={styles.inputWrapper}
            isError={!!error.merkleProof}
            isFocused={isFocused}
            hasValue={abbrevWalletAddr.length > 0}
          >
            <Label name={""} className={styles.label}>
              {i18n.wallet}
            </Label>
            <Fieldset>{i18n.wallet}</Fieldset>
            <InputElement
              name={""}
              value={abbrevWalletAddr || ""}
              className={styles.input}
              onFocus={handleFocus}
              onBlur={handleBlur}
              readOnly
            />
          </InputWrapper>
        </>
        <div className={styles.btnRow}>
          <CachedItemDialog handleChangeItem={handleChangeAddress} prfsSet={prfsSet}>
            <FormInputButton type="button">{i18n.cache}</FormInputButton>
          </CachedItemDialog>
          <span className={styles.or}> or </span>
          <ConnectWallet handleChangeAddress={handleChangeAddress}>
            <FormInputButton type="button">{i18n.connect}</FormInputButton>
          </ConnectWallet>
        </div>
      </div>
      {error?.merkleProof && (
        <FormError>
          <IoMdAlert />
          {error.merkleProof}
        </FormError>
      )}
    </>
  );
};

export default AddressInput;

export interface AddresseInputProps {
  walletAddr: string;
  handleChangeAddress: (addr: string) => void;
  error: FormErrors<MerkleSigPosRangeV1Inputs>;
  prfsSet: PrfsSet | null;
}
