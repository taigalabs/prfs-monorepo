import React from "react";
import Link from "next/link";
import Button from "@taigalabs/prfs-react-lib/src/button/Button";

import styles from "./CreateTopicFormHeader.module.scss";
import { i18nContext } from "@/i18n/context";
import { paths } from "@/paths";

const CreateTopicFormHeader: React.FC<CreatePostFormHeaderProps> = ({ channelId }) => {
  const i18n = React.useContext(i18nContext);

  return (
    <div className={styles.wrapper}>
      <div className={styles.btnRow}>
        <Link href={`${paths.c}/${channelId}?post`}>
          <Button variant="white_black_1">{i18n.submit}</Button>
        </Link>
      </div>
    </div>
  );
};

export default CreateTopicFormHeader;

export interface CreatePostFormHeaderProps {
  channelId: string;
}
