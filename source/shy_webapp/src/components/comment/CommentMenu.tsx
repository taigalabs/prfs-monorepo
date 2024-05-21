import React from "react";
import { usePrfsI18N } from "@taigalabs/prfs-i18n/react";
import { FaRegCommentAlt } from "@react-icons/all-files/fa/FaRegCommentAlt";

import styles from "./CommentMenu.module.scss";

const CommentMenu: React.FC<PostContentProps> = ({ handleClickReply }) => {
  const i18n = usePrfsI18N();

  return (
    <>
      <div className={styles.wrapper}>
        <ul>
          <li>
            <button className={styles.btn} onClick={handleClickReply}>
              <FaRegCommentAlt />
              <span>{i18n.reply}</span>
            </button>
          </li>
        </ul>
      </div>
    </>
  );
};

export default CommentMenu;

export interface PostContentProps {
  content: string;
  handleClickReply: () => void;
}
