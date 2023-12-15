import React from "react";
import cn from "classnames";
import Link from "next/link";
import { AiOutlineClose } from "@react-icons/all-files/ai/AiOutlineClose";

import styles from "./HomeMasthead.module.scss";
import { getI18N } from "@/i18n/get_i18n";

const HomeMastheadFallback: React.FC<MastheadProps> = async () => {
  const i18n = await getI18N();

  return (
    <div className={cn(styles.wrapper)}>
      <div className={styles.inner}>
        <ul className={styles.rightGroup}>
          <li className={styles.menu}>
            <span>{i18n.tutorial}</span>
            <AiOutlineClose />
          </li>
          <li className={cn(styles.bigScreen)}>
            <Link href={process.env.NEXT_PUBLIC_DOCS_WEBSITE_ENDPOINT}>{i18n.docs}</Link>
          </li>
          <li className={styles.menu}></li>
          {/* <li>{i18n.account}</li> */}
        </ul>
      </div>
    </div>
  );
};

export default HomeMastheadFallback;

export interface MastheadProps {}
