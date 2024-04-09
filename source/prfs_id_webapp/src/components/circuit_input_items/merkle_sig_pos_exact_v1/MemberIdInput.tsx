import React from "react";
import cn from "classnames";
import { IoMdAlert } from "@react-icons/all-files/io/IoMdAlert";
import { PrfsSet } from "@taigalabs/prfs-entities/bindings/PrfsSet";
import ConnectWallet from "@taigalabs/prfs-react-lib/src/connect_wallet/ConnectWallet";
import { MerkleSigPosExactV1Inputs } from "@taigalabs/prfs-circuit-interface/bindings/MerkleSigPosExactV1Inputs";
import { abbrev7and5 } from "@taigalabs/prfs-ts-utils";
import Input from "@taigalabs/prfs-react-lib/src/input/Input";
import {
  Fieldset,
  InputElement,
  InputError,
  InputWrapper,
  Label,
} from "@taigalabs/prfs-react-lib/src/input/InputComponent";
import { useInput } from "@taigalabs/prfs-react-lib/src/input/useInput";

import styles from "./MemberIdInput.module.scss";
import { useI18N } from "@/i18n/context";
import { FormError } from "@/components/form_input/FormInput";
import { FormInputButton } from "@/components/circuit_inputs/CircuitInputComponents";
import CachedItemDialog from "@/components/cached_item_dialog/CachedItemDialog";
import { FormErrors } from "@/components/circuit_input_items/formTypes";
import RawValueDialog from "@/components/raw_value_dialog/RawValueDialog";

const MemberIdInput: React.FC<MemberIdInputProps> = ({
  memberId,
  handleChangeValue,
  error,
  prfsSet,
}) => {
  const i18n = useI18N();
  const { isFocused, handleFocus, handleBlur } = useInput();

  const abbrevMemberId = React.useMemo(() => {
    if (memberId.length > 12) {
      return abbrev7and5(memberId);
    }
    return memberId;
  }, [memberId]);

  console.log(33, abbrevMemberId);

  return (
    <>
      <div className={styles.wrapper}>
        <>
          <InputWrapper
            className={styles.inputWrapper}
            isError={!!error.merkleProof}
            isFocused={isFocused}
            hasValue={abbrevMemberId.length > 0}
          >
            <Label name={""} className={styles.label}>
              {i18n.member_id}
            </Label>
            <Fieldset>{i18n.member_id}</Fieldset>
            <InputElement
              name={""}
              value={abbrevMemberId || ""}
              className={styles.input}
              onFocus={handleFocus}
              onBlur={handleBlur}
              readOnly
            />
          </InputWrapper>
        </>
        <div className={styles.btnRow}>
          {/* <CachedItemDialog handleChangeItem={handleChangeValue} prfsSet={prfsSet}> */}
          {/*   <FormInputButton type="button">{i18n.cache}</FormInputButton> */}
          {/* </CachedItemDialog> */}
          <RawValueDialog
            className={styles.rawValueDialog}
            handleChangeItem={handleChangeValue}
            prfsSet={prfsSet}
          >
            <FormInputButton type="button">{i18n.i_will_type}</FormInputButton>
          </RawValueDialog>
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

export default MemberIdInput;

export interface MemberIdInputProps {
  memberId: string;
  handleChangeValue: (val: string) => void;
  error: FormErrors<MerkleSigPosExactV1Inputs>;
  prfsSet: PrfsSet | null;
}
