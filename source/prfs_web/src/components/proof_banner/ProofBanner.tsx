import React from "react";
import Link from "next/link";
import QRCode from "qrcode";
import { useRouter } from "next/navigation";
import { PrfsProofInstanceSyn1 } from "@taigalabs/prfs-entities/bindings/PrfsProofInstanceSyn1";

import styles from "./ProofBanner.module.scss";
import { i18nContext } from "@/contexts/i18n";
import { paths } from "@/paths";
import ProofImage from "../proof_image/ProofImage";
import ProofInstanceQRCode from "../proof_instance_qrcode/ProofInstanceQRCode";
import { accessObj } from "@/functions/obj_access";

const ProofBanner: React.FC<ProofBannerProps> = ({ proofInstance }) => {
  const i18n = React.useContext(i18nContext);

  console.log(11, proofInstance);

  // const { prioritized_input_accessors } = proofInstance;

  // for (const accessor of prioritized_input_accessors) {
  //   const a = accessObj(accessor, proofInstance.public_inputs);
  //   console.log(22, a);
  // }

  return (
    <div className={styles.wrapper}>
      <div className={styles.left}>
        <ProofImage img_url={proofInstance.img_url} img_caption={proofInstance.img_caption} />
      </div>
      <div>
        <div className={styles.expression}>{proofInstance.expression}</div>
        <div>power</div>
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
