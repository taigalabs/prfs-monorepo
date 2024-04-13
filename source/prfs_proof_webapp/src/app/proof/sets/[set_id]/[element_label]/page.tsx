import React, { Suspense } from "react";

import styles from "./page.module.scss";
import DefaultLayout from "@/components/layouts/default_layout/DefaultLayout";
import { AppDefaultBody, AppMain, AppMainInner } from "@/components/app_components/AppComponents";
import SetElementDetail from "@/components/set_element_detail/SetElementDetail";
import Sets from "@/components/sets/Sets";

const SetElementPage: React.FC<SetElementPageProps> = ({ params }) => {
  return (
    <DefaultLayout>
      <AppDefaultBody>
        <Suspense>
          <Sets>
            <AppMain>
              <AppMainInner>
                <SetElementDetail element_label={params.element_label} set_id={params.set_id} />
              </AppMainInner>
            </AppMain>
          </Sets>
        </Suspense>
      </AppDefaultBody>
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
