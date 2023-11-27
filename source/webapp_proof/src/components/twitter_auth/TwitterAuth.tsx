import React from "react";
import { PrfsProofType } from "@taigalabs/prfs-entities/bindings/PrfsProofType";
import cn from "classnames";
import dayjs from "dayjs";

import styles from "./TwitterAuth.module.scss";
import { i18nContext } from "@/contexts/i18n";
import CaptionedImg from "@taigalabs/prfs-react-components/src/captioned_img/CaptionedImg";
import { Markdown } from "../markdown/Markdown";

const TwitterAuth: React.FC<TwitterAuthProps> = ({}) => {
  return <div className={styles.wrapper}>power</div>;
};

export default TwitterAuth;

export interface TwitterAuthProps {}
