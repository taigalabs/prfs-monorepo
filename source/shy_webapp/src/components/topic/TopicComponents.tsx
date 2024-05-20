import React from "react";
import { ShyChannel } from "@taigalabs/shy-entities/bindings/ShyChannel";
import Link from "next/link";

import styles from "./TopicComponents.module.scss";
import { paths } from "@/paths";

export const TopicChannel: React.FC<TopicChannelProps> = ({ channel }) => {
  return (
    <Link href={`${paths.c}/${channel.channel_id}`}>
      <div className={styles.channel}>{channel.label}</div>
    </Link>
  );
};

export interface TopicChannelProps {
  channel: ShyChannel;
}
