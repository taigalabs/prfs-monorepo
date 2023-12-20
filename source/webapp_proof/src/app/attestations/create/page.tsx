import React, { Suspense } from "react";

import styles from "./page.module.scss";
import DefaultLayout, {
  DefaultBody,
  DefaultFooter,
} from "@/components/layouts/default_layout/DefaultLayout";
import GlobalFooter from "@/components/global_footer/GlobalFooter";
import Attestations from "@/components/attestations/Attestations";
import AttestationsCreate from "@/components/attestions_create/AttestationsCreate";
import TwitterAccAttestation from "@/components/twitter_acc_attestation/TwitterAccAttestation";

const TwitterAttestionPage = () => {
  return (
    <DefaultLayout>
      <DefaultBody noMinWidth>
        <Suspense>
          <Attestations>
            <AttestationsCreate>
              <TwitterAccAttestation />
            </AttestationsCreate>
          </Attestations>
        </Suspense>
      </DefaultBody>
      <DefaultFooter>
        <GlobalFooter />
      </DefaultFooter>
    </DefaultLayout>
  );
};

export default TwitterAttestionPage;
