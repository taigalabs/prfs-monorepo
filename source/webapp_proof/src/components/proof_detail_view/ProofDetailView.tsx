import React from "react";
import Link from "next/link";
import { PrfsProofInstanceSyn1 } from "@taigalabs/prfs-entities/bindings/PrfsProofInstanceSyn1";
import { AiOutlineCopy } from "@react-icons/all-files/ai/AiOutlineCopy";
import JSONBig from "json-bigint";
import { PrfsSDK } from "@taigalabs/prfs-sdk-web";

import styles from "./ProofDetailView.module.scss";
import { i18nContext } from "@/contexts/i18n";
import { paths } from "@/paths";
import VerifyProofForm from "@/components/verify_proof_form/VerifyProofForm";
import { ProveReceipt, ProveResult } from "@taigalabs/prfs-driver-interface";
import ProofGenElement from "@taigalabs/prfs-sdk-web/src/proof_gen_element/proof_gen_element";

const prfsSDK = new PrfsSDK("prfs-proof");

const JSONbigNative = JSONBig({ useNativeBigInt: true, alwaysParseAsBig: true });

const ProofDetailView: React.FC<ProofDetailViewProps> = ({ proofInstance }) => {
  const i18n = React.useContext(i18nContext);
  const didTryInitialize = React.useRef(false);
  const [proofGenElement, setProofGenElement] = React.useState<ProofGenElement | null>(null);

  const proveResult = React.useMemo(() => {
    return {
      proof: new Uint8Array(proofInstance.proof),
      publicInputSer: JSONbigNative.stringify(proofInstance.public_inputs),
    } as ProveResult;
  }, [proofInstance]);

  React.useEffect(() => {
    async function fn() {
      if (didTryInitialize.current) {
        return;
      }
      didTryInitialize.current = true;

      // const { circuit_driver_id, driver_properties } = proofInstance.circuit_driver_id;

      // try {
      //   const elem = await prfsSDK.create("proof-gen", {
      //     proofTypeId: proofType.proof_type_id,
      //     circuit_driver_id,
      //     driver_properties,
      //     sdkEndpoint: process.env.NEXT_PUBLIC_PRFS_SDK_WEB_ENDPOINT,
      //     proofGenEventListener: proofGenEventListener,
      //   });

      //   elem.subscribe(msg => {
      //     setSystemMsg(msg.data);
      //   });

      //   setProofGenElement(elem);
      //   return elem;
      // } catch (err) {
      //   setSystemMsg(`Driver init failed, id: ${circuit_driver_id}, err: ${err}`);
      // }
    }

    fn().then();
  }, [proofInstance, setProofGenElement]);

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
