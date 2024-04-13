import React, { Suspense } from "react";

import styles from "./page.module.scss";
import DefaultLayout from "@/components/layouts/default_layout/DefaultLayout";
import Attestations from "@/components/attestations/Attestations";
import CreateAttestation from "@/components/create_attestation/CreateAttestation";
import CreateGroupMemberAtst from "@/components/create_group_member_atst/CreateGroupMemberAtst";
import { AppDefaultBody } from "@/components/app_components/AppComponents";

const CreateGroupMemberAtstPage = () => {
  return (
    <DefaultLayout>
      <AppDefaultBody>
        <Suspense>
          <Attestations>
            <CreateAttestation>
              <CreateGroupMemberAtst />
            </CreateAttestation>
          </Attestations>
        </Suspense>
      </AppDefaultBody>
    </DefaultLayout>
  );
};

export default CreateGroupMemberAtstPage;
