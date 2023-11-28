"use client";

import React from "react";
import Image from "next/image";
import { PrfsProofType } from "@taigalabs/prfs-entities/bindings/PrfsProofType";
import cn from "classnames";
import dayjs from "dayjs";

import styles from "./TwitterAuth.module.scss";
import { i18nContext } from "@/contexts/i18n";
import CaptionedImg from "@taigalabs/prfs-react-components/src/captioned_img/CaptionedImg";
import { Markdown } from "../markdown/Markdown";
import { envs } from "@/envs";

const TWITTER_CLIENT_ID = "UU9OZ0hNOGVPelVtakgwMlVmeEw6MTpjaQ"; // give your twitter client id here

// const url =
//   "https://twitter.com/i/oauth2/authorize?response_type=code&client_id=UU9OZ0hNOGVPelVtakgwMlVmeEw6MTpjaQ&redirect_uri=http://127.0.0.1:4020/oauth/twitter&scope=tweet.read%20users.read%20follows.read%20follows.write&state=state&code_challenge=challenge&code_challenge_method=plain";

function getTwitterOauthUrl() {
  const rootUrl = "https://twitter.com/i/oauth2/authorize";
  const options = {
    redirect_uri: `${envs.NEXT_PUBLIC_PRFS_AUTH_OP_SERVER_ENDPOINT}/oauth/twitter`, // client url cannot be http://localhost:3000/ or http://127.0.0.1:3000/
    client_id: TWITTER_CLIENT_ID,
    state: "state",
    response_type: "code",
    code_challenge: "challenge",
    code_challenge_method: "plain",
  };
  const scope = "scope=tweet.read%20users.read%20follows.read%20follows.write";

  const qs = new URLSearchParams(options).toString();
  let url2 = `${rootUrl}?${decodeURIComponent(qs)}&${scope}`;

  return url2;
}

const TwitterAuth: React.FC<TwitterAuthProps> = ({}) => {
  const url = getTwitterOauthUrl();

  return (
    <div className={styles.wrapper}>
      123123
      <a className="a-button row-container" href={url}>
        {/* <Image src={twitterIcon} alt="twitter icon" /> */}
        <p>{" twitter"}</p>
      </a>
    </div>
  );
};

export default TwitterAuth;

export interface TwitterAuthProps {}
