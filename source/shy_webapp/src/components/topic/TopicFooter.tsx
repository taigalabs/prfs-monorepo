"use client";

import React from "react";
import { ShyChannel } from "@taigalabs/shy-entities/bindings/ShyChannel";
import Link from "next/link";

import styles from "./TopicFooter.module.scss";
import { paths } from "@/paths";

const TopicFooter: React.FC<TopicFooterProps> = ({ topicId, channel, subChannelId }) => {
  return (
    <div className={styles.wrapper}>
      <span>
        There are other posts in{" "}
        <Link href={`${paths.c}/${channel.channel_id}`}>{channel.label}</Link>. Explore more.
      </span>
    </div>
  );
};

export default TopicFooter;

export interface TopicFooterProps {
  topicId: string;
  channel: ShyChannel;
  subChannelId: string;
}
