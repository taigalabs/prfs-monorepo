import React, { Suspense } from "react";

import styles from "./page.module.scss";
import DefaultLayout, { DefaultFooter } from "@/components/layouts/default_layout/DefaultLayout";
import GlobalFooter from "@/components/global_footer/GlobalFooter";
import {
  AttestationsDefaultBody,
  AttestationsMain,
  AttestationsMainInner,
} from "@/components/attestations/AttestationComponents";
import CryptoHolderSet from "@/components/crypto_holder_set/CryptoHolderSet";
import Sets from "@/components/sets/Sets";

const SetPage: React.FC<SetPageProps> = () => {
  return (
    <DefaultLayout>
      <AttestationsDefaultBody>
        <Suspense>
          <Sets>
            <AttestationsMain>
              <AttestationsMainInner>
                <CryptoHolderSet />
              </AttestationsMainInner>
            </AttestationsMain>
          </Sets>
        </Suspense>
      </AttestationsDefaultBody>
      <DefaultFooter>
        <GlobalFooter />
      </DefaultFooter>
    </DefaultLayout>
  );
};

export default SetPage;

interface SetPageProps {
  params: {
    set_id: string;
  };
}
