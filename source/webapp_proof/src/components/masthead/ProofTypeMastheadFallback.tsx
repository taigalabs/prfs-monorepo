import React from "react";
import cn from "classnames";
import Link from "next/link";
import { BsBook } from "@react-icons/all-files/bs/BsBook";
import ImageLogo from "@taigalabs/prfs-react-components/src/image_logo/ImageLogo";
import Tooltip from "@taigalabs/prfs-react-components/src/tooltip/Tooltip";
import { IoMdSchool } from "@react-icons/all-files/io/IoMdSchool";

import styles from "./ProofTypeMasthead.module.scss";
import { paths } from "@/paths";
import { getI18N } from "@/i18n/getI18N";

const ProofTypeMastheadFallback: React.FC<ProofTypeMastheadProps> = async () => {
  const i18n = await getI18N();

  return (
    <div className={cn(styles.wrapper)}>
      <div className={styles.inner}>
        <div className={styles.logoArea}>
          <a href={paths.__}>
            <ImageLogo width={50} />
          </a>
        </div>
        <div className={styles.searchArea}>{i18n.search_proof_dialog}</div>
        <ul className={styles.rightArea}>
          {/* <Tooltip label={i18n.tutorial}> */}
          <li className={styles.menu}>
            <a>
              <IoMdSchool />
            </a>
          </li>
          {/* </Tooltip> */}
          {/* <Tooltip label={i18n.docs}> */}
          <li className={cn(styles.menu, styles.bigScreen)}>
            <Link href={process.env.NEXT_PUBLIC_DOCS_WEBSITE_ENDPOINT}>
              <BsBook />
            </Link>
          </li>
          {/* </Tooltip> */}
          <li className={styles.appPopover}>{i18n.prfs_apps}</li>
          {/* <li>{i18n.account}</li> */}
        </ul>
      </div>
    </div>
  );
};

export default ProofTypeMastheadFallback;

export interface ProofTypeMastheadProps {}
