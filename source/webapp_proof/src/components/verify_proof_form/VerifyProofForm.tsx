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

enum VerifiedStatus {
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

const VerifyProofForm: React.FC<VerifyProofFormProps> = ({
  proveResult,
  // proofType,
  circuitTypeId,
  circuitDriverId,
  proofGenElement,
  isVerifyOpen,
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

  const publicInputElems = React.useMemo(() => {
    const obj = JSONbigNative.parse(proveResult.publicInputSer);
    const elems: React.ReactNode[] = [];

    function loopThroughJSON(obj: Record<string, any>, count: number) {
      for (let key in obj) {
        if (typeof obj[key] === "object") {
          if (Array.isArray(obj[key])) {
            for (let i = 0; i < obj[key].length; i++) {
              loopThroughJSON(obj[key][i], count + 1);
            }
          } else {
            loopThroughJSON(obj[key], count + 1);
          }
        } else {
          const val = obj[key].toString();

          elems.push(
            <div className={styles.publicInputRow} key={`${key}-${count}`}>
              <p className={styles.key}>{key}</p>
              <p className={styles.value}>{val}</p>
            </div>
          );
        }
      }
    }

    loopThroughJSON(obj, 0);

    return elems;
  }, [proveResult]);

  const [proofRaw, size] = React.useMemo(() => {
    return [utils.hexlify(proveResult.proof), proveResult.proof.byteLength];
  }, [proveResult]);

  // const height = isVerifyOpen ? publicInputElems.length * 40 + 550 : 0;

  return (
    <div className={styles.wrapper}>
      {isVerifyOpen && (
        <Fade>
          <div className={styles.publicInputSection}>
            <div className={styles.placeholder} />
            <div className={styles.data}>
              <div className={styles.title}>{i18n.public_inputs}</div>
              <div>{publicInputElems}</div>
            </div>
            <div className={styles.placeholder} />
          </div>
          <div className={styles.proofRawSection}>
            <div className={styles.title}>{i18n.proof}</div>
            <div className={styles.data}>
              <div className={styles.placeholder} />
              <div className={styles.proofSizeRow}>
                <p className={styles.label}>{i18n.proof_size}</p>
                <p>
                  {size} {i18n.bytes.toLowerCase()}
                </p>
              </div>
              {proofRaw}
              <div className={styles.placeholder} />
            </div>
            <div className={styles.footer} />
          </div>
          <div className={styles.driverSection}>
            <p className={styles.label}>{i18n.circuit_driver}</p>
            <p>{circuitDriverId}</p>
          </div>
          <div className={styles.btnRow}>
            <TutorialStepper steps={[3]}>
              <VerifyButton verifiedStatus={verifiedStatus} handleClick={handleClickVerify} />
            </TutorialStepper>
          </div>
        </Fade>
      )}
    </div>
  );
};

export default VerifyProofForm;

export interface VerifyProofFormProps {
  circuitTypeId: string;
  circuitDriverId: string;
  proveResult: ProveResult;
  isVerifyOpen: boolean;
  proofGenElement: ProofGenElement;
}

export interface VerifyButtonProps {
  verifiedStatus: VerifiedStatus;
  handleClick: () => Promise<void>;
}
