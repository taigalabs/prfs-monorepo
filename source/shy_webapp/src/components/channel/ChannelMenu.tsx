import React from "react";
import cn from "classnames";
import { IoMdArrowDropdown } from "@react-icons/all-files/io/IoMdArrowDropdown";
import Link from "next/link";
import { usePrfsI18N } from "@taigalabs/prfs-i18n/react";

import styles from "./ChannelMenu.module.scss";
import Button from "@/components/button/Button";
import { pathParts, paths } from "@/paths";

const ChannelMenu: React.FC<BoardMenuProps> = ({ channelId }) => {
  const i18n = usePrfsI18N();
  const postURL = React.useMemo(() => {
    return `${paths.c}/${channelId}/${pathParts.new_topic}`;
  }, [channelId]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.row}>
        <Button className={styles.channelBtn} variant="white_1" isActive>
          {i18n.general}
        </Button>
      </div>
      <div className={styles.row}>
        <Button variant="transparent_1" className={styles.button}>
          <span>{i18n.latest}</span>
          <IoMdArrowDropdown />
        </Button>
        <Link href={postURL} className={cn(styles.rightAlign)}>
          <Button variant="green_1" className={styles.button}>
            {i18n.new_topic}
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ChannelMenu;

export interface BoardMenuProps {
  channelId: string;
}
