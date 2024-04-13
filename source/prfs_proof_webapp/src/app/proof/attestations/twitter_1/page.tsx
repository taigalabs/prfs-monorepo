import React, { Suspense } from "react";

import styles from "./page.module.scss";
import DefaultLayout from "@/components/layouts/default_layout/DefaultLayout";
import Attestations from "@/components/attestations/Attestations";
import TwitterAccAtstList from "@/components/twitter_acc_atst_list/TwitterAccAtstList";
import { AppDefaultBody, AppMain, AppMainInner } from "@/components/app_components/AppComponents";

const TwitterAttestionPage = () => {
  return (
    <DefaultLayout>
      <AppDefaultBody>
        <Suspense>
          <Attestations>
            <AppMain>
              <AppMainInner>
                <TwitterAccAtstList />
              </AppMainInner>
            </AppMain>
          </Attestations>
        </Suspense>
      </AppDefaultBody>
    </DefaultLayout>
  );
};

export default TwitterAttestionPage;
