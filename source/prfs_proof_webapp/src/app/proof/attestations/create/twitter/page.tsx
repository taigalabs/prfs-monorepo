import React, { Suspense } from "react";

import styles from "./page.module.scss";
import DefaultLayout from "@/components/layouts/default_layout/DefaultLayout";
import Attestations from "@/components/attestations/Attestations";
import CreateAttestation from "@/components/create_attestation/CreateAttestation";
import CreateTwitterAccAtst from "@/components/create_twitter_acc_atst/CreateTwitterAccAtst";
import { AppDefaultBody } from "@/components/app_components/AppComponents";

const CreateTwitterAttestionPage = () => {
  return (
    <DefaultLayout>
      <AppDefaultBody>
        <Suspense>
          <Attestations>
            <CreateAttestation>
              <CreateTwitterAccAtst />
            </CreateAttestation>
          </Attestations>
        </Suspense>
      </AppDefaultBody>
    </DefaultLayout>
  );
};

export default CreateTwitterAttestionPage;
