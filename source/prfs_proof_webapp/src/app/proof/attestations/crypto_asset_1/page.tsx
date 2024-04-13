import React, { Suspense } from "react";

import styles from "./page.module.scss";
import DefaultLayout from "@/components/layouts/default_layout/DefaultLayout";
import Attestations from "@/components/attestations/Attestations";
import { AppDefaultBody, AppMain, AppMainInner } from "@/components/app_components/AppComponents";
import CryptoAssetAtstList from "@/components/crypto_asset_atst_list/CryptoAssetAtstList";

const CryptoSizePage = () => {
  return (
    <DefaultLayout>
      <AppDefaultBody>
        <Suspense>
          <Attestations>
            <AppMain>
              <AppMainInner>
                <CryptoAssetAtstList />
              </AppMainInner>
            </AppMain>
          </Attestations>
        </Suspense>
      </AppDefaultBody>
    </DefaultLayout>
  );
};

export default CryptoSizePage;
