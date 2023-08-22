import React from "react";

import styles from "./ProofImage.module.scss";
import ProofImagePlaceHolder from "@/static/svgs/proof_img_placeholder_1.svg";

const ProofImage: React.FC<ProofImageProps> = ({ src }) => {
  return (
    <div className={styles.wrapper}>
      <img
        crossOrigin="anonymous"
        alt="Proof image"
        src={src}
        onError={ev => {
          ev.currentTarget.src = ProofImagePlaceHolder.src;
          console.log(5555);
        }}
      />
    </div>
  );
};

export default ProofImage;

export interface ProofImageProps {
  src: string;
}
