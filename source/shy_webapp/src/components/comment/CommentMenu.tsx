import React from "react";
import { usePrfsI18N } from "@taigalabs/prfs-i18n/react";
import { FaReply } from "@react-icons/all-files/fa/FaReply";

import styles from "./CommentMenu.module.scss";
import Button from "@/components/button/Button";

const CommentMenu: React.FC<PostContentProps> = ({ handleClickReply }) => {
  const i18n = usePrfsI18N();

  return (
    <>
      <div className={styles.wrapper}>
        <ul>
          <li>
            <Button variant="transparent_1" className={styles.btn} handleClick={handleClickReply}>
              <FaReply />
              <span>{i18n.reply}</span>
            </Button>
            {/* <CreatePost /> */}
          </li>
        </ul>
      </div>
    </>
  );
};

export default CommentMenu;

export interface PostContentProps {
  content: string;
  originalPostAuthorPubkey: string;
  handleClickReply: () => void;
}
