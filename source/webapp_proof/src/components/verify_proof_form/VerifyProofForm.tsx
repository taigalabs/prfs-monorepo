import React from "react";
import Button from "@taigalabs/prfs-react-components/src/button/Button";
import cn from "classnames";
import { ProveReceipt } from "@taigalabs/prfs-driver-interface";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { PrfsProofType } from "@taigalabs/prfs-entities/bindings/PrfsProofType";
import { utils } from "ethers";
import JSONBig from "json-bigint";

import styles from "./VerifyProofForm.module.scss";
import { i18nContext } from "@/contexts/i18n";
import { paths } from "@/paths";
import TutorialStepper from "@/components/tutorial/TutorialStepper";
import Fade from "@taigalabs/prfs-react-components/src/fade/Fade";
import ProofGenElement from "@taigalabs/prfs-sdk-web/src/proof_gen_element/proof_gen_element";

const JSONbigNative = JSONBig({ useNativeBigInt: true, alwaysParseAsBig: true });

enum VerifiedStatus {
  None,
  Valid,
  Invalid,
}

const VerifyProofForm: React.FC<VerifyProofFormProps> = ({
  proveReceipt,
  proofType,
  proofGenElement,
  isVerifyOpen,
}) => {
  const i18n = React.useContext(i18nContext);
  const [verifiedStatus, setVerifiedStatus] = React.useState(VerifiedStatus.None);

  const handleClickVerify = React.useCallback(async () => {
    if (verifiedStatus === VerifiedStatus.None) {
      try {
        const verifyReceipt = await proofGenElement.verifyProof(
          proveReceipt.proveResult,
          proofType.circuit_type_id
        );

        console.log(11, verifyReceipt);

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
    const obj = JSONbigNative.parse(proveReceipt.proveResult.publicInputSer);
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
          console.log(11, obj[key]);
          const val = obj[key].toString();

          elems.push(
            <div className={styles.publicInputRow} key={`${key}-${count}`}>
              <p className={styles.key}>{key}</p>
              <p>{val}</p>
            </div>
          );
        }
      }
    }

    loopThroughJSON(obj, 0);

    return elems;
  }, [proveReceipt]);

  const [proofRaw, size] = React.useMemo(() => {
    return [
      utils.hexlify(proveReceipt.proveResult.proof),
      proveReceipt.proveResult.proof.byteLength,
    ];
  }, [proveReceipt]);

  const height = isVerifyOpen ? publicInputElems.length * 40 + 550 : 0;

  return (
    <div className={styles.wrapper} style={{ height }}>
      {isVerifyOpen && (
        <Fade delay={300}>
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
            <p>{proofType.circuit_driver_id}</p>
          </div>
          <div className={styles.btnRow}>
            <Button
              variant="transparent_aqua_blue_1"
              className={cn(styles.verifyBtn, {
                [styles.isValid]: verifiedStatus === VerifiedStatus.Valid,
                [styles.isInvalid]: verifiedStatus === VerifiedStatus.Invalid,
              })}
              handleClick={handleClickVerify}
            >
              {verifiedStatus === VerifiedStatus.Valid ? i18n.verified : i18n.verify}
            </Button>
          </div>
        </Fade>
      )}
    </div>
  );
};

export default VerifyProofForm;

export interface VerifyProofFormProps {
  proofType: PrfsProofType;
  proveReceipt: ProveReceipt;
  isVerifyOpen: boolean;
  proofGenElement: ProofGenElement;
}
