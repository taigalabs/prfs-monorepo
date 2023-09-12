import React from "react";
import { PrfsProofInstanceSyn1 } from "@taigalabs/prfs-entities/bindings/PrfsProofInstanceSyn1";
import { PublicInputMeta } from "@taigalabs/prfs-entities/bindings/PublicInputMeta";

import CaptionedImg from "../captioned_img/CaptionedImg";
import styles from "./ProofBanner.module.scss";
import QRDialog from "./QRDialog";

const ProofBanner: React.FC<ProofBannerProps> = ({ proofInstance, webappConsoleEndpoint }) => {
  const { prioritizedValues, shortUrl } = React.useMemo(() => {
    const { public_inputs_meta, public_inputs, short_id } = proofInstance;

    const shortUrl = `${webappConsoleEndpoint}/p/${short_id}`;

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
          <div>By {proofInstance.proof_label}</div>
          <div className={styles.url}>{shortUrl}</div>
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
  webappConsoleEndpoint: string;
}
