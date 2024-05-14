import React from "react";
import { ShyChannel } from "@taigalabs/shy-entities/bindings/ShyChannel";
import { DateTimed } from "@taigalabs/shy-entities/bindings/DateTimed";
import { ShyPost } from "@taigalabs/shy-entities/bindings/ShyPost";
import { Dayjs } from "dayjs";

import styles from "./PostRow.module.scss";
import Post from "@/components/post/Post";
import { ShyPostSyn1 } from "@taigalabs/shy-entities/bindings/ShyPostSyn1";
import { Proof } from "@taigalabs/prfs-driver-interface";

const ZeroCommentMsg: React.FC<RowProps> = ({}) => {
  return <div>power</div>;
};

export default ZeroCommentMsg;

export interface RowProps {}
