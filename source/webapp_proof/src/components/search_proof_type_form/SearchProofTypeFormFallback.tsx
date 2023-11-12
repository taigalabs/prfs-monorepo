import React from "react";
import cn from "classnames";
import Link from "next/link";

import styles from "./SearchProofTypeForm.module.scss";
import LogoContainer from "@/components/logo_container/LogoContainer";
import { paths } from "@/paths";
import { getI18N } from "@/i18n/getI18N";

const SearchProofTypeFormFallback: React.FC = async () => {
  const i18n = await getI18N();

  return (
    <div className={styles.wrapper}>
      <LogoContainer proofTypeChosen={false} />
      <div className={cn(styles.formArea)}>
        <div
          className={cn({
            [styles.formWrapper]: true,
          })}
        >
          <div className={styles.proofTypeRow}>{i18n.search_proof_dialog}</div>
          <div className={styles.welcomeRow}>
            <span>{i18n.create_and_share_proofs}</span>
            <Link href={`${paths.__}/?tutorial_id=simple_hash`}>How?</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchProofTypeFormFallback;
