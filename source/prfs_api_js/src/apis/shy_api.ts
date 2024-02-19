import { CreateShyPostRequest } from "@taigalabs/prfs-entities/bindings/CreateShyPostRequest";
import { CreateShyPostResponse } from "@taigalabs/prfs-entities/bindings/CreateShyPostResponse";
import { GetShyPostsRequest } from "@taigalabs/prfs-entities/bindings/GetShyPostsRequest";
import { GetShyPostsResponse } from "@taigalabs/prfs-entities/bindings/GetShyPostsResponse";
import { GetShyChannelsRequest } from "@taigalabs/prfs-entities/bindings/GetShyChannelsRequest";
import { GetShyChannelsResponse } from "@taigalabs/prfs-entities/bindings/GetShyChannelsResponse";

import { api } from "../utils";
import { ApiResponse } from "../types";

type RequestName = "create_shy_post" | "get_shy_posts" | "get_shy_channels";

type Req<T extends RequestName> = //
  T extends "create_shy_post"
    ? CreateShyPostRequest
    : T extends "get_shy_posts"
    ? GetShyPostsRequest
    : T extends "get_shy_channels"
    ? GetShyChannelsRequest
    : never;

type Resp<T> = //
  T extends "create_shy_post"
    ? ApiResponse<CreateShyPostResponse>
    : T extends "get_shy_posts"
    ? ApiResponse<GetShyPostsResponse>
    : T extends "get_shy_channels"
    ? ApiResponse<GetShyChannelsResponse>
    : any;

let endpoint: string;
if (typeof process !== "undefined") {
  if (!process.env.NEXT_PUBLIC_PRFS_API_SERVER_ENDPOINT) {
    throw new Error("shy api endpoint not defined");
  }

  endpoint = `${process.env.NEXT_PUBLIC_PRFS_API_SERVER_ENDPOINT}/shy_api/v0`;
} else {
  throw new Error("process is undefined");
}

export async function shyApi<T extends RequestName>(name: T, req: Req<T>): Promise<Resp<T>> {
  return (await api(
    {
      path: name,
      req,
    },
    endpoint,
  )) as Resp<T>;
}
