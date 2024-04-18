import React from "react";
import cn from "classnames";
import Tooltip from "@taigalabs/prfs-react-lib/src/tooltip/Tooltip";
import { AiOutlineCopy } from "@react-icons/all-files/ai/AiOutlineCopy";
import Input from "@taigalabs/prfs-react-lib/src/input/Input";
import { verifyMessage } from "@taigalabs/prfs-crypto-deps-js/viem";
import { FaCheck } from "@react-icons/all-files/fa/FaCheck";
import { IoClose } from "@react-icons/all-files/io5/IoClose";
import { useAccount, useConnect, useSignMessage } from "@taigalabs/prfs-crypto-deps-js/wagmi";
import HoverableText from "@taigalabs/prfs-react-lib/src/hoverable_text/HoverableText";
import {
  Fieldset,
  InputElement,
  InputWrapper,
  Label,
} from "@taigalabs/prfs-react-lib/src/input/InputComponent";
import { useInput } from "@taigalabs/prfs-react-lib/src/input/useInput";
import { abbrev7and5 } from "@taigalabs/prfs-ts-utils";

import styles from "./SignatureItem.module.scss";
import common from "@/styles/common.module.scss";
import { i18nContext } from "@/i18n/context";
import {
  AttestationContentBox,
  AttestationContentBoxBtnArea,
  AttestationListItem,
  AttestationListItemDesc,
  AttestationListItemDescTitle,
  AttestationListItemNo,
  AttestationListItemOverlay,
  AttestationListRightCol,
} from "@/components/create_attestation/CreateAtstComponents";
import {
  CM,
  CryptoAssetSizeAtstFormData,
  SIGNATURE,
  WALLET_ADDR,
} from "./create_crypto_asset_atst";
import { FormInputButton } from "@/components/form_input_button/FormInputButton";

