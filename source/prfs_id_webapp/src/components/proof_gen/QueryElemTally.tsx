import React from "react";
import { useSearchParams } from "next/navigation";
import { PrfsIdCredential, parseProofGenSearchParams } from "@taigalabs/prfs-id-sdk-web";

import styles from "./QueryElemTally.module.scss";
import { i18nContext, useI18N } from "@/i18n/context";
import { useAppDispatch } from "@/state/hooks";
import { QueryElemTallyType } from "./query_elem";

const QueryElemTally: React.FC<QueryElemTallyProps> = ({ queryElemTally }) => {
  const i18n = useI18N();

  const elems = React.useMemo(() => {
    const el = [];
    const tally = queryElemTally;

    if (queryElemTally.commitment) {
      return <span>Commitment {tally.commitment}</span>;
    } else if (tally.encrypt) {
    } else if (tally.app_sign_in) {
    } else if (tally.rand_key_pair) {
    }
  }, [queryElemTally]);

  return <div>{elems}</div>;
};

export default QueryElemTally;

export interface QueryElemTallyProps {
  queryElemTally: QueryElemTallyType;
}
