import React, { Suspense } from "react";

import styles from "./page.module.scss";
import DefaultLayout from "@/components/layouts/default_layout/DefaultLayout";
import Attestations from "@/components/attestations/Attestations";
import { AppDefaultBody, AppMain, AppMainInner } from "@/components/app_components/AppComponents";
import AttestationList from "@/components/attestation_list/AttestationList";

const AtstGroupPage: React.FC<AtstGroupPageProps> = ({ params }) => {
  return (
    <DefaultLayout viewportHeight>
      <AppDefaultBody>
        <Suspense>
          <Attestations>
            <AppMain>
              <AppMainInner>
                <AttestationList atst_group_id={params.atst_group_id} />
              </AppMainInner>
            </AppMain>
          </Attestations>
        </Suspense>
      </AppDefaultBody>
    </DefaultLayout>
  );
};

export default AtstGroupPage;

interface AtstGroupPageProps {
  params: {
    atst_group_id: string;
  };
}
