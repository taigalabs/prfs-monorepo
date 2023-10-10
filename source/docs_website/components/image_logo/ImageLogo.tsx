import React from "react";

import styles from "./ImageLogo.module.scss";

const ImageLogo: React.FC<ImageLogoProps> = ({ width }) => {
  return (
    <div className={styles.wrapper} style={{ width }}>
      <img
        src="https://prfs-asset-1.s3.ap-northeast-2.amazonaws.com/prfs_logo_chivo_big_cropped.png"
        alt="logo"
        crossOrigin=""
      />
    </div>
  );
};

export default ImageLogo;

export interface ImageLogoProps {
  width?: number;
}