const SignatureItem: React.FC<SigantureItemProps> = ({ formData, setFormData, setIsSigValid }) => {
  const i18n = React.useContext(i18nContext);
  const { signMessageAsync } = useSignMessage();
  const [validationMsg, setValidationMsg] = React.useState<React.ReactNode>(null);
  const [isCopyTooltipVisible, setIsCopyTooltipVisible] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const { connect, connectors, error } = useConnect();
  const { address, connector, isConnected } = useAccount();

  const isDisabled = React.useMemo(() => {
    return formData[WALLET_ADDR]?.length < 1 || formData[CM]?.length < 1;
  }, [formData]);

  const { isFocused, handleFocus, handleBlur } = useInput();

  const handleClickValidate = React.useCallback(async () => {
    setIsSigValid(false);
    const sig = formData[SIGNATURE];
    const wallet_addr = formData[WALLET_ADDR];
    const cm = formData[CM];

    if (cm && sig.length > 0 && wallet_addr.length > 0) {
      try {
        const valid = await verifyMessage({
          address: wallet_addr as any,
          message: cm,
          signature: sig as any,
        });

        if (valid) {
          setValidationMsg(
            <span className={styles.green}>
              <FaCheck />
            </span>,
          );
          setIsSigValid(true);
        } else {
          setValidationMsg(
            <span className={styles.error}>
              <IoClose />
            </span>,
          );
        }
      } catch (err) {
        setValidationMsg(
          <span className={styles.error}>
            <IoClose />
          </span>,
        );
      }
    }
  }, [formData, setIsSigValid, setValidationMsg]);

  const handleChangeSig = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value, name } = e.target;

      if (name === SIGNATURE) {
        setFormData(oldVal => ({
          ...oldVal,
          [name]: value,
        }));
      }
    },
    [setFormData],
  );

  const abbrevSig = React.useMemo(() => {
    const sig = formData[SIGNATURE];
    return sig.length > 10 ? abbrev7and5(sig) : sig;
  }, [formData.signature]);

  const handleClickSign = React.useCallback(async () => {
    setErrorMsg(null);
    const cm = formData[CM];

    if (!isConnected || !connector) {
      setErrorMsg("Wallet is not connected.");
      return;
    }

    if (cm) {
      const sig = await signMessageAsync({ message: cm });

      if (sig) {
        setFormData(oldVal => ({
          ...oldVal,
          [SIGNATURE]: sig,
        }));
      }
    }
  }, [setFormData, formData, isConnected, connector, setErrorMsg]);

  const handleClickCopy = React.useCallback(() => {
    const cm = formData[CM];
    if (cm) {
      navigator.clipboard.writeText(cm);
      setIsCopyTooltipVisible(true);

      setTimeout(() => {
        setIsCopyTooltipVisible(false);
      }, 3000);
    }
  }, [formData, setIsCopyTooltipVisible]);

  const cm = formData[CM];

  return (
    <AttestationListItem isDisabled={isDisabled}>
      <AttestationListItemOverlay />
      <AttestationListItemNo>3</AttestationListItemNo>
      <AttestationListRightCol>
        <AttestationListItemDesc>
          <AttestationListItemDescTitle>
            {i18n.make_signature_with_your_crypto_wallet}
          </AttestationListItemDescTitle>
        </AttestationListItemDesc>
        <div>
          {cm && (
            <div className={styles.section}>
              <AttestationContentBox>
                <p className={common.alignItemCenter}>{cm}</p>
                <AttestationContentBoxBtnArea>
                  <Tooltip label={i18n.copied} show={isCopyTooltipVisible} placement="top">
                    <button type="button" onClick={handleClickCopy}>
                      <AiOutlineCopy />
                    </button>
                  </Tooltip>
                </AttestationContentBoxBtnArea>
              </AttestationContentBox>
              <div className={styles.signBox}>
                {/* <div className={styles.inputBtnRow}> */}
                {/*   <button className={styles.inputBtn} type="button" onClick={handleClickSign}> */}
                {/*     <HoverableText>{i18n.sign}</HoverableText> */}
                {/*   </button> */}
                {/*   <span> or paste signature over the above message</span> */}
                {/* </div> */}
                {/* <Input */}
                {/*   className={cn(styles.input)} */}
                {/*   name={SIGNATURE} */}
                {/*   error={""} */}
                {/*   label={i18n.signature} */}
                {/*   value={formData.signature} */}
                {/*   handleChangeValue={handleChangeSig} */}
                {/* /> */}
                <>
                  <div className={styles.wrapper}>
                    <div className={styles.sigInput}>
                      <InputWrapper
                        className={styles.inputWrapper}
                        isError={false}
                        isFocused={isFocused}
                        hasValue={formData.signature.length > 0}
                      >
                        <Label name={""} className={styles.label}>
                          {i18n.signature}
                        </Label>
                        <Fieldset>{i18n.signature}</Fieldset>
                        <InputElement
                          name={""}
                          value={abbrevSig || ""}
                          className={styles.input}
                          onFocus={handleFocus}
                          onBlur={handleBlur}
                          readOnly
                        />
                      </InputWrapper>
                    </div>
                    <div className={styles.btnRow}>
                      <div onClick={handleClickSign}>
                        <FormInputButton>{i18n.sign}</FormInputButton>
                      </div>
                      {/* <ConnectWallet handleChangeAddress={handleChangeAddress}> */}
                      {/*   <FormInputButton>{i18n.connect}</FormInputButton> */}
                      {/* </ConnectWallet> */}
                      {/* <RawValueDialog handleChangeItem={handleChangeAddress} label={i18n.address}> */}
                      {/*   <FormInputButton>{i18n.i_will_type}</FormInputButton> */}
                      {/* </RawValueDialog> */}
                    </div>
                  </div>
                </>
              </div>
              <div className={styles.validateBtnRow}>
                <button type="button" onClick={handleClickValidate}>
                  <HoverableText>{i18n.validate}</HoverableText>
                </button>
                <div className={styles.msg}>{validationMsg}</div>
              </div>
              <div className={styles.errorMsg}>{errorMsg}</div>
            </div>
          )}
        </div>
      </AttestationListRightCol>
    </AttestationListItem>
  );
};

export default SignatureItem;

export interface SigantureItemProps {
  formData: CryptoAssetSizeAtstFormData;
  setFormData: React.Dispatch<React.SetStateAction<CryptoAssetSizeAtstFormData>>;
  setIsSigValid: React.Dispatch<React.SetStateAction<boolean>>;
}
