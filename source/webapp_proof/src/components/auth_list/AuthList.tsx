"use client";

import React from "react";
import Fade from "@taigalabs/prfs-react-components/src/fade/Fade";
import cn from "classnames";
import { prfsApi2 } from "@taigalabs/prfs-api-js";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";

import styles from "./AuthList.module.scss";
import ProofTypeMasthead from "@/components/masthead/ProofTypeMasthead";
import { i18nContext } from "@/contexts/i18n";

const AuthList: React.FC = () => {
  const i18n = React.useContext(i18nContext);

  return (
    <div className={styles.wrapper}>
      <ul className={styles.list}>
        <li className={styles.listItem}>
          <button>
            <img
              src="https://d1w1533jipmvi2.cloudfront.net/x-logo-black.png"
              alt="Twitter"
              crossOrigin=""
            />
            <p>{i18n.authorize_twitter_account}</p>
          </button>
        </li>
      </ul>
    </div>
  );
};

export default AuthList;
