import React, { Suspense } from "react";

import styles from "./page.module.scss";
import DefaultLayout, { DefaultFooter } from "@/components/layouts/default_layout/DefaultLayout";
import GlobalFooter from "@/components/global_footer/GlobalFooter";
import CreateAttestation from "@/components/create_attestation/CreateAttestation";
import { AttestationsDefaultBody } from "@/components/attestations/AttestationComponents";
import Sets from "@/components/sets/Sets";
import CreateSet from "@/components/create_set/CreateSet";

const CreateSetPage = () => {
  return (
    <DefaultLayout>
      <AttestationsDefaultBody>
        <Suspense>
          <Sets>
            <CreateAttestation>
              <CreateSet />
            </CreateAttestation>
          </Sets>
        </Suspense>
      </AttestationsDefaultBody>
      <DefaultFooter>
        <GlobalFooter />
      </DefaultFooter>
    </DefaultLayout>
  );
};

export default CreateSetPage;
