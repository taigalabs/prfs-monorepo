import React from "react";
import { IoMdArrowDropdown } from "@react-icons/all-files/io/IoMdArrowDropdown";
import { useQuery } from "@taigalabs/prfs-react-lib/react_query";
import { ShyChannel } from "@taigalabs/shy-entities/bindings/ShyChannel";
import { shyApi2 } from "@taigalabs/shy-api-js";

import styles from "./BoardMeta.module.scss";
import { useI18N } from "@/i18n/hook";
import Button from "@/components/button/Button";

const BoardMeta: React.FC<BoardMetaProps> = ({ channelId }) => {
  const i18n = useI18N();
  const { data, error } = useQuery({
    queryKey: ["get_shy_channel"],
    queryFn: async () => {
      return shyApi2({ type: "get_shy_channel", channel_id: channelId });
    },
  });

  const channel = data?.payload?.shy_channel;

  return error ? (
    <div>Error has occurred</div>
  ) : channel ? (
    <div className={styles.wrapper}>
      <div>{channel.label}</div>
    </div>
  ) : (
    <div>Loading...</div>
  );
};

export default BoardMeta;

export interface BoardMetaProps {
  channelId: string;
}
