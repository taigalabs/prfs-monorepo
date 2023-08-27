import React from "react";

import styles from "./ProofImage.module.scss";
import ProofImagePlaceHolder from "@/static/svgs/proof_img_placeholder_1.svg";

const ProofImage: React.FC<ProofImageProps> = ({ img_url, img_caption, size }) => {
  const style: React.CSSProperties = {};
  if (size) {
    style.width = size;
    style.height = size;
  }

  console.log(1, img_url);

  return (
    <div className={styles.wrapper} style={style}>
      {img_url ? (
        <img crossOrigin="anonymous" alt="Proof image" src={img_url} style={style} />
      ) : (
        <div className={styles.placeholder} style={style}></div>
      )}
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
  img_caption?: string | null;
  size?: number;
}
