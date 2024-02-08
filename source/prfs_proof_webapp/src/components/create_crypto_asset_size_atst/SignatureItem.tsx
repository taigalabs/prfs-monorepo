import React from "react";
import cn from "classnames";
import Tooltip from "@taigalabs/prfs-react-lib/src/tooltip/Tooltip";
import { AiOutlineCopy } from "@react-icons/all-files/ai/AiOutlineCopy";
import { Input } from "@taigalabs/prfs-react-lib/src/input/Input";
import { verifyMessage } from "@taigalabs/prfs-crypto-deps-js/viem";
import { FaCheck } from "@react-icons/all-files/fa/FaCheck";
import { IoClose } from "@react-icons/all-files/io5/IoClose";
import { useSignMessage } from "@taigalabs/prfs-crypto-deps-js/wagmi";

import styles from "./SignatureItem.module.scss";
import common from "@/styles/common.module.scss";
import { i18nContext } from "@/i18n/context";
import {
  AttestationContentBox,
  AttestationContentBoxBtnArea,
  AttestationListItem,
  AttestationListItemBtn,
  AttestationListItemDesc,
  AttestationListItemDescTitle,
  AttestationListItemNo,
  AttestationListItemOverlay,
  AttestationListRightCol,
} from "@/components/create_attestation/CreateAtstComponents";
import {
  AttestationStep,
  CLAIM,
  CryptoAssetSizeAtstFormData,
  SIGNATURE,
  WALLET_ADDR,
} from "./create_crypto_asset_size_atst";

const SignatureItem: React.FC<SigantureItemProps> = ({
  step,
  formData,
  setFormData,
  claimCm,
  setIsSigValid,
}) => {
  const i18n = React.useContext(i18nContext);
  const { signMessageAsync } = useSignMessage();
  const [validationMsg, setValidationMsg] = React.useState<React.ReactNode>(null);
  const [isCopyTooltipVisible, setIsCopyTooltipVisible] = React.useState(false);

  const handleClickValidate = React.useCallback(async () => {
    setIsSigValid(false);
    const sig = formData[SIGNATURE];
    const wallet_addr = formData[WALLET_ADDR];

    if (claimCm && sig.length > 0 && wallet_addr.length > 0) {
      try {
        const valid = await verifyMessage({
          address: wallet_addr as any,
          message: claimCm,
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
  }, [formData[SIGNATURE], formData[WALLET_ADDR], setIsSigValid, setValidationMsg, claimCm]);

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

  const handleClickSign = React.useCallback(async () => {
    if (claimCm) {
      const sig = await signMessageAsync({ message: claimCm });

      if (sig) {
        setFormData(oldVal => ({
          ...oldVal,
          [SIGNATURE]: sig,
        }));
      }
    }
  }, [claimCm, setFormData]);

  const handleClickCopy = React.useCallback(() => {
    if (claimCm) {
      navigator.clipboard.writeText(claimCm);
      setIsCopyTooltipVisible(true);

      setTimeout(() => {
        setIsCopyTooltipVisible(false);
      }, 3000);
    }
  }, [claimCm, setIsCopyTooltipVisible]);
  return (
    <AttestationListItem isDisabled={step < AttestationStep.POST_TWEET}>
      <AttestationListItemOverlay />
      <AttestationListItemNo>3</AttestationListItemNo>
      <AttestationListRightCol>
        <AttestationListItemDesc>
          <AttestationListItemDescTitle>
            {i18n.make_signature_with_your_crypto_wallet}
          </AttestationListItemDescTitle>
        </AttestationListItemDesc>
        <div>
          {claimCm && (
            <div className={styles.section}>
              <AttestationContentBox>
                <p className={common.alignItemCenter}>{claimCm}</p>
                <AttestationContentBoxBtnArea>
                  <Tooltip label={i18n.copied} show={isCopyTooltipVisible} placement="top">
                    <button type="button" onClick={handleClickCopy}>
                      <AiOutlineCopy />
                    </button>
                  </Tooltip>
                </AttestationContentBoxBtnArea>
              </AttestationContentBox>
              <div className={styles.signBox}>
                <div className={styles.inputBtnRow}>
                  <button className={styles.inputBtn} type="button" onClick={handleClickSign}>
                    {i18n.sign}
                  </button>
                  <span> or paste signature over the above message</span>
                </div>
                <Input
                  className={cn(styles.input)}
                  name={SIGNATURE}
                  error={""}
                  label={i18n.signature}
                  value={formData.signature}
                  handleChangeValue={handleChangeSig}
                />
              </div>
              <div className={styles.btnRow}>
                <AttestationListItemBtn type="button" handleClick={handleClickValidate}>
                  <span>{i18n.validate}</span>
                </AttestationListItemBtn>
                <div className={styles.msg}>{validationMsg}</div>
              </div>
            </div>
          )}
        </div>
      </AttestationListRightCol>
    </AttestationListItem>
  );
};

export default SignatureItem;

export interface SigantureItemProps {
  step: AttestationStep;
  claimCm: string | null;
  formData: CryptoAssetSizeAtstFormData;
  setFormData: React.Dispatch<React.SetStateAction<CryptoAssetSizeAtstFormData>>;
  setIsSigValid: React.Dispatch<React.SetStateAction<boolean>>;
}
