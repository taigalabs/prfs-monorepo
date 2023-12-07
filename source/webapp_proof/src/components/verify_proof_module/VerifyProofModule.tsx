import React from "react";
import Button from "@taigalabs/prfs-react-components/src/button/Button";
import cn from "classnames";
import { Proof } from "@taigalabs/prfs-driver-interface";
import { FaCheck } from "@react-icons/all-files/fa/FaCheck";
import { AiOutlineClose } from "@react-icons/all-files/ai/AiOutlineClose";
import ProofGenElement from "@taigalabs/prfs-sdk-web/src/elems/proof_gen_element/proof_gen_element";

import styles from "./VerifyProofModule.module.scss";
import { i18nContext } from "@/contexts/i18n";
import TutorialStepper from "@/components/tutorial/TutorialStepper";
import Spinner from "@taigalabs/prfs-react-components/src/spinner/Spinner";

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
  proof,
  circuitTypeId,
}) => {
  const i18n = React.useContext(i18nContext);
  const [verifiedStatus, setVerifiedStatus] = React.useState(VerifiedStatus.None);

  const handleClickVerify = React.useCallback(async () => {
    if (verifiedStatus === VerifiedStatus.None) {
      try {
        setVerifiedStatus(VerifiedStatus.InProgress);

        const verifyReceipt = await proofGenElement.verifyProof(proof, circuitTypeId);

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
  proof: Proof;
}

export interface VerifyButtonProps {
  verifiedStatus: VerifiedStatus;
  handleClick: () => Promise<void>;
}
