import React from "react";
import cn from "classnames";

import styles from "./ProofImage.module.scss";

const ProofImage: React.FC<ProofImageProps> = ({ imgUrl, className }) => {
  return (
    <img
      className={cn(styles.wrapper, className)}
      crossOrigin="anonymous"
      alt={"Proof image"}
      src={imgUrl}
    />
  );
};

export default ProofImage;

export interface ProofImageProps {
  className?: string;
  imgUrl: string;
}
