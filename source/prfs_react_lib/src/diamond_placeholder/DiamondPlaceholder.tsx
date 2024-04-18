import React from "react";
import { GiDiamonds } from "@react-icons/all-files/gi/GiDiamonds";

import styles from "./DiamondPlaceholder.module.scss";

const DiamondPlaceholder: React.FC<PostContentProps> = ({}) => {
  return (
    <div className={styles.wrapper}>
      <GiDiamonds />
      <GiDiamonds />
      <GiDiamonds />
    </div>
  );
};

export default DiamondPlaceholder;

export interface PostContentProps {}
