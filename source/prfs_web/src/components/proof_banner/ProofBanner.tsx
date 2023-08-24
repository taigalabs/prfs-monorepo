import React from "react";
import Link from "next/link";
import QRCode from "qrcode";
import { useRouter } from "next/navigation";
import { PrfsProofInstanceSyn1 } from "@taigalabs/prfs-entities/bindings/PrfsProofInstanceSyn1";
import { PublicInputMeta } from "@taigalabs/prfs-entities/bindings/PublicInputMeta";

import styles from "./ProofBanner.module.scss";
import { i18nContext } from "@/contexts/i18n";
import { paths } from "@/paths";
import ProofImage from "../proof_image/ProofImage";
import ProofInstanceQRCode from "../proof_instance_qrcode/ProofInstanceQRCode";

const ProofBanner: React.FC<ProofBannerProps> = ({ proofInstance }) => {
  const i18n = React.useContext(i18nContext);

  const prioritizedValues = React.useMemo(() => {
    console.log(11, proofInstance);

    const { public_inputs_meta, public_inputs } = proofInstance;

    let accessors = [];
    let values = [];
    for (const meta of public_inputs_meta as PublicInputMeta[]) {
      if (meta.show_priority === 0) {
        accessors.push(meta.name);
      }
    }

    for (const accessor of accessors) {
      if (public_inputs[accessor]) {
        values.push(public_inputs[accessor]);
      }
    }

    return values;
  }, [proofInstance]);

  console.log(11, prioritizedValues);

  return (
    <div className={styles.wrapper}>
      <div className={styles.left}>
        <ProofImage img_url={proofInstance.img_url} img_caption={proofInstance.img_caption} />
      </div>
      <div>
        <div className={styles.expression}>{proofInstance.expression}</div>
        <div>{prioritizedValues.join(",")}</div>
        <div>url</div>
      </div>
      {/* <div className={styles.right}> */}
      {/*   <ProofInstanceQRCode proofInstance={proofInstance} /> */}
      {/* </div> */}
    </div>
  );
};

export default ProofBanner;

export interface ProofBannerProps {
  proofInstance: PrfsProofInstanceSyn1;
}
