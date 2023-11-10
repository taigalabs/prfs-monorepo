import React from "react";
import Button from "@taigalabs/prfs-react-components/src/button/Button";
import cn from "classnames";
import { ProveResult } from "@taigalabs/prfs-driver-interface";
import { FaCheck } from "@react-icons/all-files/fa/FaCheck";
import { AiOutlineClose } from "@react-icons/all-files/ai/AiOutlineClose";
import { PrfsProofType } from "@taigalabs/prfs-entities/bindings/PrfsProofType";
import { utils } from "ethers";
import JSONBig from "json-bigint";

import styles from "./VerifyProofForm.module.scss";
import { i18nContext } from "@/contexts/i18n";
import { paths } from "@/paths";
import TutorialStepper from "@/components/tutorial/TutorialStepper";
import Fade from "@taigalabs/prfs-react-components/src/fade/Fade";
import ProofGenElement from "@taigalabs/prfs-sdk-web/src/proof_gen_element/proof_gen_element";
import Spinner from "@taigalabs/prfs-react-components/src/spinner/Spinner";

const JSONbigNative = JSONBig({ useNativeBigInt: true, alwaysParseAsBig: true });

export enum VerifiedStatus {
  None,
  InProgress,
  Valid,
  Invalid,
}

const VerifyButton: React.FC<VerifyButtonProps> = ({ verifiedStatus, handleClick }) => {
  const i18n = React.useContext(i18nContext);

  switch (verifiedStatus) {
    case VerifiedStatus.Valid:
      return (
        <Button variant="transparent_black_1" className={styles.validBtn}>
          <FaCheck />
          <span>{i18n.verified}</span>
        </Button>
      );

    case VerifiedStatus.Invalid:
      return (
        <Button variant="transparent_black_1" className={styles.invalidBtn}>
          <AiOutlineClose />
          <span>{i18n.invalid}</span>
        </Button>
      );

    case VerifiedStatus.InProgress:
      return (
        <Button variant="transparent_black_1" className={styles.progressBtn}>
          <Spinner color="black" />
        </Button>
      );

    default:
      return (
        <Button variant="transparent_blue_1" className={styles.verifyBtn} handleClick={handleClick}>
          {i18n.verify}
        </Button>
      );
  }
};

const VerifyProofModule: React.FC<VerifyProofModuleProps> = ({
  proofGenElement,
  proveResult,
  circuitTypeId,
}) => {
  const i18n = React.useContext(i18nContext);
  const [verifiedStatus, setVerifiedStatus] = React.useState(VerifiedStatus.None);

  const handleClickVerify = React.useCallback(async () => {
    if (verifiedStatus === VerifiedStatus.None) {
      try {
        setVerifiedStatus(VerifiedStatus.InProgress);

        const verifyReceipt = await proofGenElement.verifyProof(proveResult, circuitTypeId);

        if (verifyReceipt.verifyResult) {
          setVerifiedStatus(VerifiedStatus.Valid);
        } else {
          setVerifiedStatus(VerifiedStatus.Invalid);
        }
      } catch (err) {
        setVerifiedStatus(VerifiedStatus.Invalid);
      }
    }
  }, [verifiedStatus, setVerifiedStatus, proofGenElement]);

  return (
    <div className={styles.wrapper}>
      <TutorialStepper steps={[3]}>
        <VerifyButton verifiedStatus={verifiedStatus} handleClick={handleClickVerify} />
      </TutorialStepper>
    </div>
  );
};

export default VerifyProofModule;

export interface VerifyProofModuleProps {
  proofGenElement: ProofGenElement;
  circuitTypeId: string;
  proveResult: ProveResult;
}

export interface VerifyButtonProps {
  verifiedStatus: VerifiedStatus;
  handleClick: () => Promise<void>;
}
