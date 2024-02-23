import React from "react";

import styles from "./BoardMenu.module.scss";
import { useI18N } from "@/i18n/hook";
import Button from "@/components/button/Button";

const BoardMenu: React.FC<BoardMenuProps> = ({}) => {
  const i18n = useI18N();

  return (
    <div className={styles.wrapper}>
      <ul>
        <li>{i18n.general}</li>
      </ul>
      <div className={styles.secondRow}>
        <Button variant="white_1">{i18n.newest}</Button>
        <Button variant="green_1" className={styles.newPostBtn}>
          {i18n.new_post}
        </Button>
      </div>
    </div>
  );
};

export default BoardMenu;

export interface BoardMenuProps {}
