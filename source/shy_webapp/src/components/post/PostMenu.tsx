import React from "react";
import { useQuery } from "@taigalabs/prfs-react-lib/react_query";
import { shyApi2 } from "@taigalabs/shy-api-js";
import Spinner from "@taigalabs/prfs-react-lib/src/spinner/Spinner";
import Link from "next/link";
import { FaReply } from "@react-icons/all-files/fa/FaReply";

import styles from "./PostMenu.module.scss";
import { paths } from "@/paths";
import { useI18N } from "@/i18n/hook";
import Button from "@/components/button/Button";
import CreatePost from "@/components/create_post/CreatePost";

const PostMenu: React.FC<PostContentProps> = ({ handleClickReply }) => {
  const i18n = useI18N();

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

export default PostMenu;

export interface PostContentProps {
  content: string;
  originalPostAuthorPubkey: string;
  handleClickReply: () => void;
}
