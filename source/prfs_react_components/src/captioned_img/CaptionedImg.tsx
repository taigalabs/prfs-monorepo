import React from "react";

import styles from "./CaptionedImg.module.scss";

const CaptionedImg: React.FC<CaptionedImgProps> = ({ img_url, img_caption, size }) => {
  const style: React.CSSProperties = {};
  if (size) {
    style.width = size;
    style.height = size;
  }

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

export default CaptionedImg;

export interface CaptionedImgProps {
  img_url: string | null;
  img_caption?: string | null;
  size?: number;
}
