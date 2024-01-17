"use client";

import React from "react";
import cn from "classnames";
import Link from "next/link";
import { MdDashboard } from "@react-icons/all-files/md/MdDashboard";

import styles from "./LeftBar.module.scss";
import { i18nContext } from "@/i18n/context";
import { paths } from "@/paths";
import PostDialog from "@/components/post_dialog/PostDialog";
import ShyLogo from "@/components/shy_logo/ShyLogo";
import { LocalShyCredential, removeLocalShyCredential } from "@/storage/local_storage";
import { useAppDispatch } from "@/state/hooks";
import { signOutShy } from "@/state/userReducer";
import CredentialPopover from "@/components/credential_popover/CredentialPopover";
import { GetShyChannelsResponse } from "@taigalabs/prfs-entities/bindings/GetShyChannelsResponse";
import { ShyChannel } from "@taigalabs/prfs-entities/bindings/ShyChannel";

const LeftBar: React.FC<LeftBarProps> = ({ credential, channels }) => {
  const i18n = React.useContext(i18nContext);
  const dispatch = useAppDispatch();

  const handleClickSignOut = React.useCallback(() => {
    removeLocalShyCredential();
    dispatch(signOutShy());
  }, [dispatch]);

  const handleInitFail = React.useCallback(() => {
    console.log("Failed init Prfs Proof credential!");
  }, []);

  const mainMenu = React.useMemo(() => {
    if (channels) {
      return channels.map(ch => (
        <li className={styles.item} key={ch.channel_id}>
          {ch.label}
        </li>
      ));
    }
    return null;
  }, [channels]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.logoContainer}>
        <Link href={paths.__}>
          <ShyLogo width={58} />
        </Link>
      </div>
      <div className={cn(styles.section, styles.mainMenu)}>
        <div className={styles.sectionLabel}>
          <MdDashboard />
          <span>{i18n.channels}</span>
        </div>
        <ul>{mainMenu}</ul>
      </div>
      <div className={styles.credentialSection}>
        <CredentialPopover
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
  channels: ShyChannel[] | null;
}
