import React from "react";
import cn from "classnames";
import { ProofPublicInput } from "@taigalabs/prfs-driver-interface";
import { PrfsProofInstanceSyn1 } from "@taigalabs/prfs-entities/bindings/PrfsProofInstanceSyn1";
import { PrfsProof } from "@taigalabs/prfs-entities/bindings/PrfsProof";
import { PublicInputMeta } from "@taigalabs/prfs-entities/bindings/PublicInputMeta";
import { IoDocumentOutline } from "@react-icons/all-files/io5/IoDocumentOutline";

import CaptionedImg from "../captioned_img/CaptionedImg";
import styles from "./ProofBanner.module.scss";
import QRDialog from "./QRDialog";
import { PrfsProofSyn1 } from "@taigalabs/prfs-entities/bindings/PrfsProofSyn1";

const ProofBanner: React.FC<ProofBannerProps> = ({ prfsProof, webappProofEndpoint, noBorder }) => {
  // const { prioritizedValues, shortUrl } = React.useMemo(() => {
  //   const { public_inputs_meta } = prfsProof;

  //   const public_inputs = proofInstance.public_inputs as ProofPublicInput;

  //   let values = [];
  //   for (const meta of public_inputs_meta as PublicInputMeta[]) {
  //     if (meta.show_priority === 0) {
  //       const { name } = meta;

  //       if (public_inputs[name]) {
  //         values.push(`${name} ${public_inputs[name]}`);
  //       }

  //       let count = 0;
  //       if (public_inputs.circuitPubInput && public_inputs.circuitPubInput[name]) {
  //         const _val = public_inputs.circuitPubInput[name].toString();
  //         const val = _val.length > 8 ? `${_val.substring(0, 20)}...` : _val;

  //         values.push(
  //           <p key={name}>
  //             <span>{name}</span> <span>{val}</span>
  //           </p>,
  //         );

  //         count += 1;
  //       }
  //     }
  //   }

  //   return { prioritizedValues: values, shortUrl };
  // }, [prfsProof]);

  return (
    <div className={cn(styles.wrapper, { [styles.noBorder]: noBorder })}>
      <div className={styles.imgContainer}>
        <CaptionedImg img_url={prfsProof.img_url} img_caption={prfsProof.img_caption} />
      </div>
      <div className={styles.content}>
        <div className={styles.title}>{prfsProof.expression}</div>
        <div className={styles.subtitle}>
          <div className={styles.proofLabel}>
            <IoDocumentOutline />
            <span>{prfsProof.proof_type_label}</span>
          </div>
        </div>
        {/* <div className={styles.prioritizedValues}>{prioritizedValues}</div> */}
      </div>
      <div className={styles.menu}>{/* <QRDialog data={shortUrl} /> */}</div>
    </div>
  );
};

export default ProofBanner;

export interface ProofBannerProps {
  prfsProof: PrfsProofSyn1;
  webappProofEndpoint: string;
  noBorder?: boolean;
}
