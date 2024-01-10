"use client";

import React from "react";
import Link from "next/link";

import styles from "./LeftBar.module.scss";
import { i18nContext } from "@/i18n/context";
import { paths } from "@/paths";
import PostDialog from "@/components/post_dialog/PostDialog";
import ShyLogo from "@/components/shy_logo/ShyLogo";
import { LocalShyCredential } from "@/storage/local_storage";
import MyAvatar from "../my_avatar/MyAvatar";

const LeftBar: React.FC<LeftBarProps> = ({ credential }) => {
  const i18n = React.useContext(i18nContext);

  return (
    <div className={styles.wrapper}>
      <div className={styles.logoContainer}>
        <Link href={paths.__}>
          <ShyLogo width={58} />
        </Link>
      </div>
      <div>
        <MyAvatar credential={credential} />
      </div>
      <ul className={styles.mainMenu}>
        <li></li>
        <li></li>
      </ul>
      <div>
        {/* <PostDialog> */}
        {/*   <button className={styles.postBtn}>{i18n.post}</button> */}
        {/* </PostDialog> */}
      </div>
    </div>
  );
};

export default LeftBar;

export interface LeftBarProps {
  credential: LocalShyCredential;
}
