import React, { Suspense } from "react";

import styles from "./page.module.scss";
import DefaultLayout, { DefaultFooter } from "@/components/layouts/default_layout/DefaultLayout";
import GlobalFooter from "@/components/global_footer/GlobalFooter";
import Attestations from "@/components/attestations/Attestations";
import CreateAttestation from "@/components/create_attestation/CreateAttestation";
import CreateTwitterAccAtst from "@/components/create_twitter_acc_atst/CreateTwitterAccAtst";
import {
  AttestationsDefaultBody,
  AttestationsMain,
} from "@/components/attestations/AttestationComponents";

const CreateTwitterAttestionPage = () => {
  return (
    <DefaultLayout>
      <AttestationsDefaultBody>
        <Suspense>
          <Attestations>
            <CreateAttestation>
              <CreateTwitterAccAtst />
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

export default CreateTwitterAttestionPage;
