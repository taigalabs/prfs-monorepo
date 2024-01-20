import React, { Suspense } from "react";

import styles from "./page.module.scss";
import DefaultLayout, {
  DefaultBody,
  DefaultFooter,
} from "@/components/layouts/default_layout/DefaultLayout";
import GlobalFooter from "@/components/global_footer/GlobalFooter";
import Attestations from "@/components/attestations/Attestations";
import CreateAttestation from "@/components/create_attestation/CreateAttestation";
import CreateCryptoSizeAttestation from "@/components/create_crypto_size_atst/CreateCryptoSizeAtst";

const CreateCryptoSizeAttestionPage = () => {
  return (
    <DefaultLayout>
      <DefaultBody noMinWidth>
        <Suspense>
          <Attestations>
            <CreateAttestation>
              <CreateCryptoSizeAttestation />
            </CreateAttestation>
          </Attestations>
        </Suspense>
      </DefaultBody>
      <DefaultFooter>
        <GlobalFooter />
      </DefaultFooter>
    </DefaultLayout>
  );
};

export default CreateCryptoSizeAttestionPage;
