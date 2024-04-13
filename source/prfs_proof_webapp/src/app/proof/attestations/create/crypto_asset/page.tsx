import React, { Suspense } from "react";

import styles from "./page.module.scss";
import DefaultLayout from "@/components/layouts/default_layout/DefaultLayout";
import Attestations from "@/components/attestations/Attestations";
import CreateAttestation from "@/components/create_attestation/CreateAttestation";
import CreateCryptoAssetAtst from "@/components/create_crypto_asset_atst/CreateCryptoAssetAtst";
import { AppDefaultBody } from "@/components/app_components/AppComponents";

const CreateCryptoAssetAtstPage = () => {
  return (
    <DefaultLayout>
      <AppDefaultBody>
        <Suspense>
          <Attestations>
            <CreateAttestation>
              <CreateCryptoAssetAtst />
            </CreateAttestation>
          </Attestations>
        </Suspense>
      </AppDefaultBody>
    </DefaultLayout>
  );
};

export default CreateCryptoAssetAtstPage;
