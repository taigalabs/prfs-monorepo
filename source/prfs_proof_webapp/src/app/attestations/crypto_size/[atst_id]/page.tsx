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
import CryptoSizeAtstDetail from "@/components/crypto_size_atst_detail/CryptoSizeAtstDetail";

const TwitterAttestionDetailPage: React.FC<TwitterAttestionDetailPageProps> = ({ params }) => {
  return (
    <DefaultLayout>
      <DefaultBody noMinWidth>
        <Suspense>
          <Attestations>
            <AttestationsMain>
              <AttestationsMainInner>
                <CryptoSizeAtstDetail atst_id={params.atst_id} />
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

export default TwitterAttestionDetailPage;

interface TwitterAttestionDetailPageProps {
  params: {
    atst_id: string;
  };
}
