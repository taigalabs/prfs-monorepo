import React, { Suspense } from "react";

import styles from "./page.module.scss";
import DefaultLayout, { DefaultFooter } from "@/components/layouts/default_layout/DefaultLayout";
import GlobalFooter from "@/components/global_footer/GlobalFooter";
import Attestations from "@/components/attestations/Attestations";
import {
  AttestationsDefaultBody,
  AttestationsMain,
  AttestationsMainInner,
} from "@/components/attestations/AttestationComponents";
import SetElementDetail from "@/components/set_element_detail/SetElementDetail";

const SetElementPage: React.FC<SetElementPageProps> = ({ params }) => {
  return (
    <DefaultLayout>
      <AttestationsDefaultBody>
        <Suspense>
          <Attestations>
            <AttestationsMain>
              <AttestationsMainInner>
                <SetElementDetail element_label={params.element_label} set_id={params.set_id} />
              </AttestationsMainInner>
            </AttestationsMain>
          </Attestations>
        </Suspense>
      </AttestationsDefaultBody>
      <DefaultFooter>
        <GlobalFooter />
      </DefaultFooter>
    </DefaultLayout>
  );
};

export default SetElementPage;

interface SetElementPageProps {
  params: {
    set_id: string;
    element_label: string;
  };
}
