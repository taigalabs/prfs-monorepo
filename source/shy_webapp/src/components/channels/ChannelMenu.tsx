import React from "react";
import { IoMdArrowDropdown } from "@react-icons/all-files/io/IoMdArrowDropdown";

import styles from "./ChannelMenu.module.scss";
import { useI18N } from "@/i18n/hook";
import Button from "@/components/button/Button";

const ChannelMenu: React.FC<BoardMenuProps> = ({}) => {
  const i18n = useI18N();

  return (
    <div className={styles.wrapper}>
      <div className={styles.row}>
        <Button variant="white_1" className={styles.sortBtn}>
          <span>{i18n.all_channels}</span>
          <IoMdArrowDropdown />
        </Button>
      </div>
    </div>
  );
};

export default ChannelMenu;

export interface BoardMenuProps {}
