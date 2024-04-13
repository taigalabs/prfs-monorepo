import React, { Suspense } from "react";

import styles from "./page.module.scss";
import DefaultLayout from "@/components/layouts/default_layout/DefaultLayout";
import CreateAttestation from "@/components/create_attestation/CreateAttestation";
import { AppDefaultBody } from "@/components/app_components/AppComponents";
import Sets from "@/components/sets/Sets";
import CreateSet from "@/components/create_set/CreateSet";

const CreateSetPage = () => {
  return (
    <DefaultLayout>
      <AppDefaultBody>
        <Suspense>
          <Sets>
            <CreateAttestation>
              <CreateSet />
            </CreateAttestation>
          </Sets>
        </Suspense>
      </AppDefaultBody>
    </DefaultLayout>
  );
};

export default CreateSetPage;
