import React, { Suspense } from "react";

import styles from "./page.module.scss";
import DefaultLayout, {
  DefaultBody,
  DefaultFooter,
} from "@/components/layouts/default_layout/DefaultLayout";
import GlobalFooter from "@/components/global_footer/GlobalFooter";
import Attestations from "@/components/attestations/Attestations";
import {
  AttestationsMain,
  AttestationsMainInner,
} from "@/components/attestations/AttestationComponents";
import CryptoSizeAtstList from "@/components/crypto_size_atst_list/CryptoSizeAtstList";

const CryptoSizePage = () => {
  return (
    <DefaultLayout>
      <DefaultBody noMinWidth className={styles.body}>
        <Suspense>
          <Attestations>
            <AttestationsMain>
              <AttestationsMainInner>
                <CryptoSizeAtstList />
              </AttestationsMainInner>
            </AttestationsMain>
          </Attestations>
        </Suspense>
      </DefaultBody>
      <DefaultFooter>
        <GlobalFooter />
      </DefaultFooter>
    </DefaultLayout>
  );
};

export default CryptoSizePage;
