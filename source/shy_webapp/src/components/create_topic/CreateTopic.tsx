import React from "react";
import { useCurrentEditor } from "@tiptap/react";
import { usePrfsI18N } from "@taigalabs/prfs-i18n/react";
import Spinner from "@taigalabs/prfs-react-lib/src/spinner/Spinner";

import styles from "./CreateTopic.module.scss";
import Button from "@/components/button/Button";

const CreateTopic: React.FC<EditorFooterProps> = ({ channelId, subChannelId }) => {
  const i18n = usePrfsI18N();

  return <div className={styles.wrapper}>123</div>;
};

export default CreateTopic;

export interface EditorFooterProps {
  channelId: string;
  subChannelId: string;
}
