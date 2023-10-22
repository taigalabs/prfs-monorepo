import React from "react";
import Link from "next/link";
import { PrfsProofInstanceSyn1 } from "@taigalabs/prfs-entities/bindings/PrfsProofInstanceSyn1";
import { AiOutlineCopy } from "@react-icons/all-files/ai/AiOutlineCopy";
import JSONBig from "json-bigint";

import styles from "./ProofDetailView.module.scss";
import { i18nContext } from "@/contexts/i18n";
import { paths } from "@/paths";
import VerifyProofForm from "@/components/verify_proof_form/VerifyProofForm";
import { ProveReceipt, ProveResult } from "@taigalabs/prfs-driver-interface";

const JSONbigNative = JSONBig({ useNativeBigInt: true, alwaysParseAsBig: true });

const ProofDetailView: React.FC<ProofDetailViewProps> = ({ proofInstance }) => {
  const i18n = React.useContext(i18nContext);

  const proveResult = React.useMemo(() => {
    return {
      proof: new Uint8Array(proofInstance.proof),
      publicInputSer: JSONbigNative.stringify(proofInstance.public_inputs),
    } as ProveResult;
  }, [proofInstance]);

  const proofGenElement = React.useMemo(() => {}, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <p className={styles.label}>{proofInstance.proof_label}</p>
        <p className={styles.desc}>{proofInstance.proof_desc}</p>
        <div>
          {/* <VerifyProofForm */}
          {/*   proveResult={proveResult} */}
          {/*   circuitTypeId={proofInstance.circuit_type_id} */}
          {/*   circuitDriverId={proofInstance.circuit_driver_id} */}
          {/*   isVerifyOpen={true} */}
          {/*   proofGenElement={proofGenElement} */}
          {/* /> */}
        </div>
      </div>
    </div>
  );
};

export default ProofDetailView;

export interface ProofDetailViewProps {
  proofInstance: PrfsProofInstanceSyn1;
}
