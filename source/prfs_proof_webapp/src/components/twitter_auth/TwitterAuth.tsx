"use client";

import React from "react";
import { PrfsProofType } from "@taigalabs/prfs-entities/bindings/PrfsProofType";
import cn from "classnames";

import styles from "./TwitterAuth.module.scss";
import { i18nContext } from "@/i18n/context";
import CaptionedImg from "@taigalabs/prfs-react-components/src/captioned_img/CaptionedImg";
import { envs } from "@/envs";

const TWITTER_CLIENT_ID = "UU9OZ0hNOGVPelVtakgwMlVmeEw6MTpjaQ";

// const url =
//   "https://twitter.com/i/oauth2/authorize?response_type=code&client_id=UU9OZ0hNOGVPelVtakgwMlVmeEw6MTpjaQ&redirect_uri=http://127.0.0.1:4020/oauth/twitter&scope=tweet.read%20users.read%20follows.read%20follows.write&state=state&code_challenge=challenge&code_challenge_method=plain";

function getTwitterOauthUrl() {
  const rootUrl = "https://twitter.com/i/oauth2/authorize";
  const options = {
    redirect_uri: envs.NEXT_PUBLIC_TWITTER_OAUTH_REDIRECT_URL,
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
  React.useEffect(() => {}, []);

  const url = React.useMemo(() => getTwitterOauthUrl(), []);

  return (
    <div className={styles.wrapper}>
      <a className="a-button row-container" href={url}>
        {/* <Image src={twitterIcon} alt="twitter icon" /> */}
        <p>{" twitter"}</p>
      </a>
    </div>
  );
};

export default TwitterAuth;

export interface TwitterAuthProps {}
