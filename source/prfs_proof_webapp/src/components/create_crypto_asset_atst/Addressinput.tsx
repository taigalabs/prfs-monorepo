import React from "react";
import cn from "classnames";
import ConnectWallet from "@taigalabs/prfs-react-lib/src/connect_wallet/ConnectWallet";
import RawValueDialog from "@taigalabs/prfs-react-lib/src/raw_value_dialog/RawValueDialog";
import { abbrev7and5 } from "@taigalabs/prfs-ts-utils";
import {
  Fieldset,
  InputElement,
  InputWrapper,
  Label,
} from "@taigalabs/prfs-react-lib/src/input/InputComponent";
import { useInput } from "@taigalabs/prfs-react-lib/src/input/useInput";

import styles from "./AddressInput.module.scss";
import { useI18N } from "@/i18n/use_i18n";
import { FormInputButton } from "@/components/form_input_button/FormInputButton";

const AddressInput: React.FC<AddresseInputProps> = ({ walletAddr, handleChangeAddress, error }) => {
  const i18n = useI18N();
  const { isFocused, handleFocus, handleBlur } = useInput();

  const abbrevWalletAddr = React.useMemo(() => {
    if (walletAddr.length > 10) {
      return abbrev7and5(walletAddr);
    }
    return walletAddr;
  }, [walletAddr]);

  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.addressInput}>
          <InputWrapper
            className={styles.inputWrapper}
            isError={!!error}
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
        </div>
        <div className={styles.btnRow}>
          <ConnectWallet handleChangeAddress={handleChangeAddress}>
            <FormInputButton>{i18n.connect}</FormInputButton>
          </ConnectWallet>
          <RawValueDialog handleChangeItem={handleChangeAddress} label={i18n.address}>
            <FormInputButton>{i18n.i_will_type}</FormInputButton>
          </RawValueDialog>
        </div>
      </div>
    </>
  );
};

export default AddressInput;

export interface AddresseInputProps {
  walletAddr: string;
  handleChangeAddress: (addr: string) => void;
  error: string | null;
}
