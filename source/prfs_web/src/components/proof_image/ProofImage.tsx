import React from "react";

import styles from "./ProofImage.module.scss";
import ProofImagePlaceHolder from "@/static/svgs/proof_img_placeholder_1.svg";

const ProofImage: React.FC<ProofImageProps> = ({ img_url, img_caption }) => {
  return (
    <div className={styles.wrapper}>
      <img
        crossOrigin="anonymous"
        alt="Proof image"
        src={img_url || ProofImagePlaceHolder.src}
        onError={ev => {
          ev.currentTarget.src = ProofImagePlaceHolder.src;
        }}
      />
      {img_caption && (
        <div className={styles.caption}>
          <p>{img_caption}</p>
        </div>
      )}
    </div>
  );
};

export default ProofImage;

export interface ProofImageProps {
  img_url: string | null;
  img_caption: string | null;
}
