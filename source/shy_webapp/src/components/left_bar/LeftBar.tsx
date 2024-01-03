"use client";

import React from "react";
import Logo from "@taigalabs/prfs-react-lib/src/logo/Logo";
import Link from "next/link";

import styles from "./LeftBar.module.scss";
import { i18nContext } from "@/i18n/context";
import { paths } from "@/paths";
import PostDialog from "@/components/post_dialog/PostDialog";
import LogoContainer from "@/components/logo_container/LogoContainer";

const LeftBar: React.FC = () => {
  const i18n = React.useContext(i18nContext);

  return (
    <div className={styles.wrapper}>
      <div className={styles.logoContainer}>
        <Link href={paths.__}>
          <LogoContainer width={70} />
        </Link>
      </div>
      {/* <ul className={styles.mainMenu}> */}
      {/*   <li> */}
      {/*     <ActiveLink href={`${paths.c}/crypto`}> */}
      {/*       <BiBitcoin /> */}
      {/*       {i18n.crypto} */}
      {/*     </ActiveLink> */}
      {/*   </li> */}
      {/*   <li> */}
      {/*     <ActiveLink href={`${paths.c}/defi`}> */}
      {/*       <AiOutlineStock /> */}
      {/*       {i18n.defi} */}
      {/*     </ActiveLink> */}
      {/*   </li> */}
      {/*   <li> */}
      {/*     <ActiveLink href={`${paths.c}/nft`}> */}
      {/*       <AiFillPicture /> */}
      {/*       {i18n.nft} */}
      {/*     </ActiveLink> */}
      {/*   </li> */}
      {/* </ul> */}
      <div>
        <PostDialog>
          <button className={styles.postBtn}>{i18n.post}</button>
        </PostDialog>
      </div>
    </div>
  );
};

export default LeftBar;
