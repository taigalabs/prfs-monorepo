import React from "react";
import { useQuery } from "@taigalabs/prfs-react-lib/react_query";
import { shyApi2 } from "@taigalabs/shy-api-js";
import Spinner from "@taigalabs/prfs-react-lib/src/spinner/Spinner";
import Link from "next/link";
import dayjs from "dayjs";
import { FaReply } from "@react-icons/all-files/fa/FaReply";

import styles from "./TopicMenu.module.scss";
import { paths } from "@/paths";
import { toShortDate } from "@/utils/time";
import { PostInner } from "./PostComponent";
import { useI18N } from "@/i18n/hook";
import Button from "@/components/button/Button";

const TopicMenu: React.FC<PostContentProps> = ({ topicId }) => {
  const i18n = useI18N();
  return (
    <div className={styles.wrapper}>
      <ul>
        <li>
          <Button variant="transparent_1" className={styles.btn}>
            <FaReply />
            <span>{i18n.reply}</span>
          </Button>
        </li>
      </ul>
    </div>
  );
};

export default TopicMenu;

export interface PostContentProps {
  topicId: string;
}
