import React from "react";
import Logo from "@taigalabs/prfs-react-components/src/logo/Logo";
import { FaSearch } from "@react-icons/all-files/fa/FaSearch";
import Link from "next/link";
import ActiveLink from "@taigalabs/prfs-react-components/src/active_link/ActiveLink";
import { BiBitcoin } from "@react-icons/all-files/bi/BiBitcoin";
import { AiOutlineStock } from "@react-icons/all-files/ai/AiOutlineStock";
import { AiFillPicture } from "@react-icons/all-files/ai/AiFillPicture";

import styles from "./LeftBar.module.scss";
import { i18nContext } from "@/contexts/i18n";
import { paths } from "@/paths";

const LeftBar: React.FC = () => {
  const i18n = React.useContext(i18nContext);

  return (
    <div className={styles.wrapper}>
      <div className={styles.logoContainer}>
        <Link href={paths.__}>
          <p>{i18n.vacade}</p>
          <p className={styles.betaTag}>Beta</p>
        </Link>
      </div>
      <ul className={styles.mainMenu}>
        <li>
          <ActiveLink href={`${paths.c}/crypto`}>
            <BiBitcoin />
            {i18n.crypto}
          </ActiveLink>
        </li>
        <li>
          <ActiveLink href={`${paths.c}/defi`}>
            <AiOutlineStock />
            {i18n.defi}
          </ActiveLink>
        </li>
        <li>
          <ActiveLink href={`${paths.c}/nft`}>
            <AiFillPicture />
            {i18n.nft}
          </ActiveLink>
        </li>
      </ul>
    </div>
  );
};

export default LeftBar;
