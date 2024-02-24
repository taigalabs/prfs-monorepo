// This file was generated by [ts-rs](https://github.com/Aleph-Alpha/ts-rs). Do not edit this file manually.
import type { CreateShyPostRequest } from "./CreateShyPostRequest";
import type { GetShyChannelsRequest } from "./GetShyChannelsRequest";
import type { GetShyPostsRequest } from "./GetShyPostsRequest";

export type ShyApiRequest =
  | ({ type: "create_shy_post" } & CreateShyPostRequest)
  | ({ type: "get_shy_channels" } & GetShyChannelsRequest)
  | ({ type: "get_shy_posts" } & GetShyPostsRequest)
  | ({ type: "get_shy_channel" } & GetShyChannelsRequest);