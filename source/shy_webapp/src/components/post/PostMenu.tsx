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
import CreatePostDialog from "../create_post_dialog/CreatePostDialog";

const PostMenu: React.FC<PostContentProps> = ({}) => {
  const i18n = useI18N();

  return (
    <>
      <div className={styles.wrapper}>
        <ul>
          <li>
            <CreatePostDialog>
              <Button variant="transparent_1" className={styles.btn}>
                <FaReply />
                <span>{i18n.reply}</span>
              </Button>
            </CreatePostDialog>
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
}
