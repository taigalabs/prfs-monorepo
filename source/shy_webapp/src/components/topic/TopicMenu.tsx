import React from "react";
import { useQuery } from "@taigalabs/prfs-react-lib/react_query";
import { shyApi2 } from "@taigalabs/shy-api-js";
import Spinner from "@taigalabs/prfs-react-lib/src/spinner/Spinner";
import Link from "next/link";
import dayjs from "dayjs";

import styles from "./PostMenu.module.scss";
import { paths } from "@/paths";
import { toShortDate } from "@/utils/time";
import { PostInner } from "./PostComponent";
import { useI18N } from "@/i18n/hook";

const TopicMenu: React.FC<PostContentProps> = ({ topicId }) => {
  const i18n = useI18N();
  return (
    <div className={styles.wrapper}>
      <ul>
        <li>{i18n.reply}</li>
      </ul>
    </div>
  );
};

export default TopicMenu;

export interface PostContentProps {
  topicId: string;
}
