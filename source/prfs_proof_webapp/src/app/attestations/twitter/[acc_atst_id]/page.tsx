import React, { Suspense } from "react";

import styles from "./page.module.scss";
import DefaultLayout, {
  DefaultBody,
  DefaultFooter,
} from "@/components/layouts/default_layout/DefaultLayout";
import GlobalFooter from "@/components/global_footer/GlobalFooter";
import Attestations from "@/components/attestations/Attestations";
import AccAtstDetail from "@/components/acc_atst_detail/AccAtstDetail";
import {
  AttestationsMain,
  AttestationsMainInner,
} from "@/components/attestations/AttestationComponents";

const TwitterAttestionDetailPage: React.FC<TwitterAttestionDetailPageProps> = ({ params }) => {
  return (
    <DefaultLayout>
      <DefaultBody noMinWidth>
        <Suspense>
          <Attestations>
            <AttestationsMain>
              <AttestationsMainInner>
                <AccAtstDetail acc_atst_id={params.acc_atst_id} />
              </AttestationsMainInner>
            </AttestationsMain>
          </Attestations>
        </Suspense>
      </DefaultBody>
      <DefaultFooter>
        <GlobalFooter />
      </DefaultFooter>
    </DefaultLayout>
  );
};

export default TwitterAttestionDetailPage;

interface TwitterAttestionDetailPageProps {
  params: {
    acc_atst_id: string;
  };
}
