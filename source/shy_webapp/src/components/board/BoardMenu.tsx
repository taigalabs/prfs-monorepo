import React from "react";
import { IoMdArrowDropdown } from "@react-icons/all-files/io/IoMdArrowDropdown";

import styles from "./BoardMenu.module.scss";
import { useI18N } from "@/i18n/hook";
import Button from "@/components/button/Button";
import Link from "next/link";
import { paths } from "@/paths";

const BoardMenu: React.FC<BoardMenuProps> = ({ channelId }) => {
  const i18n = useI18N();
  const postURL = React.useMemo(() => {
    return `${paths.c}/${channelId}/post`;
  }, [channelId]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.row}>
        <Button variant="white_1" className={styles.sortBtn} isActive>
          {i18n.general}
        </Button>
      </div>
      <div className={styles.row}>
        <Button variant="transparent_1" className={styles.sortBtn}>
          <span>{i18n.latest}</span>
          <IoMdArrowDropdown />
        </Button>
        <Link href={postURL} className={styles.newPostBtn}>
          <Button variant="green_1">{i18n.new_post}</Button>
        </Link>
      </div>
    </div>
  );
};

export default BoardMenu;

export interface BoardMenuProps {
  channelId: string;
}
