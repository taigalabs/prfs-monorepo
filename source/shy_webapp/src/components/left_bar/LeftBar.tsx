"use client";

import React from "react";
import Link from "next/link";
import PrfsCredentialPopover from "@taigalabs/prfs-react-lib/src/prfs_credential_popover/PrfsCredentialPopover";

import styles from "./LeftBar.module.scss";
import { i18nContext } from "@/i18n/context";
import { paths } from "@/paths";
import PostDialog from "@/components/post_dialog/PostDialog";
import ShyLogo from "@/components/shy_logo/ShyLogo";
import { LocalShyCredential, removeLocalShyCredential } from "@/storage/local_storage";
import MyAvatar from "../my_avatar/MyAvatar";
import { useAppDispatch } from "@/state/hooks";
import { signOutShy } from "@/state/userReducer";

const LeftBar: React.FC<LeftBarProps> = ({ credential }) => {
  const i18n = React.useContext(i18nContext);
  const dispatch = useAppDispatch();

  const handleClickSignOut = React.useCallback(() => {
    removeLocalShyCredential();
    dispatch(signOutShy());
  }, [dispatch]);

  const handleInitFail = React.useCallback(() => {
    console.log("Failed init Prfs Proof credential!");
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.logoContainer}>
        <Link href={paths.__}>
          <ShyLogo width={58} />
        </Link>
      </div>
      <div>
        <div>{i18n.channels}</div>
      </div>
      <ul className={styles.mainMenu}>
        {/* <li>{i18n}</li> */}
        <li></li>
      </ul>
      <div>
        <PrfsCredentialPopover
          credential={credential}
          handleInitFail={handleInitFail}
          handleClickSignOut={handleClickSignOut}
        />
      </div>
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
