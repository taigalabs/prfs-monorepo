import React from "react";
import cn from "classnames";
import { ProofPublicInput } from "@taigalabs/prfs-driver-interface";
import { PrfsProofInstanceSyn1 } from "@taigalabs/prfs-entities/bindings/PrfsProofInstanceSyn1";
import { PublicInputMeta } from "@taigalabs/prfs-entities/bindings/PublicInputMeta";
import { IoDocumentOutline } from "@react-icons/all-files/io5/IoDocumentOutline";

import CaptionedImg from "../captioned_img/CaptionedImg";
import styles from "./ProofBanner.module.scss";
import QRDialog from "./QRDialog";

const ProofBanner: React.FC<ProofBannerProps> = ({
  proofInstance,
  webappProofEndpoint,
  noBorder,
}) => {
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

        let count = 0;
        if (public_inputs.circuitPubInput && public_inputs.circuitPubInput[name]) {
          const _val = public_inputs.circuitPubInput[name].toString();
          const val = _val.length > 8 ? `${_val.substring(0, 20)}...` : _val;

          values.push(
            <p key={name}>
              <span>{name}</span> <span>{val}</span>
            </p>,
          );

          count += 1;
        }
      }
    }

    return { prioritizedValues: values, shortUrl };
  }, [proofInstance]);

  return (
    <div className={cn(styles.wrapper, { [styles.noBorder]: noBorder })}>
      <div className={styles.imgContainer}>
        <CaptionedImg img_url={proofInstance.img_url} img_caption={proofInstance.img_caption} />
      </div>
      <div className={styles.content}>
        <div className={styles.title}>{proofInstance.expression}</div>
        <div className={styles.subtitle}>
          <div>
            <span>/{proofInstance.short_id}</span>
          </div>
          <div className={styles.proofLabel}>
            <IoDocumentOutline />
            <span>{proofInstance.proof_type_label}</span>
          </div>
        </div>
        <div className={styles.prioritizedValues}>{prioritizedValues}</div>
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
  noBorder?: boolean;
}
