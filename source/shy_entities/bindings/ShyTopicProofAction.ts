// This file was generated by [ts-rs](https://github.com/Aleph-Alpha/ts-rs). Do not edit this file manually.
import type { CreateShyTopicAction } from "./CreateShyTopicAction";
import type { CreateShyTopicReplyAction } from "./CreateShyTopicReplyAction";

export type ShyTopicProofAction =
  | ({ type: "create_shy_topic" } & CreateShyTopicAction)
  | ({ type: "create_shy_topic_reply" } & CreateShyTopicReplyAction);