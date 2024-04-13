import React, { Suspense } from "react";

import styles from "./page.module.scss";
import DefaultLayout from "@/components/layouts/default_layout/DefaultLayout";
import { AppDefaultBody, AppMain, AppMainInner } from "@/components/app_components/AppComponents";
import Set from "@/components/set/Set";
import Sets from "@/components/sets/Sets";

const SetPage: React.FC<SetPageProps> = ({ params }) => {
  return (
    <DefaultLayout>
      <AppDefaultBody>
        <Suspense>
          <Sets>
            <AppMain>
              <AppMainInner>
                <Set set_id={params.set_id} />
              </AppMainInner>
            </AppMain>
          </Sets>
        </Suspense>
      </AppDefaultBody>
    </DefaultLayout>
  );
};

export default SetPage;

interface SetPageProps {
  params: {
    set_id: string;
  };
}
