import React from "react";
import { ShyChannel } from "@taigalabs/shy-entities/bindings/ShyChannel";
import Link from "next/link";
import HoverableText from "@taigalabs/prfs-react-lib/src/hoverable_text/HoverableText";

import styles from "./TopicFooter.module.scss";
import { paths } from "@/paths";

export const TopicChannel: React.FC<TopicChannelProps> = ({ children }) => {
  return <div className={styles.channel}>{children}</div>;
};

export interface TopicChannelProps {
  children: React.ReactNode;
}
