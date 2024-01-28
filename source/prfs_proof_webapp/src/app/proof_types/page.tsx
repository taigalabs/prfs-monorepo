import React, { Suspense } from "react";

import styles from "./page.module.scss";
import DefaultLayout, { DefaultFooter } from "@/components/layouts/default_layout/DefaultLayout";
import GlobalFooter from "@/components/global_footer/GlobalFooter";
// import Attestations from "@/components/attestations/Attestations";
import ProofTypes from "@/components/proof_types/ProofTypes";
import TwitterAccAtstList from "@/components/twitter_acc_atst_list/TwitterAccAtstList";
import {
  AttestationsDefaultBody,
  AttestationsMain,
  AttestationsMainInner,
} from "@/components/attestations/AttestationComponents";

const ProofTypesPage = () => {
  return (
    <DefaultLayout>
      <AttestationsDefaultBody>
        <Suspense>
          <ProofTypes>
            <AttestationsMain>
              <AttestationsMainInner>
                <TwitterAccAtstList />
              </AttestationsMainInner>
            </AttestationsMain>
          </ProofTypes>
        </Suspense>
      </AttestationsDefaultBody>
      <DefaultFooter>
        <GlobalFooter />
      </DefaultFooter>
    </DefaultLayout>
  );
};

export default ProofTypesPage;
