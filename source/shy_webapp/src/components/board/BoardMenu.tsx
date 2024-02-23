import React from "react";

import styles from "./BoardMenu.module.scss";
import { useI18N } from "@/i18n/hook";

const BoardMenu: React.FC<BoardMenuProps> = ({}) => {
  const i18n = useI18N();

  return (
    <div className={styles.wrapper}>
      <ul>
        <li>{i18n.general}</li>
      </ul>
      <div>
        <button type="button">{i18n.newest}</button>
        <button type="button">{i18n.new_post}</button>
      </div>
    </div>
  );
};

export default BoardMenu;

export interface BoardMenuProps {}
