import React from "react";
import Button from "@taigalabs/prfs-react-components/src/button/Button";
import cn from "classnames";
import { Proof } from "@taigalabs/prfs-driver-interface";
import { FaCheck } from "@react-icons/all-files/fa/FaCheck";
import { AiOutlineClose } from "@react-icons/all-files/ai/AiOutlineClose";
import { PrfsProofType } from "@taigalabs/prfs-entities/bindings/PrfsProofType";
import { utils } from "ethers";
import JSONBig from "json-bigint";
import Fade from "@taigalabs/prfs-react-components/src/fade/Fade";
import ProofGenElement from "@taigalabs/prfs-sdk-web/src/proof_gen_element/proof_gen_element";
import Spinner from "@taigalabs/prfs-react-components/src/spinner/Spinner";
import { PrfsProofInstanceSyn1 } from "@taigalabs/prfs-entities/bindings/PrfsProofInstanceSyn1";

import styles from "./VerifyProofForm.module.scss";
import { i18nContext } from "@/contexts/i18n";
import { paths } from "@/paths";
import TutorialStepper from "@/components/tutorial/TutorialStepper";

const JSONbigNative = JSONBig({ useNativeBigInt: true, alwaysParseAsBig: true });

const VerifyProofForm: React.FC<VerifyProofFormProps> = ({
  proof,
  circuitDriverId,
  isVerifyOpen,
}) => {
  const i18n = React.useContext(i18nContext);

  const publicInputElems = React.useMemo(() => {
    const obj = JSONbigNative.parse(proof.publicInputSer);
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
              <p className={styles.label}>{key}</p>
              <p className={styles.value}>{val}</p>
            </div>,
          );
        }
      }
    }

    loopThroughJSON(obj, 0);

    return elems;
  }, [proof]);

  const { proofRaw, size, proofRawMinified } = React.useMemo(() => {
    const size = proof.proofBytes.byteLength;
    const proofRaw = utils.hexlify(proof.proofBytes);
    const proofRawMinified = proofRaw.length > 256 ? proofRaw.substring(0, 256) : proofRaw;

    return { proofRaw, size, proofRawMinified };
  }, [proof]);

  const handleClickSeeMoreProofRaw = React.useCallback(() => {}, [proofRaw]);

  return (
    <div
      className={cn(styles.wrapper, {
        [styles.isVerifyOpen]: isVerifyOpen,
      })}
    >
      <div className={styles.publicInputSection}>
        <div className={styles.data}>
          <div className={styles.title}>{i18n.public_inputs}</div>
          <div>{publicInputElems}</div>
        </div>
      </div>
      <div className={styles.proofRawSection}>
        <div className={styles.data}>
          <div className={styles.title}>{i18n.proof}</div>
          <div className={styles.proofSizeRow}>
            <p className={styles.label}>{i18n.proof_size}</p>
            <p>
              {size} {i18n.bytes.toLowerCase()}
            </p>
          </div>
          <div>
            <p>
              <span>{proofRawMinified}</span>
              <button className={styles.seeMore} onClick={handleClickSeeMoreProofRaw}>
                {i18n.see_more}
              </button>
            </p>
          </div>
        </div>
      </div>
      <div className={styles.driverSection}>
        <p className={styles.label}>{i18n.circuit_driver}</p>
        <p>{circuitDriverId}</p>
      </div>
    </div>
  );
};

export default VerifyProofForm;

export interface VerifyProofFormProps {
  circuitDriverId: string;
  proof: Proof;
  isVerifyOpen: boolean;
}
