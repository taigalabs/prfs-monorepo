import React from "react";
import { IoMdArrowDropdown } from "@react-icons/all-files/io/IoMdArrowDropdown";
import { useQuery } from "@taigalabs/prfs-react-lib/react_query";
import { ShyChannel } from "@taigalabs/shy-entities/bindings/ShyChannel";

import styles from "./BoardMeta.module.scss";
import { useI18N } from "@/i18n/hook";
import Button from "@/components/button/Button";
import { shyApi2 } from "@taigalabs/shy-api-js";

const BoardMeta: React.FC<BoardMetaProps> = ({ channelId }) => {
  const i18n = useI18N();
  // const { isLoading, data, error } = useQuery({
  //   queryKey: ["get_shy_channel"],
  //   queryFn: async () => {
  //     const { payload } = await shyApi("get_shy_channel", { channel_id: channelId });
  //     return payload;
  //   },
  // });

  return <div className={styles.wrapper}></div>;
};

export default BoardMeta;

export interface BoardMetaProps {
  channelId: string;
}
