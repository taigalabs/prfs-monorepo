import React from "react";
import { ProofPublicInput } from "@taigalabs/prfs-driver-interface";
import { PrfsProofInstanceSyn1 } from "@taigalabs/prfs-entities/bindings/PrfsProofInstanceSyn1";
import { PublicInputMeta } from "@taigalabs/prfs-entities/bindings/PublicInputMeta";

import CaptionedImg from "../captioned_img/CaptionedImg";
import styles from "./ProofBanner.module.scss";
import QRDialog from "./QRDialog";

const ProofBanner: React.FC<ProofBannerProps> = ({ proofInstance, webappProofEndpoint }) => {
  const { prioritizedValues, shortUrl } = React.useMemo(() => {
    const { public_inputs_meta, short_id } = proofInstance;

    const public_inputs = proofInstance.public_inputs as ProofPublicInput;

    const shortUrl = `${webappProofEndpoint}/p/${short_id}`;

    let values = [];
    for (const meta of public_inputs_meta as PublicInputMeta[]) {
      if (meta.show_priority === 0) {
        const { name } = meta;

        if (public_inputs[name]) {
          values.push(`${name} ${public_inputs[name]}`);
        }

        if (public_inputs.circuitPubInput && public_inputs.circuitPubInput[name]) {
          const val = public_inputs.circuitPubInput[name].toString();

          values.push(`${name} ${val}`);
        }
      }
    }

    return { prioritizedValues: values, shortUrl };
  }, [proofInstance]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.imgContainer}>
        <CaptionedImg img_url={proofInstance.img_url} img_caption={proofInstance.img_caption} />
      </div>
      <div className={styles.content}>
        <div className={styles.expression}>{proofInstance.expression}</div>
        <div className={styles.prioritizedValues}>{prioritizedValues.join(",")}</div>
        <div className={styles.bottom}>
          <div className={styles.proofLabel}>{proofInstance.proof_label}</div>
          <div className={styles.url}>
            <a href={shortUrl}>{shortUrl}</a>
          </div>
        </div>
      </div>
      <div className={styles.menu}>
        <QRDialog data={shortUrl} />
      </div>
    </div>
  );
};

export default ProofBanner;

export interface ProofBannerProps {
  proofInstance: PrfsProofInstanceSyn1;
  webappProofEndpoint: string;
}
