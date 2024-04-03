import React, { Suspense } from "react";

import styles from "./page.module.scss";
import DefaultLayout, { DefaultFooter } from "@/components/layouts/default_layout/DefaultLayout";
import GlobalFooter from "@/components/global_footer/GlobalFooter";
import Attestations from "@/components/attestations/Attestations";
import CreateAttestation from "@/components/create_attestation/CreateAttestation";
import CreateGroupMemberAtst from "@/components/create_group_member_atst/CreateGroupMemberAtst";
import { AttestationsDefaultBody } from "@/components/attestations/AttestationComponents";

const CreateGroupMemberAtstPage = () => {
  return (
    <DefaultLayout>
      <AttestationsDefaultBody>
        <Suspense>
          <Attestations>
            <CreateAttestation>
              <CreateGroupMemberAtst />
            </CreateAttestation>
          </Attestations>
        </Suspense>
      </AttestationsDefaultBody>
      {/* <DefaultFooter> */}
      {/*   <GlobalFooter /> */}
      {/* </DefaultFooter> */}
    </DefaultLayout>
  );
};

export default CreateGroupMemberAtstPage;
