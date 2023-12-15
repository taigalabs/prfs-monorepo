import React from "react";
import cn from "classnames";
import Link from "next/link";
import { AiOutlineClose } from "@react-icons/all-files/ai/AiOutlineClose";

import styles from "./HomeMasthead.module.scss";
import { getI18N } from "@/i18n/get_i18n";
import {
  MastheadRightGroup,
  MastheadRightGroupMenu,
  MastheadWrapper,
} from "@/components/masthead/Masthead";

const HomeMastheadFallback: React.FC = async () => {
  const i18n = await getI18N();

  return (
    <MastheadWrapper>
      <MastheadRightGroup>
        <MastheadRightGroupMenu>
          <span>{i18n.tutorial}</span>
          <AiOutlineClose />
        </MastheadRightGroupMenu>
        <MastheadRightGroupMenu className={cn(styles.bigScreen)}>
          <Link href={process.env.NEXT_PUBLIC_DOCS_WEBSITE_ENDPOINT}>{i18n.docs}</Link>
        </MastheadRightGroupMenu>
      </MastheadRightGroup>
    </MastheadWrapper>
  );
};

export default HomeMastheadFallback;

export interface MastheadProps {}
