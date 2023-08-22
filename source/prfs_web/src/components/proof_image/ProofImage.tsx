import React from "react";

import styles from "./ProofImage.module.scss";

const ProofImage: React.FC<ProofImageProps> = ({ src }) => {
  return (
    <div className={styles.wrapper}>
      <img
        crossOrigin="anonymous"
        alt="Proof image"
        src={src}
        onError={() => {
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
