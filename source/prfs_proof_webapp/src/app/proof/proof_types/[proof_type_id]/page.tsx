import React, { Suspense } from "react";

import styles from "./page.module.scss";
import DefaultLayout from "@/components/layouts/default_layout/DefaultLayout";
import Attestations from "@/components/attestations/Attestations";
import { AppDefaultBody, AppMain, AppMainInner } from "@/components/app_components/AppComponents";
// import CryptoAssetAtstDetail from "@/components/crypto_asset_atst_detail/CryptoAssetAtstDetail";

const TwitterAttestionDetailPage: React.FC<TwitterAttestionDetailPageProps> = ({ params }) => {
  return (
    <DefaultLayout>
      <AppDefaultBody>
        <Suspense>
          <Attestations>
            <AppMain>
              <AppMainInner>
                {/* <CryptoAssetAtstDetail atst_id={params.atst_id} /> */}
              </AppMainInner>
            </AppMain>
          </Attestations>
        </Suspense>
      </AppDefaultBody>
    </DefaultLayout>
  );
};

export default TwitterAttestionDetailPage;

interface TwitterAttestionDetailPageProps {
  params: {
    atst_id: string;
  };
}
