import React from "react";

import styles from "./NavbarExtraContent.module.scss";

const NavbarExtraContent: React.FC<NavbarExtraContentProps> = () => {
  return (
    <div className={styles.wrapper}>
      <div className="nx-text-sm contrast-more:nx-text-gray-700 contrast-more:dark:nx-text-gray-100 nx-relative -nx-ml-2 nx-hidden nx-whitespace-nowrap nx-p-2 md:nx-inline-block nx-text-gray-600 hover:nx-text-gray-800 dark:nx-text-gray-400 dark:hover:nx-text-gray-200">
        <a href="https://www.prfs.xyz">
          <span>Prfs</span>
        </a>
        <a href="https://github.com/taigalabs/prfs-monorepo">
          <span>Code</span>
        </a>
      </div>
    </div>
  );
};

export default NavbarExtraContent;

export interface NavbarExtraContentProps {}
