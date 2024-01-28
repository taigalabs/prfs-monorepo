import React, { Suspense } from "react";

import styles from "./page.module.scss";
import DefaultLayout, { DefaultFooter } from "@/components/layouts/default_layout/DefaultLayout";
import GlobalFooter from "@/components/global_footer/GlobalFooter";
import ProofTypes from "@/components/proof_types/ProofTypes";
import {
  AttestationsDefaultBody,
  AttestationsMain,
  AttestationsMainInner,
} from "@/components/attestations/AttestationComponents";
import ProofTypeList from "@/components/proof_type_list/ProofTypeList";

const ProofTypesPage = () => {
  return (
    <DefaultLayout>
      <AttestationsDefaultBody>
        <Suspense>
          <ProofTypes>
            <AttestationsMain>
              <AttestationsMainInner>
                <ProofTypeList />
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
