import React from "react";
import cn from "classnames";

import styles from "./ImageLogo.module.scss";

const ImageLogo: React.FC<ImageLogoProps> = ({ width, className }) => {
  return (
    <div className={cn(styles.wrapper, className)} style={{ width }}>
      <img
        src="https://d1w1533jipmvi2.cloudfront.net/prfs_logo_chivo_big_cropped.png"
        alt="logo"
        crossOrigin=""
      />
    </div>
  );
};

export default ImageLogo;

export interface ImageLogoProps {
  width?: number | "auto";
  className?: string;
}
