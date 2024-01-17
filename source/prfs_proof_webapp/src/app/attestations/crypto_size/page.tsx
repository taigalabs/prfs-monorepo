import React, { Suspense } from "react";

import styles from "./page.module.scss";
import DefaultLayout, {
  DefaultBody,
  DefaultFooter,
} from "@/components/layouts/default_layout/DefaultLayout";
import GlobalFooter from "@/components/global_footer/GlobalFooter";
import Attestations, { AttestationsMain } from "@/components/attestations/Attestations";
import CryptoSizeAtstList from "@/components/crypto_size_atst_list/CryptoSizeAtstList";
// import TwitterAccAtstList from "@/components/twitter_acc_atst_list/TwitterAccAtstList";

const CryptoSizePage = () => {
  return (
    <DefaultLayout>
      <DefaultBody noMinWidth>
        <Suspense>
          <Attestations>
            <AttestationsMain>
              <CryptoSizeAtstList />
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
