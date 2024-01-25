import React, { Suspense } from "react";

import styles from "./page.module.scss";
import DefaultLayout, { DefaultFooter } from "@/components/layouts/default_layout/DefaultLayout";
import GlobalFooter from "@/components/global_footer/GlobalFooter";
import Attestations from "@/components/attestations/Attestations";
import CreateAttestation from "@/components/create_attestation/CreateAttestation";
import CreateCryptoAssetSizeAttestation from "@/components/create_crypto_asset_size_atst/CreateCryptoAssetSizeAtst";
import { AttestationsDefaultBody } from "@/components/attestations/AttestationComponents";

const CreateCryptoSizeAttestionPage = () => {
  return (
    <DefaultLayout>
      <AttestationsDefaultBody>
        <Suspense>
          <Attestations>
            <CreateAttestation>
              <CreateCryptoAssetSizeAttestation />
            </CreateAttestation>
          </Attestations>
        </Suspense>
      </AttestationsDefaultBody>
      <DefaultFooter>
        <GlobalFooter />
      </DefaultFooter>
    </DefaultLayout>
  );
};

export default CreateCryptoSizeAttestionPage;
