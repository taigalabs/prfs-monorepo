import React from "react";
import cn from "classnames";
import { Proof } from "@taigalabs/prfs-driver-interface";
import { toHex } from "@taigalabs/prfs-crypto-deps-js/viem";
import { JSONbigNative } from "@taigalabs/prfs-crypto-js";

import styles from "./ProofDataView.module.scss";
import { i18nContext } from "@/i18n/context";
import ProofRawDialog from "./ProofRawDialog";

const ProofDataView: React.FC<ProofDataViewProps> = ({ proof, isCard }) => {
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
    const size = proof.proofBytes.length;
    const proofRaw = toHex(new Uint8Array(proof.proofBytes));
    const proofRawMinified = proofRaw.length > 256 ? proofRaw.substring(0, 256) : proofRaw;

    return { proofRaw, size, proofRawMinified };
  }, [proof]);

  return (
    <div className={cn(styles.wrapper, { [styles.isCard]: isCard })}>
      <div className={styles.publicInputSection}>
        <div className={styles.data}>
          <div className={styles.title}>{i18n.public_inputs}</div>
          <div>{publicInputElems}</div>
        </div>
      </div>
      <div className={styles.proofRawSection}>
        <div className={styles.data}>
          <div className={styles.title}>{i18n.proof}</div>
          <div className={styles.row}>
            <p className={styles.label}>{i18n.transaction_hash}</p>
            <p>{proof.txHash ?? "None"}</p>
          </div>
          <div className={styles.row}>
            <p className={styles.label}>{i18n.ledger}</p>
            <p>{proof.ledger ?? "None"}</p>
          </div>
          <div className={styles.row}>
            <p className={styles.label}>{i18n.proof_size}</p>
            <p>
              {size} {i18n.bytes.toLowerCase()}
            </p>
          </div>
          <div>
            <span>{proofRawMinified}</span>
            <ProofRawDialog proofRaw={proofRaw}>
              <button className={styles.seeMore}>{i18n.see_more}</button>
            </ProofRawDialog>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProofDataView;

export interface ProofDataViewProps {
  proof: Proof;
  isCard?: boolean;
}
