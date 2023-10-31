import React from "react";
import { BiLinkExternal } from "@react-icons/all-files/bi/BiLinkExternal";
import cn from "classnames";

import styles from "./NavbarExtraContent.module.scss";

const NavbarExtraContent: React.FC<NavbarExtraContentProps> = () => {
  return (
    <div
      className={cn(
        "nx-text-sm contrast-more:nx-text-gray-700 contrast-more:dark:nx-text-gray-100 nx-relative -nx-ml-2 nx-hidden nx-whitespace-nowrap nx-p-2 md:nx-inline-block nx-text-gray-600 hover:nx-text-gray-800 dark:nx-text-gray-400 dark:hover:nx-text-gray-200",
        styles.wrapper,
      )}
    >
      <a className={styles.link} href={process.env.NEXT_PUBLIC_WEBAPP_PROOF_ENDPOINT}>
        <span>Prfs</span>
        <BiLinkExternal />
      </a>
      <a className={styles.link} href={process.env.NEXT_PUBLIC_CODE_REPOSITORY_URL}>
        <span>Code</span>
      </a>
    </div>
  );
};

export default NavbarExtraContent;

export interface NavbarExtraContentProps {}
