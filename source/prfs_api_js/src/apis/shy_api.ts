import { CreateSocialPostRequest } from "@taigalabs/prfs-entities/bindings/CreateSocialPostRequest";
import { CreateSocialPostResponse } from "@taigalabs/prfs-entities/bindings/CreateSocialPostResponse";
import { GetSocialPostsRequest } from "@taigalabs/prfs-entities/bindings/GetSocialPostsRequest";
import { GetSocialPostsResponse } from "@taigalabs/prfs-entities/bindings/GetSocialPostsResponse";

import { api } from "../utils";
import { PrfsApiResponse } from "../types";

type RequestName = "create_social_post" | "get_social_posts";

type Req<T extends RequestName> = //
  T extends "create_social_post"
    ? CreateSocialPostRequest
    : T extends "get_social_posts"
    ? GetSocialPostsRequest
    : never;

type Resp<T> = //
  T extends "create_social_post"
    ? PrfsApiResponse<CreateSocialPostResponse>
    : T extends "get_social_posts"
    ? PrfsApiResponse<GetSocialPostsResponse>
    : any;

let endpoint: string;
if (typeof process !== "undefined") {
  endpoint = `${process.env.NEXT_PUBLIC_SHY_API_SERVER_ENDPOINT}/shy_api/v0`;
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
