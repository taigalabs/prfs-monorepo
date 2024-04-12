import React, { Suspense } from "react";

import styles from "./page.module.scss";
import DefaultLayout from "@/components/layouts/default_layout/DefaultLayout";
import ProofTypes from "@/components/proof_types/ProofTypes";
import { AppDefaultBody, AppMain, AppMainInner } from "@/components/app_components/AppComponents";
import ProofTypeList from "@/components/proof_type_list/ProofTypeList";

const ProofTypesPage = () => {
  return (
    <DefaultLayout>
      <AppDefaultBody>
        <Suspense>
          <ProofTypes>
            <AppMain>
              <AppMainInner>
                <ProofTypeList />
              </AppMainInner>
            </AppMain>
          </ProofTypes>
        </Suspense>
      </AppDefaultBody>
    </DefaultLayout>
  );
};

export default ProofTypesPage;
